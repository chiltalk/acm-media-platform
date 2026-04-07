import { supabase } from './supabase';
import type { Database } from './database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Content = Database['public']['Tables']['content']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type Tag = Database['public']['Tables']['tags']['Row'];
type Media = Database['public']['Tables']['media']['Row'];

type ContentInsert = Database['public']['Tables']['content']['Insert'];
type ContentUpdate = Database['public']['Tables']['content']['Update'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
type MediaInsert = Database['public']['Tables']['media']['Insert'];

// Profiles
export async function getProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile> {
  if (!supabase) throw new Error('Database not configured');
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Content
export async function getContent(params?: {
  status?: Content['status'];
  authorId?: string;
  limit?: number;
  offset?: number;
}): Promise<Content[]> {
  if (!supabase) return [];
  let query = supabase
    .from('content')
    .select('*')
    .order('created_at', { ascending: false });

  if (params?.status) {
    query = query.eq('status', params.status);
  }

  if (params?.authorId) {
    query = query.eq('author_id', params.authorId);
  }

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  if (params?.offset) {
    query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getContentBySlug(slug: string): Promise<Content | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

export async function createContent(content: ContentInsert): Promise<Content> {
  if (!supabase) throw new Error('Database not configured');
  const { data, error } = await supabase
    .from('content')
    .insert(content)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateContent(id: string, updates: ContentUpdate): Promise<Content> {
  if (!supabase) throw new Error('Database not configured');
  const { data, error } = await supabase
    .from('content')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteContent(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from('content')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Categories
export async function getCategories(): Promise<Category[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

// Tags
export async function getTags(): Promise<Tag[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

// Media
export async function uploadMedia(media: MediaInsert): Promise<Media> {
  if (!supabase) throw new Error('Database not configured');
  const { data, error } = await supabase
    .from('media')
    .insert(media)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMedia(): Promise<Media[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Content with relations
export async function getContentWithRelations(slug: string) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('content')
    .select(`
      *,
      author:profiles(*),
      categories(categories(*)),
      tags(tags(*))
    `)
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}
