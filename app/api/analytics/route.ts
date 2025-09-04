import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '7d';
    const platform = searchParams.get('platform') || 'all';

    // Mock analytics data
    const mockData = {
      summary: {
        totalFollowers: 12584,
        followersChange: 12.5,
        engagementRate: 4.2,
        engagementChange: 8.1,
        postsThisWeek: 24,
        postsChange: 6.3,
        reach: 45200,
        reachChange: 15.2
      },
      posts: [
        {
          id: 1,
          content: "Building your personal brand starts with authentic storytelling...",
          platform: "linkedin",
          publishedAt: "2024-01-15T14:30:00Z",
          metrics: {
            views: 2100,
            likes: 145,
            comments: 23,
            shares: 12
          },
          performance: "high"
        },
        {
          id: 2,
          content: "The future of AI in content creation is here and it's amazing...",
          platform: "twitter",
          publishedAt: "2024-01-15T11:00:00Z",
          metrics: {
            views: 1800,
            likes: 98,
            comments: 15,
            shares: 8
          },
          performance: "medium"
        }
      ],
      trends: {
        topHashtags: ["#PersonalBrand", "#ContentCreation", "#AI", "#SocialMedia"],
        bestPostingTimes: ["2:00 PM", "6:00 PM", "10:00 AM"],
        audienceInsights: {
          demographics: {
            age: "25-34",
            gender: "Mixed",
            location: "Global"
          },
          interests: ["Technology", "Business", "Marketing", "AI"]
        }
      }
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}