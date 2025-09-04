// Core AI Agent Types

export interface BrandProfile {
  id: string;
  full_name?: string;
  bio?: string;
  industry?: string;
  target_audience?: string;
  personality_traits?: string[];
  tone?: string;
  writing_style?: string;
  content_style?: string;
  language_guidelines?: string;
  words_to_avoid?: string[];
  words_to_prefer?: string[];
  topics?: string[];
  hashtags?: string[];
  story?: string;
  projects?: any;
  work_experiences?: any;
  achievements?: string[];
}

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  category?: string;
  target_audience?: string;
  content_pillars?: string[];
  platforms?: string[];
}

export interface ContentRequest {
  topic: string;
  brief: string;
  platforms: string[];
  postTypes: Record<string, string[]>;
  campaign?: Campaign;
  brandProfile?: BrandProfile;
  targetAudience?: string;
  contentPillars?: string[];
}

export interface GeneratedContent {
  platform: string;
  postType: string;
  content: string;
  hashtags?: string[];
  mediaDescription?: string;
  schedulingSuggestion?: string;
  engagementTips?: string[];
}

export interface AgentResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    tokensUsed?: number;
    processingTime?: number;
    model?: string;
  };
}

export interface ScrapedPost {
  id: string;
  platform: string;
  author: string;
  content: string;
  engagement: {
    likes?: number;
    comments?: number;
    shares?: number;
    views?: number;
  };
  hashtags?: string[];
  url?: string;
  timestamp?: Date;
  trending?: boolean;
}

export interface MediaProcessingRequest {
  file: File | string;
  type: 'image' | 'video' | 'document';
  purpose: 'content' | 'training' | 'profile';
  metadata?: Record<string, any>;
}

export interface TrainingData {
  source: 'upload' | 'url' | 'social' | 'text';
  content: string;
  type: 'pdf' | 'text' | 'posts' | 'url';
  metadata?: {
    category?: string;
    tags?: string[];
    platform?: string;
  };
}
