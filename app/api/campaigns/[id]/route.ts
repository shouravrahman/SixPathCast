import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  const { data: campaign, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user owns the campaign
    .single();

  if (error) {
    console.error('Error fetching campaign:', error);
    if (error.code === 'PGRST116') { // No rows found
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to retrieve campaign' }, { status: 500 });
  }

  return NextResponse.json(campaign);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const campaignData = await request.json();

  // Ensure user_id is not updated and matches the authenticated user
  if (campaignData.user_id && campaignData.user_id !== user.id) {
    return NextResponse.json({ error: 'Cannot change campaign ownership' }, { status: 403 });
  }
  delete campaignData.user_id; // Prevent user from trying to change user_id

  const { data, error } = await supabase
    .from('campaigns')
    .update(campaignData)
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user owns the campaign
    .select()
    .single();

  if (error) {
    console.error('Error updating campaign:', error);
    if (error.code === 'PGRST116') { // No rows found for update
      return NextResponse.json({ error: 'Campaign not found or not owned by user' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // Ensure user owns the campaign

  if (error) {
    console.error('Error deleting campaign:', error);
    if (error.code === 'PGRST116') { // No rows found for delete
      return NextResponse.json({ error: 'Campaign not found or not owned by user' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Campaign deleted successfully' }, { status: 200 });
}
