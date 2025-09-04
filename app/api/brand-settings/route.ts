
import { NextResponse } from 'next/server';

// Mock brand settings data
let brandSettings = {
  brandVoice: 'Witty and informal',
  targetAudience: 'Entrepreneurs and startup founders',
  contentPillars: ['AI Productivity', 'Personal Branding', 'Marketing Tips'],
  goodContentExamples: [
    'https://example.com/blog/good-post-1',
    'https://example.com/blog/good-post-2',
  ],
  topicsToAvoid: ['Politics', 'Religion'],
};

export async function GET() {
  return NextResponse.json(brandSettings);
}

export async function POST(request: Request) {
  const newSettings = await request.json();
  brandSettings = { ...brandSettings, ...newSettings };
  return NextResponse.json(brandSettings);
}
