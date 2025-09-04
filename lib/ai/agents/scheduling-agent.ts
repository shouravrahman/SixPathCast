import { BaseAgent } from './base-agent';
import { BrandProfile } from '../types';

export interface SchedulingRequest {
  content: string;
  platform: string;
  postType: string;
  targetAudience?: string;
  timeZone?: string;
  brandProfile?: BrandProfile;
}

export interface SchedulingSuggestion {
  optimalTime: string;
  alternativeTimes: string[];
  reasoning: string;
  dayOfWeek: string;
  engagement_prediction: number;
  best_practices: string[];
}

export class SchedulingAgent extends BaseAgent {
  constructor() {
    super('analytical');
  }

  getName(): string {
    return 'Content Scheduling Agent';
  }

  getDescription(): string {
    return 'Analyzes optimal posting times and schedules content across platforms';
  }

  async suggestOptimalTiming(request: SchedulingRequest) {
    return this.executeWithRetry(async () => {
      const suggestion = await this.analyzeOptimalTiming(request);
      return suggestion;
    }, 'scheduling analysis');
  }

  private async analyzeOptimalTiming(request: SchedulingRequest): Promise<SchedulingSuggestion> {
    const prompt = `You are a social media scheduling expert. Analyze the optimal posting time for this content.

Platform: ${request.platform}
Post Type: ${request.postType}
Content: ${request.content}
Target Audience: ${request.targetAudience || 'General audience'}
Time Zone: ${request.timeZone || 'UTC'}

${request.brandProfile ? this.buildAudienceContext(request.brandProfile) : ''}

Platform-specific timing data:
${this.getPlatformTimingData(request.platform)}

Provide optimal scheduling recommendations considering:
1. Platform-specific peak engagement times
2. Target audience demographics and behavior
3. Content type and engagement patterns
4. Day of week optimization
5. Global time zone considerations

Format as JSON:
{
  "optimalTime": "HH:MM (Day)",
  "alternativeTimes": ["HH:MM (Day)", "HH:MM (Day)"],
  "reasoning": "Detailed explanation of timing choice",
  "dayOfWeek": "Best day of week",
  "engagement_prediction": 85,
  "best_practices": ["practice1", "practice2"]
}`;

    const response = await this.invokeChain(prompt, request);
    return this.parseSchedulingResponse(response, request.platform);
  }

  private buildAudienceContext(brandProfile: BrandProfile): string {
    return `Audience Context:
- Industry: ${brandProfile.industry || 'Technology'}
- Target Audience: ${brandProfile.target_audience || 'Professionals'}
- Geographic Focus: Global (adjust for major markets)`;
  }

  private getPlatformTimingData(platform: string): string {
    const timingData = {
      linkedin: `
      - Peak times: 8-10 AM, 12-2 PM, 5-6 PM on weekdays
      - Best days: Tuesday-Thursday
      - Professional audience active during business hours
      - Avoid weekends for B2B content`,

      twitter: `
      - Peak times: 9 AM, 1-3 PM, 8-9 PM on weekdays
      - Best days: Wednesday-Friday
      - Real-time engagement platform
      - Evening engagement for entertainment content`,

      instagram: `
      - Peak times: 11 AM-1 PM, 2-3 PM, 5-7 PM
      - Best days: Tuesday-Friday
      - Visual content performs better on weekends
      - Stories peak in evenings`,

      youtube: `
      - Peak times: 2-4 PM, 8-9 PM on weekdays
      - Best days: Thursday-Saturday
      - Weekend viewing higher for entertainment
      - Consider time zones for global audience`,

      facebook: `
      - Peak times: 1-3 PM, 8-9 PM on weekdays
      - Best days: Tuesday-Thursday
      - Older demographic, different peak times
      - Weekend engagement varies by content type`,

      tiktok: `
      - Peak times: 6-10 AM, 7-9 PM
      - Best days: Tuesday-Thursday
      - Younger audience, different patterns
      - Evening entertainment content performs well`
    };

    return timingData[platform as keyof typeof timingData] ||
           'General best practices: Peak engagement typically 9 AM-3 PM on weekdays';
  }

  private parseSchedulingResponse(response: string, platform: string): SchedulingSuggestion {
    try {
      const parsed = JSON.parse(response);
      return {
        optimalTime: parsed.optimalTime || '2:00 PM (Wednesday)',
        alternativeTimes: parsed.alternativeTimes || ['9:00 AM (Tuesday)', '6:00 PM (Thursday)'],
        reasoning: parsed.reasoning || 'Based on platform best practices and audience behavior',
        dayOfWeek: parsed.dayOfWeek || 'Wednesday',
        engagement_prediction: parsed.engagement_prediction || 75,
        best_practices: parsed.best_practices || ['Post consistently', 'Monitor engagement', 'Adjust based on analytics']
      };
    } catch {
      // Fallback scheduling suggestion
      return this.getDefaultScheduling(platform);
    }
  }

  private getDefaultScheduling(platform: string): SchedulingSuggestion {
    const defaults = {
      linkedin: {
        optimalTime: '9:00 AM (Wednesday)',
        alternativeTimes: ['12:00 PM (Tuesday)', '2:00 PM (Thursday)'],
        dayOfWeek: 'Wednesday',
        engagement_prediction: 70
      },
      twitter: {
        optimalTime: '1:00 PM (Wednesday)',
        alternativeTimes: ['9:00 AM (Tuesday)', '8:00 PM (Thursday)'],
        dayOfWeek: 'Wednesday',
        engagement_prediction: 65
      },
      instagram: {
        optimalTime: '2:00 PM (Friday)',
        alternativeTimes: ['11:00 AM (Wednesday)', '6:00 PM (Thursday)'],
        dayOfWeek: 'Friday',
        engagement_prediction: 75
      }
    };

    const defaultConfig = defaults[platform as keyof typeof defaults] || defaults.linkedin;

    return {
      optimalTime: defaultConfig.optimalTime,
      alternativeTimes: defaultConfig.alternativeTimes,
      reasoning: `Optimized for ${platform} based on general audience behavior and platform algorithms`,
      dayOfWeek: defaultConfig.dayOfWeek,
      engagement_prediction: defaultConfig.engagement_prediction,
      best_practices: [
        'Post during peak audience hours',
        'Maintain consistent posting schedule',
        'Monitor engagement metrics',
        'Adjust timing based on analytics'
      ]
    };
  }

  async scheduleContent(
    content: any,
    scheduledTime: Date,
    platform: string
  ) {
    return this.executeWithRetry(async () => {
      // This would integrate with platform APIs or scheduling services
      const scheduling = {
        content,
        platform,
        scheduledTime,
        status: 'scheduled',
        created_at: new Date()
      };

      // TODO: Integrate with actual scheduling service/database
      console.log('Content scheduled:', scheduling);

      return scheduling;
    }, 'content scheduling');
  }
}
