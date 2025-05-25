export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          description: string
          date_time: string
          location: string
          category: string
          image_url: string | null
          status: 'pending' | 'approved' | 'rejected'
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          date_time: string
          location: string
          category: string
          image_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          date_time?: string
          location?: string
          category?: string
          image_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      participants: {
        Row: {
          id: string
          event_id: string
          participant_name: string
          participant_email: string
          added_at: string
          added_by: string
        }
        Insert: {
          id?: string
          event_id: string
          participant_name: string
          participant_email: string
          added_at?: string
          added_by: string
        }
        Update: {
          id?: string
          event_id?: string
          participant_name?: string
          participant_email?: string
          added_at?: string
          added_by?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'customer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'customer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'customer'
          created_at?: string
          updated_at?: string
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