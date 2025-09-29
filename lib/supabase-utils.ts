import { supabase } from './supabaseClient';

interface UserProfile {
  id: string;
  email: string;
  avatar_url: string;
}

export async function getFreshUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, avatar_url')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
