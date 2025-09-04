import { BaseAgent } from "./base-agent";
import {
	ContentRequest,
	GeneratedContent,
	BrandProfile,
	Campaign,
} from "../types";

export class ContentGenerationAgent extends BaseAgent {
	constructor() {
		super("creative");
	}

	getName(): string {
		return "Content Generation Agent";
	}

	getDescription(): string {
		return "Generates personalized content for various social media platforms using brand voice and RAG";
	}

	async generateContent(request: ContentRequest) {
		return this.executeWithRetry(async () => {
			const generatedContent: Record<string, GeneratedContent> = {};

			for (const platform of request.platforms) {
				const postTypes = request.postTypes[platform] || ["post"];

				for (const postType of postTypes) {
					const content = await this.generateSingleContent(
						platform,
						postType,
						request
					);

					const key = `${platform}-${postType}`;
					generatedContent[key] = content;
				}
			}

			return generatedContent;
		}, "content generation");
	}

	private async generateSingleContent(
		platform: string,
		postType: string,
		request: ContentRequest
	): Promise<GeneratedContent> {
		const brandContext = this.buildBrandContext(request.brandProfile);
		const campaignContext = this.buildCampaignContext(request.campaign);

		const prompt = this.buildContentPrompt(
			platform,
			postType,
			request.topic,
			request.brief,
			brandContext,
			campaignContext
		);

		const content = await this.invokeChain(prompt, {
			platform,
			postType,
			topic: request.topic,
			brief: request.brief,
			brandContext,
			campaignContext,
		});

		return this.parseContentResponse(content, platform);
	}

	private buildBrandContext(brandProfile?: BrandProfile): string {
		if (!brandProfile) return "";

		return `Brand Voice Guidelines:
- Tone: ${brandProfile.tone || "Professional"}
- Writing Style: ${brandProfile.writing_style || "Clear and engaging"}
- Industry: ${brandProfile.industry || "Technology"}
- Target Audience: ${brandProfile.target_audience || "Professionals"}
- Personality Traits: ${
			brandProfile.personality_traits?.join(", ") || "Innovative, Helpful"
		}
- Preferred Words: ${
			brandProfile.words_to_prefer?.join(", ") || "None specified"
		}
- Avoid Words: ${brandProfile.words_to_avoid?.join(", ") || "None specified"}
- Language Guidelines: ${
			brandProfile.language_guidelines ||
			"Clear and professional communication"
		}`;
	}

	private buildCampaignContext(campaign?: Campaign): string {
		if (!campaign) return "";

		return `Campaign Context:
- Campaign: ${campaign.name}
- Description: ${campaign.description || ""}
- Target Audience: ${campaign.target_audience || ""}
- Content Pillars: ${campaign.content_pillars?.join(", ") || ""}
- Category: ${campaign.category || ""}`;
	}

	private buildContentPrompt(
		platform: string,
		postType: string,
		topic: string,
		brief: string,
		brandContext: string,
		campaignContext: string
	): string {
		return `You are an expert social media content creator specializing in ${platform}. Create a ${postType} about "${topic}".

${brandContext}

${campaignContext}

Content Brief: ${brief}

Platform-Specific Requirements for ${platform}:
${this.getPlatformRequirements(platform, postType)}

Generate a complete ${postType} that includes:
1. Main content text (optimized for ${platform})
2. Relevant hashtags (3-10 appropriate for ${platform})
3. Media description (if applicable)
4. Optimal posting time suggestion
5. Engagement tips

Format your response as JSON:
{
  "content": "The main post content",
  "hashtags": ["hashtag1", "hashtag2"],
  "mediaDescription": "Description of suggested media",
  "schedulingSuggestion": "Best time to post and why",
  "engagementTips": ["tip1", "tip2"]
}

Ensure the content:
- Matches the brand voice and tone
- Is appropriate for the target audience
- Follows platform best practices
- Includes actionable value
- Encourages engagement`;
	}

	private getPlatformRequirements(
		platform: string,
		postType: string
	): string {
		const requirements = {
			linkedin: {
				post: "Professional tone, 1200-1500 characters optimal, industry insights, thought leadership",
				video: "Professional content, 30-90 seconds, educational or behind-the-scenes",
				carousel:
					"Educational slides, professional design, 3-10 slides with actionable insights",
			},
			twitter: {
				post: "Concise content, under 280 characters, trending hashtags, conversational tone",
				thread: "Connected tweets, storytelling format, each tweet under 280 characters",
				video: "Short-form content, 15-45 seconds, engaging from first second",
			},
			instagram: {
				post: "Visual-first content, 125-150 characters optimal, aesthetic appeal",
				story: "Casual tone, behind-the-scenes content, interactive elements",
				reel: "Entertaining content, 15-30 seconds, trending audio, visual appeal",
			},
			youtube: {
				short: "Vertical video content, under 60 seconds, engaging hook in first 3 seconds",
				video: "Educational or entertaining content, detailed description, strong thumbnail concept",
			},
			tiktok: {
				video: "Entertaining content, 15-60 seconds, trending sounds, engaging visuals",
			},
		};

		return (
			requirements[platform as keyof typeof requirements]?.[
				postType as keyof any
			] || "Follow platform best practices for engagement and reach"
		);
	}

	private parseContentResponse(
		response: string,
		platform: string
	): GeneratedContent {
		try {
			const parsed = JSON.parse(response);
			return {
				platform,
				postType: "post",
				content: parsed.content || response,
				hashtags: parsed.hashtags || [],
				mediaDescription: parsed.mediaDescription || "",
				schedulingSuggestion:
					parsed.schedulingSuggestion ||
					"Post during peak engagement hours",
				engagementTips: parsed.engagementTips || [],
			};
		} catch {
			// Fallback if JSON parsing fails
			return {
				platform,
				postType: "post",
				content: response,
				hashtags: [],
				mediaDescription: "",
				schedulingSuggestion: "Post during peak engagement hours",
				engagementTips: [],
			};
		}
	}
}
