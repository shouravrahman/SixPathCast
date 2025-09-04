import { NextRequest, NextResponse } from 'next/server';
import { AIOrchestrator } from "@/lib/ai/orchestrator";
import { createClient } from "@/utils/supabase/server";
import { ContentRequest } from "@/lib/ai/types";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

	// Get user from session
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();
	if (authError || !user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();
	const {
		topic,
		brief,
		platforms,
		postTypes,
		campaignId,
		includeScheduling = true,
		timeZone = "UTC",
	} = body;

	if (!topic || !brief || !platforms || platforms.length === 0) {
		return NextResponse.json(
			{
				error: "Missing required fields: topic, brief, platforms",
			},
			{ status: 400 }
		);
	}

	// Fetch brand profile
	const { data: brandProfile } = await supabase
		.from("brand_profiles")
		.select("*")
		.eq("id", user.id)
		.single();

	// Fetch campaign if provided
	let campaign = null;
	if (campaignId) {
		const { data: campaignData } = await supabase
			.from("campaigns")
			.select("*")
			.eq("id", campaignId)
			.eq("user_id", user.id)
			.single();
		campaign = campaignData;
	}

	// Prepare content request
	const contentRequest: ContentRequest = {
		topic,
		brief,
		platforms,
		postTypes: postTypes || {},
		brandProfile: brandProfile || undefined,
		campaign: campaign || undefined,
	};

	// Initialize AI Orchestrator and generate content
	const orchestrator = new AIOrchestrator();
	const result = await orchestrator.generateCompleteContentPlan({
		...contentRequest,
		includeScheduling,
		includeResearch: true,
		timeZone,
	});

	if (!result.success) {
		return NextResponse.json(
			{
				error: "Content generation failed",
				details: result.errors,
			},
			{ status: 500 }
		);
	}

	return NextResponse.json({
		success: true,
		data: result.content,
		scheduling: result.scheduling,
		research: result.research,
		metadata: {
			generatedAt: new Date().toISOString(),
			userId: user.id,
			campaignId: campaignId || null,
		},
	});

  } catch (error) {
    console.error("Content generation API error:", error);
	return NextResponse.json(
		{
			error: "Internal server error",
			details: error instanceof Error ? error.message : "Unknown error",
		},
		{ status: 500 }
	);
  }
}

export async function GET(request: NextRequest) {
	try {
		const orchestrator = new AIOrchestrator();
		const status = await orchestrator.getAgentStatus();

		return NextResponse.json({
			success: true,
			agents: status,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Agent status API error:", error);
		return NextResponse.json(
			{
				error: "Failed to get agent status",
			},
			{ status: 500 }
		);
	}
}
