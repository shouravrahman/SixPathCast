import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  const { data: mediaItem, error } = await supabase
    .from('media_items')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user owns the media item
    .single();

  if (error) {
    console.error('Error fetching media item:', error);
    if (error.code === 'PGRST116') { // No rows found
      return NextResponse.json({ error: 'Media item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to retrieve media item' }, { status: 500 });
  }

  return NextResponse.json(mediaItem);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const mediaItemData = await request.json();

  // Ensure user_id is not updated and matches the authenticated user
  if (mediaItemData.user_id && mediaItemData.user_id !== user.id) {
    return NextResponse.json({ error: 'Cannot change media item ownership' }, { status: 403 });
  }
  delete mediaItemData.user_id; // Prevent user from trying to change user_id

  const { data, error } = await supabase
    .from('media_items')
    .update(mediaItemData)
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user owns the media item
    .select()
    .single();

  if (error) {
    console.error('Error updating media item:', error);
    if (error.code === 'PGRST116') { // No rows found for update
      return NextResponse.json({ error: 'Media item not found or not owned by user' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update media item' }, { status: 500 });
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

  // First, get the file_path to delete the actual file from storage
  const { data: mediaItem, error: fetchError } = await supabase
    .from('media_items')
    .select('file_path')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (fetchError) {
    console.error('Error fetching media item for deletion:', fetchError);
    if (fetchError.code === 'PGRST116') {
      return NextResponse.json({ error: 'Media item not found or not owned by user' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to prepare for deletion' }, { status: 500 });
  }

  // Delete the file from Supabase Storage
  if (mediaItem.file_path) {
    const { error: storageError } = await supabase.storage
      .from('brand_assets') // Assuming 'brand_assets' is your bucket name
      .remove([mediaItem.file_path]);

    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      // Decide whether to return an error or proceed with metadata deletion
      // For now, we'll return an error if storage deletion fails.
      return NextResponse.json({ error: 'Failed to delete file from storage' }, { status: 500 });
    }
  }

  // Then, delete the metadata record from the database
  const { error: dbError } = await supabase
    .from('media_items')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // Ensure user owns the media item

  if (dbError) {
    console.error('Error deleting media item record:', dbError);
    return NextResponse.json({ error: 'Failed to delete media item record' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Media item deleted successfully' }, { status: 200 });
}
