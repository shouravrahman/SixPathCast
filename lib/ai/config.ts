import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Initialize Google AI
export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// LangChain Google AI model
export const llm = new ChatGoogleGenerativeAI({
	model: "gemini-1.5-pro",
	temperature: 0.7,
	maxRetries: 3,
	apiKey: process.env.GOOGLE_API_KEY,
});

// Model configurations for different use cases
export const modelConfigs = {
	creative: {
		temperature: 0.9,
		model: "gemini-1.5-pro",
	},
	analytical: {
		temperature: 0.3,
		model: "gemini-1.5-pro",
	},
	conversational: {
		temperature: 0.7,
		model: "gemini-1.5-pro",
	},
};

export type ModelType = keyof typeof modelConfigs;
