import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { useEffect } from 'react';

// Define the profile type based on your table
interface Profile {
  id: string;
  updated_at: string;
  username: string;
  full_name: string;
  avatar_url: string;
  website: string;
  role: string;
}

// Define the user type with the profile
type UserWithProfile = User & { profile: Profile | null };

interface UserState {
  user: UserWithProfile | null;
  isLoading: boolean;
}

const useUserStore = create<UserState>(() => ({
  user: null,
  isLoading: true,
}));

export const useUser = () => {
  const { user, isLoading } = useUserStore();

  useEffect(() => {
    const supabase = createClient();
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, updated_at, username, full_name, avatar_url, website, role')
          .eq('id', user.id)
          .single();
        useUserStore.setState({ user: { ...user, profile }, isLoading: false });
      } else {
        useUserStore.setState({ user: null, isLoading: false });
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        fetchUser();
      } else if (event === 'SIGNED_OUT') {
        useUserStore.setState({ user: null, isLoading: false });
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading };
};

export default useUserStore;
