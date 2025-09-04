import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;
  const folder = formData.get('folder') as string || 'general'; // e.g., 'logos', 'profile_images'

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('brand_assets')
    .upload(fileName, file, { cacheControl: '3600', upsert: true });

  if (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage
    .from('brand_assets')
    .getPublicUrl(data.path);

  return NextResponse.json({ url: publicUrlData.publicUrl });
}
