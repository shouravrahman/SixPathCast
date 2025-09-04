import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: settings, error } = await supabase
    .from('brand_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to retrieve settings' }, { status: 500 });
  }

  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settingsData = await request.json();

  // Ensure the ID matches the authenticated user's ID for security
  if (settingsData.id && settingsData.id !== user.id) {
    return NextResponse.json({ error: 'Mismatched user ID' }, { status: 403 });
  }

  // Add the user ID and set onboarding status
  const dataToUpsert = {
    ...settingsData,
    id: user.id,
    has_completed_onboarding: true, // Mark onboarding as complete on save
  };

  const { data, error } = await supabase
    .from('brand_profiles')
    .upsert(dataToUpsert, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }

  return NextResponse.json(data);
}