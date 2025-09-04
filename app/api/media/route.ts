import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: mediaItems, error } = await supabase
    .from('media_items')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching media items:', error);
    return NextResponse.json({ error: 'Failed to retrieve media items' }, { status: 500 });
  }

  return NextResponse.json(mediaItems);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const mediaItemData = await request.json();

  // Add user_id to the media item data
  const dataToInsert = {
    ...mediaItemData,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from('media_items')
    .insert(dataToInsert)
    .select()
    .single();

  if (error) {
    console.error('Error creating media item:', error);
    return NextResponse.json({ error: 'Failed to create media item' }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
