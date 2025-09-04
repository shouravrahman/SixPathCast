import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

import { TrainingData } from "@/lib/ai/types";
import { RAGVectorStore } from "@/lib/ai/rag/vector-store";

export async function POST(request: NextRequest) {
	try {
		const supabase = await createClient();

		// Get user from session
		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();
		if (authError || !user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const body = await request.json();
		const { content, source, type, metadata } = body;

		if (!content || !source || !type) {
			return NextResponse.json(
				{
					error: "Missing required fields: content, source, type",
				},
				{ status: 400 }
			);
		}

		// Initialize RAG vector store
		const vectorStore = new RAGVectorStore();

		// Prepare training data
		const trainingData: TrainingData = {
			source,
			content,
			type,
			metadata: metadata || {},
		};

		// Add to vector store for RAG
		await vectorStore.addTrainingContent(user.id, trainingData);

		// Store in database (you may want to create a training_data table)
		const trainingRecord = {
			user_id: user.id,
			content,
			source,
			type,
			metadata: metadata || {},
			processed: true,
			created_at: new Date().toISOString(),
		};

		// TODO: Save to training_data table when created
		console.log("Training data processed:", trainingRecord);

		// Get updated training insights
		const insights = await vectorStore.getTrainingInsights(user.id);

		return NextResponse.json({
			success: true,
			message: "Training data uploaded and processed successfully",
			insights,
			metadata: {
				uploaded_at: new Date().toISOString(),
				user_id: user.id,
				content_length: content.length,
			},
		});
	} catch (error) {
		console.error("Training upload API error:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
				details:
					error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		const supabase = await createClient();

		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();
		if (authError || !user) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Initialize RAG vector store
		const vectorStore = new RAGVectorStore();

		// Get training insights for the user
		const insights = await vectorStore.getTrainingInsights(user.id);

		// Get brand context
		const brandContext = await vectorStore.getBrandContext(user.id);

		return NextResponse.json({
			success: true,
			data: {
				insights,
				brand_context: brandContext,
				recommendations: [
					"Upload more content to improve AI understanding",
					"Add successful posts for better pattern recognition",
					"Include competitor content for market insights",
					"Regularly update brand profile for consistency",
				],
			},
			metadata: {
				retrieved_at: new Date().toISOString(),
				user_id: user.id,
			},
		});
	} catch (error) {
		console.error("Training insights API error:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
			},
			{ status: 500 }
		);
	}
}
