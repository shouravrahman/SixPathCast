// RAG Vector Store for Brand Voice and Content Memory
import { BrandProfile, TrainingData } from "../types";

export interface VectorDocument {
	id: string;
	content: string;
	metadata: {
		type:
			| "brand_profile"
			| "training_content"
			| "successful_post"
			| "competitor_content";
		platform?: string;
		engagement_score?: number;
		created_at: string;
		user_id: string;
		tags?: string[];
	};
	embedding?: number[];
}

export class RAGVectorStore {
	private documents: Map<string, VectorDocument> = new Map();

	constructor() {
		// Initialize in-memory vector store
		// In production, this would use a proper vector database like Pinecone, Weaviate, or Supabase Vector
	}

	async addDocument(doc: VectorDocument): Promise<void> {
		// Generate embedding (in production, use OpenAI embeddings or Google embeddings)
		doc.embedding = await this.generateEmbedding(doc.content);
		this.documents.set(doc.id, doc);
	}

	async addBrandProfile(
		userId: string,
		brandProfile: BrandProfile
	): Promise<void> {
		const brandContent = this.serializeBrandProfile(brandProfile);

		const doc: VectorDocument = {
			id: `brand_${userId}`,
			content: brandContent,
			metadata: {
				type: "brand_profile",
				created_at: new Date().toISOString(),
				user_id: userId,
				tags: ["brand_voice", "writing_style", "tone"],
			},
		};

		await this.addDocument(doc);
	}

	async addTrainingContent(
		userId: string,
		trainingData: TrainingData
	): Promise<void> {
		const doc: VectorDocument = {
			id: `training_${userId}_${Date.now()}`,
			content: trainingData.content,
			metadata: {
				type: "training_content",
				platform: trainingData.metadata?.platform,
				created_at: new Date().toISOString(),
				user_id: userId,
				tags: trainingData.metadata?.tags || [],
			},
		};

		await this.addDocument(doc);
	}

	async addSuccessfulPost(
		userId: string,
		postContent: string,
		engagementScore: number,
		platform: string
	): Promise<void> {
		const doc: VectorDocument = {
			id: `post_${userId}_${Date.now()}`,
			content: postContent,
			metadata: {
				type: "successful_post",
				platform,
				engagement_score: engagementScore,
				created_at: new Date().toISOString(),
				user_id: userId,
				tags: ["successful_content"],
			},
		};

		await this.addDocument(doc);
	}

	async searchSimilarContent(
		query: string,
		userId: string,
		options: {
			type?: VectorDocument["metadata"]["type"];
			platform?: string;
			limit?: number;
			minScore?: number;
		} = {}
	): Promise<VectorDocument[]> {
		const { type, platform, limit = 5, minScore = 0.7 } = options;

		// Generate query embedding
		const queryEmbedding = await this.generateEmbedding(query);

		// Filter and score documents
		const candidates = Array.from(this.documents.values())
			.filter((doc) => {
				if (doc.metadata.user_id !== userId) return false;
				if (type && doc.metadata.type !== type) return false;
				if (platform && doc.metadata.platform !== platform)
					return false;
				return true;
			})
			.map((doc) => ({
				document: doc,
				score: this.cosineSimilarity(
					queryEmbedding,
					doc.embedding || []
				),
			}))
			.filter((item) => item.score >= minScore)
			.sort((a, b) => b.score - a.score)
			.slice(0, limit);

		return candidates.map((item) => item.document);
	}

	async getBrandContext(userId: string): Promise<string> {
		const brandDocs = await this.searchSimilarContent(
			"brand voice writing style tone",
			userId,
			{
				type: "brand_profile",
				limit: 1,
			}
		);

		if (brandDocs.length === 0) {
			return "No brand profile found. Using default professional tone.";
		}

		return brandDocs[0].content;
	}

	async getRelevantExamples(
		query: string,
		userId: string,
		platform?: string
	): Promise<string[]> {
		const examples = await this.searchSimilarContent(query, userId, {
			type: "successful_post",
			platform,
			limit: 3,
			minScore: 0.6,
		});

		return examples.map((doc) => `Example: ${doc.content}`);
	}

	async getTrainingInsights(userId: string): Promise<{
		totalDocuments: number;
		platformBreakdown: Record<string, number>;
		contentTypes: Record<string, number>;
		avgEngagement: number;
	}> {
		const userDocs = Array.from(this.documents.values()).filter(
			(doc) => doc.metadata.user_id === userId
		);

		const platformBreakdown: Record<string, number> = {};
		const contentTypes: Record<string, number> = {};
		let totalEngagement = 0;
		let engagementCount = 0;

		userDocs.forEach((doc) => {
			if (doc.metadata.platform) {
				platformBreakdown[doc.metadata.platform] =
					(platformBreakdown[doc.metadata.platform] || 0) + 1;
			}
			contentTypes[doc.metadata.type] =
				(contentTypes[doc.metadata.type] || 0) + 1;

			if (doc.metadata.engagement_score) {
				totalEngagement += doc.metadata.engagement_score;
				engagementCount++;
			}
		});

		return {
			totalDocuments: userDocs.length,
			platformBreakdown,
			contentTypes,
			avgEngagement:
				engagementCount > 0 ? totalEngagement / engagementCount : 0,
		};
	}

	private serializeBrandProfile(profile: BrandProfile): string {
		return `Brand Profile:
Name: ${profile.full_name || "Not specified"}
Industry: ${profile.industry || "Not specified"}
Bio: ${profile.bio || "Not specified"}
Target Audience: ${profile.target_audience || "General audience"}
Tone: ${profile.tone || "Professional"}
Writing Style: ${profile.writing_style || "Clear and engaging"}
Content Style: ${profile.content_style || "Informative"}
Personality Traits: ${profile.personality_traits?.join(", ") || "Professional"}
Preferred Words: ${profile.words_to_prefer?.join(", ") || "None specified"}
Words to Avoid: ${profile.words_to_avoid?.join(", ") || "None specified"}
Language Guidelines: ${
			profile.language_guidelines || "Professional communication"
		}
Topics: ${profile.topics?.join(", ") || "General business topics"}
Story: ${profile.story || "Not provided"}`;
	}

	private async generateEmbedding(text: string): Promise<number[]> {
		// Simple hash-based embedding for development
		// In production, use OpenAI embeddings or Google embeddings API
		const words = text.toLowerCase().split(/\s+/);
		const embedding = new Array(384).fill(0); // 384-dimensional embedding

		words.forEach((word, index) => {
			const hash = this.simpleHash(word);
			embedding[hash % 384] += 1;
		});

		// Normalize
		const magnitude = Math.sqrt(
			embedding.reduce((sum, val) => sum + val * val, 0)
		);
		return magnitude > 0
			? embedding.map((val) => val / magnitude)
			: embedding;
	}

	private simpleHash(str: string): number {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash; // Convert to 32bit integer
		}
		return Math.abs(hash);
	}

	private cosineSimilarity(a: number[], b: number[]): number {
		if (a.length !== b.length) return 0;

		let dotProduct = 0;
		let normA = 0;
		let normB = 0;

		for (let i = 0; i < a.length; i++) {
			dotProduct += a[i] * b[i];
			normA += a[i] * a[i];
			normB += b[i] * b[i];
		}

		const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
		return magnitude > 0 ? dotProduct / magnitude : 0;
	}
}
