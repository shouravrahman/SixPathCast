import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { ResearchAgent } from "@/lib/ai/agents/research-agent";

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
		const {
			niche,
			platforms,
			keywords,
			trending_topics = true,
			competitor_analysis = false,
		} = body;

		if (!niche || !platforms || platforms.length === 0) {
			return NextResponse.json(
				{
					error: "Missing required fields: niche, platforms",
				},
				{ status: 400 }
			);
		}

		// Fetch brand profile for context
		const { data: brandProfile } = await supabase
			.from("brand_profiles")
			.select("*")
			.eq("id", user.id)
			.single();

		const researchAgent = new ResearchAgent();

		const researchRequest = {
			niche,
			platforms,
			keywords: keywords || [niche],
			trending_topics,
			competitor_analysis,
			brandProfile: brandProfile || undefined,
		};

		let results: any = {};

		// Get trending content if requested
		if (trending_topics) {
			const trendingResult = await researchAgent.researchTrendingContent(
				researchRequest
			);
			if (trendingResult.success) {
				results.trending = trendingResult.data;
			} else {
				results.trending_error = trendingResult.error;
			}
		}

		// Get competitor analysis if requested
		if (competitor_analysis) {
			const competitorResult = await researchAgent.analyzeCompetitors(
				researchRequest
			);
			if (competitorResult.success) {
				results.competitor_analysis = competitorResult.data;
			} else {
				results.competitor_error = competitorResult.error;
			}
		}

		// Get content inspiration
		const inspirationResult =
			await researchAgent.generateContentInspiration(researchRequest);
		if (inspirationResult.success) {
			results.inspiration = inspirationResult.data;
		} else {
			results.inspiration_error = inspirationResult.error;
		}

		return NextResponse.json({
			success: true,
			data: results,
			metadata: {
				researched_at: new Date().toISOString(),
				user_id: user.id,
				niche,
				platforms,
			},
		});
	} catch (error) {
		console.error("Research API error:", error);
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
		const supabase = createClient();

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

		// Get search params
		const { searchParams } = new URL(request.url);
		const platform = searchParams.get("platform");
		const niche = searchParams.get("niche");

		// Fetch brand profile
		const { data: brandProfile } = await supabase
			.from("brand_profiles")
			.select("*")
			.eq("id", user.id)
			.single();

		const researchAgent = new ResearchAgent();

		// Generate quick trending content for the specified platform/niche
		const quickRequest = {
			niche: niche || brandProfile?.industry || "technology",
			platforms: platform ? [platform] : ["linkedin", "twitter"],
			keywords: brandProfile?.topics || ["innovation", "technology"],
			trending_topics: true,
			brandProfile: brandProfile || undefined,
		};

		const result = await researchAgent.researchTrendingContent(
			quickRequest
		);

		if (result.success) {
			return NextResponse.json({
				success: true,
				data: result.data,
				metadata: {
					platform,
					niche: quickRequest.niche,
					generated_at: new Date().toISOString(),
				},
			});
		} else {
			return NextResponse.json(
				{
					error: "Failed to fetch trending content",
					details: result.error,
				},
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error("Trending content API error:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
			},
			{ status: 500 }
		);
	}
}
