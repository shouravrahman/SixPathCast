import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { content, platforms, scheduledTime, timezone } = await request.json();

    if (!content || !platforms || !scheduledTime) {
      return NextResponse.json(
        { error: 'Content, platforms, and scheduled time are required' },
        { status: 400 }
      );
    }

    // Mock scheduling logic
    const scheduledPost = {
      id: Date.now().toString(),
      content,
      platforms,
      scheduledTime,
      timezone,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      post: scheduledPost,
      message: 'Post scheduled successfully'
    });
  } catch (error) {
    console.error('Error scheduling post:', error);
    return NextResponse.json(
      { error: 'Failed to schedule post' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Mock scheduled posts data
    const mockScheduledPosts = [
      {
        id: "1",
        content: "Why consistency beats perfection in social media...",
        platforms: ["twitter", "linkedin"],
        scheduledTime: "2024-01-16T15:00:00Z",
        status: "scheduled",
        createdAt: "2024-01-15T10:00:00Z"
      },
      {
        id: "2",
        content: "5 AI tools that will transform your content strategy...",
        platforms: ["linkedin", "facebook"],
        scheduledTime: "2024-01-17T10:00:00Z",
        status: "scheduled",
        createdAt: "2024-01-15T11:00:00Z"
      }
    ];

    return NextResponse.json({
      posts: mockScheduledPosts,
      total: mockScheduledPosts.length
    });
  } catch (error) {
    console.error('Error fetching scheduled posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scheduled posts' },
      { status: 500 }
    );
  }
}