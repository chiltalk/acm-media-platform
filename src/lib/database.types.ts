export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Content = Database['public']['Tables']['content']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Tag = Database['public']['Tables']['tags']['Row'];
export type Media = Database['public']['Tables']['media']['Row'];

export type ContentInsert = Database['public']['Tables']['content']['Insert'];
export type ContentUpdate = Database['public']['Tables']['content']['Update'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type MediaInsert = Database['public']['Tables']['media']['Insert'];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'author' | 'editor'
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'author' | 'editor'
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'author' | 'editor'
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      content: {
        Row: {
          id: string
          title: string
          slug: string
          body: string
          excerpt: string | null
          cover_image_url: string | null
          author_id: string | null
          status: 'draft' | 'published' | 'scheduled'
          published_at: string | null
          scheduled_at: string | null
          created_at: string
          updated_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          title: string
          slug: string
          body: string
          excerpt?: string | null
          cover_image_url?: string | null
          author_id?: string | null
          status?: 'draft' | 'published' | 'scheduled'
          published_at?: string | null
          scheduled_at?: string | null
          created_at?: string
          updated_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          body?: string
          excerpt?: string | null
          cover_image_url?: string | null
          author_id?: string | null
          status?: 'draft' | 'published' | 'scheduled'
          published_at?: string | null
          scheduled_at?: string | null
          created_at?: string
          updated_at?: string
          metadata?: Json
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          parent_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          parent_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          parent_id?: string | null
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      content_tags: {
        Row: {
          content_id: string
          tag_id: string
        }
        Insert: {
          content_id: string
          tag_id: string
        }
        Update: {
          content_id?: string
          tag_id?: string
        }
      }
      content_categories: {
        Row: {
          content_id: string
          category_id: string
        }
        Insert: {
          content_id: string
          category_id: string
        }
        Update: {
          content_id?: string
          category_id?: string
        }
      }
      media: {
        Row: {
          id: string
          name: string
          file_path: string
          file_size: number | null
          mime_type: string | null
          width: number | null
          height: number | null
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          file_path: string
          file_size?: number | null
          mime_type?: string | null
          width?: number | null
          height?: number | null
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          file_path?: string
          file_size?: number | null
          mime_type?: string | null
          width?: number | null
          height?: number | null
          uploaded_by?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
