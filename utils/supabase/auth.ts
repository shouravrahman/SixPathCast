import { createClient } from '@/utils/supabase/client';

export async function signInWithGoogle() {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${location.origin}/auth/callback`,
    },
  });
  if (error) {
    console.error('Error signing in with Google:', error);
  }
}
