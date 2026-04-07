import { supabase } from './supabase';
import type { Database } from './database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

// Get current session
export async function getSession() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// Get current user
export async function getCurrentUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Get profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return {
    ...user,
    profile
  };
}

// Check if user has required role
export function hasRole(profile: Profile | null, roles: ('admin' | 'author' | 'editor')[]): boolean {
  if (!profile) return false;
  return roles.includes(profile.role);
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('Database not configured');
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// Sign up with email and password
export async function signUp(email: string, password: string, fullName?: string) {
  if (!supabase) throw new Error('Database not configured');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
  return data;
}

// Sign out
export async function signOut() {
  if (!supabase) throw new Error('Database not configured');
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
