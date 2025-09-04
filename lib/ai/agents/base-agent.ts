import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { modelConfigs, ModelType } from "../config";
import { AgentResponse } from "../types";

export abstract class BaseAgent {
	protected llm: ChatGoogleGenerativeAI;
	protected retryAttempts: number = 3;
	protected retryDelay: number = 1000;

	constructor(modelType: ModelType = "conversational") {
		const config = modelConfigs[modelType];
		this.llm = new ChatGoogleGenerativeAI({
			model: config.model,
			temperature: config.temperature,
			maxRetries: this.retryAttempts,
			apiKey: process.env.GOOGLE_API_KEY,
		});
	}

	protected async executeWithRetry<T>(
		operation: () => Promise<T>,
		context: string = "operation"
	): Promise<AgentResponse<T>> {
		const startTime = Date.now();

		for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
			try {
				const result = await operation();
				return {
					success: true,
					data: result,
					metadata: {
						processingTime: Date.now() - startTime,
						model: this.llm.model,
					},
				};
			} catch (error) {
				console.error(
					`Attempt ${attempt} failed for ${context}:`,
					error
				);

				if (attempt === this.retryAttempts) {
					return {
						success: false,
						error: `Failed after ${this.retryAttempts} attempts: ${error}`,
						metadata: {
							processingTime: Date.now() - startTime,
							model: this.llm.model,
						},
					};
				}

				// Exponential backoff
				await new Promise((resolve) =>
					setTimeout(
						resolve,
						this.retryDelay * Math.pow(2, attempt - 1)
					)
				);
			}
		}

		return {
			success: false,
			error: "Unexpected error in retry logic",
		};
	}

	protected async invokeChain(
		template: string,
		variables: Record<string, any>
	): Promise<string> {
		const prompt = PromptTemplate.fromTemplate(template);
		const chain = RunnableSequence.from([
			prompt,
			this.llm,
			new StringOutputParser(),
		]);

		return await chain.invoke(variables);
	}

	abstract getName(): string;
	abstract getDescription(): string;
}
