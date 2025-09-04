import { ContentGenerationAgent } from './agents/content-agent';
import { SchedulingAgent } from './agents/scheduling-agent';
import { ResearchAgent } from './agents/research-agent';
import { ContentRequest, BrandProfile, Campaign } from './types';

export class AIOrchestrator {
  private contentAgent: ContentGenerationAgent;
  private schedulingAgent: SchedulingAgent;
  private researchAgent: ResearchAgent;

  constructor() {
    this.contentAgent = new ContentGenerationAgent();
    this.schedulingAgent = new SchedulingAgent();
    this.researchAgent = new ResearchAgent();
  }

  async generateCompleteContentPlan(request: ContentRequest & {
    includeScheduling?: boolean;
    includeResearch?: boolean;
    timeZone?: string;
  }) {
    const results = {
      content: null as any,
      scheduling: null as any,
      research: null as any,
      success: false,
      errors: [] as string[]
    };

    try {
      // Step 1: Research trending content if requested
      if (request.includeResearch) {
        const researchRequest = {
          niche: request.campaign?.category || request.topic,
          platforms: request.platforms,
          keywords: [request.topic, ...(request.brandProfile?.topics || [])],
          brandProfile: request.brandProfile,
          trending_topics: true
        };

        const researchResult = await this.researchAgent.researchTrendingContent(researchRequest);
        if (researchResult.success) {
          results.research = researchResult.data;
        } else {
          results.errors.push(`Research failed: ${researchResult.error}`);
        }
      }

      // Step 2: Generate content
      const contentResult = await this.contentAgent.generateContent(request);
      if (contentResult.success) {
        results.content = contentResult.data;
      } else {
        results.errors.push(`Content generation failed: ${contentResult.error}`);
        return results;
      }

      // Step 3: Generate scheduling recommendations if requested
      if (request.includeScheduling && results.content) {
        const schedulingPromises = Object.entries(results.content).map(async ([key, content]: [string, any]) => {
          const schedulingRequest = {
            content: content.content,
            platform: content.platform,
            postType: content.postType || 'post',
            targetAudience: request.brandProfile?.target_audience,
            timeZone: request.timeZone || 'UTC',
            brandProfile: request.brandProfile
          };

          const schedulingResult = await this.schedulingAgent.suggestOptimalTiming(schedulingRequest);
          return {
            key,
            scheduling: schedulingResult.success ? schedulingResult.data : null,
            error: schedulingResult.error
          };
        });

        const schedulingResults = await Promise.all(schedulingPromises);
        results.scheduling = {};

        schedulingResults.forEach(({ key, scheduling, error }) => {
          if (scheduling) {
            results.scheduling[key] = scheduling;
          } else if (error) {
            results.errors.push(`Scheduling failed for ${key}: ${error}`);
          }
        });
      }

      results.success = results.content !== null;
      return results;

    } catch (error) {
      results.errors.push(`Orchestrator error: ${error}`);
      return results;
    }
  }

  async enhanceContentWithRAG(
    request: ContentRequest,
    additionalContext: {
      pastPosts?: any[];
      brandDocuments?: any[];
      competitorAnalysis?: any;
    }
  ) {
    // This would integrate with a vector database for RAG
    // For now, we'll enhance the request with additional context

    const enhancedRequest = {
      ...request,
      brief: `${request.brief}

Additional Context:
${additionalContext.pastPosts ? `Past successful posts: ${JSON.stringify(additionalContext.pastPosts.slice(0, 3))}` : ''}
${additionalContext.brandDocuments ? `Brand guidelines: Available` : ''}
${additionalContext.competitorAnalysis ? `Market insights: ${JSON.stringify(additionalContext.competitorAnalysis)}` : ''}`
    };

    return this.generateCompleteContentPlan(enhancedRequest);
  }

  async bulkGenerateContent(
    requests: ContentRequest[],
    options: {
      batchSize?: number;
      includeScheduling?: boolean;
      timeZone?: string;
    } = {}
  ) {
    const { batchSize = 3, includeScheduling = false, timeZone = 'UTC' } = options;
    const results = [];

    // Process in batches to avoid overwhelming the AI API
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);

      const batchPromises = batch.map(request =>
        this.generateCompleteContentPlan({
          ...request,
          includeScheduling,
          timeZone
        })
      );

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Add delay between batches to respect API limits
      if (i + batchSize < requests.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return results;
  }

  async getAgentStatus() {
    return {
      contentAgent: {
        name: this.contentAgent.getName(),
        description: this.contentAgent.getDescription(),
        status: 'ready'
      },
      schedulingAgent: {
        name: this.schedulingAgent.getName(),
        description: this.schedulingAgent.getDescription(),
        status: 'ready'
      },
      researchAgent: {
        name: this.researchAgent.getName(),
        description: this.researchAgent.getDescription(),
        status: 'ready'
      }
    };
  }
}
