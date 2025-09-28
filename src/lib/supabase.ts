import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          location: string | null
          bio: string | null
          avatar_url: string | null
          role: 'user' | 'agent' | 'admin'
          status: 'active' | 'blocked' | 'pending'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          location?: string | null
          bio?: string | null
          avatar_url?: string | null
          role?: 'user' | 'agent' | 'admin'
          status?: 'active' | 'blocked' | 'pending'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          location?: string | null
          bio?: string | null
          avatar_url?: string | null
          role?: 'user' | 'agent' | 'admin'
          status?: 'active' | 'blocked' | 'pending'
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          bedrooms: number
          bathrooms: number
          area: number
          property_type: 'house' | 'apartment' | 'condo' | 'villa'
          status: 'approved' | 'pending' | 'rejected'
          location: string
          address: string
          latitude: number | null
          longitude: number | null
          images: string[]
          amenities: string[]
          owner_id: string
          views: number
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          bedrooms: number
          bathrooms: number
          area: number
          property_type: 'house' | 'apartment' | 'condo' | 'villa'
          status?: 'approved' | 'pending' | 'rejected'
          location: string
          address: string
          latitude?: number | null
          longitude?: number | null
          images?: string[]
          amenities?: string[]
          owner_id: string
          views?: number
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          bedrooms?: number
          bathrooms?: number
          area?: number
          property_type?: 'house' | 'apartment' | 'condo' | 'villa'
          status?: 'approved' | 'pending' | 'rejected'
          location?: string
          address?: string
          latitude?: number | null
          longitude?: number | null
          images?: string[]
          amenities?: string[]
          owner_id?: string
          views?: number
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      inquiries: {
        Row: {
          id: string
          property_id: string
          user_id: string
          name: string
          email: string
          phone: string | null
          message: string
          status: 'new' | 'contacted' | 'closed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          user_id?: string
          name: string
          email: string
          phone?: string | null
          message: string
          status?: 'new' | 'contacted' | 'closed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string | null
          message?: string
          status?: 'new' | 'contacted' | 'closed'
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          property_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
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
