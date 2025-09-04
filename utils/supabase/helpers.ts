import { createClient } from './server';

export async function getUserWithProfile() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, updated_at, username, full_name, avatar_url, website, role')
      .eq('id', user.id)
      .single();

    return { ...user, profile };
  } catch (error) {
    console.error('Error in getUserWithProfile:', error);
    return null;
  }
}

export async function isAdmin() {
  const user = await getUserWithProfile();
  return user?.profile?.role === 'admin';
}
