
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: leadMagnets, error } = await supabase
    .from('lead_magnets')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching lead magnets:', error);
    return NextResponse.json({ error: 'Failed to retrieve lead magnets' }, { status: 500 });
  }

  return NextResponse.json(leadMagnets);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const leadMagnetData = await request.json();

  const dataToInsert = {
    ...leadMagnetData,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from('lead_magnets')
    .insert(dataToInsert)
    .select()
    .single();

  if (error) {
    console.error('Error creating lead magnet:', error);
    return NextResponse.json({ error: 'Failed to create lead magnet' }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}


export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Lead magnet ID is required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('lead_magnets')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting lead magnet:', error);
    return NextResponse.json({ error: 'Failed to delete lead magnet' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Lead magnet deleted successfully' }, { status: 200 });
}
