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
      profiles: {
        Row: {
          id: string
          email: string
          nickname: string | null
          is_verified: boolean
          created_at: string
          is_admin: boolean
        }
        Insert: {
          id: string
          email: string
          nickname?: string | null
          is_verified?: boolean
          created_at?: string
          is_admin?: boolean
        }
        Update: {
          id?: string
          email?: string
          nickname?: string | null
          is_verified?: boolean
          created_at?: string
          is_admin?: boolean
        }
      }
      inquiries: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          status: string
          created_at: string
          url: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          status?: string
          created_at?: string
          url?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          status?: string
          created_at?: string
          url?: string | null
        }
      }
      answers: {
        Row: {
          id: string
          inquiry_id: string
          admin_id: string
          content: string
          url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          inquiry_id: string
          admin_id: string
          content: string
          url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          inquiry_id?: string
          admin_id?: string
          content?: string
          url?: string | null
          created_at?: string
        }
      }
    }
  }
}
