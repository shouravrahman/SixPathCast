import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ error: 'Failed to retrieve campaigns' }, { status: 500 });
  }

  return NextResponse.json(campaigns);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const campaignData = await request.json();

  // Add user_id to the campaign data
  const dataToInsert = {
    ...campaignData,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from('campaigns')
    .insert(dataToInsert)
    .select()
    .single();

  if (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
