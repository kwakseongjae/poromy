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
      administrators: {
        Row: {
          id: string
          created_at: string
        }
        Insert: {
          id: string
          created_at?: string
        }
        Update: {
          id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'administrators_id_fkey'
            columns: ['id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: 'answers_admin_id_fkey'
            columns: ['admin_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'answers_inquiry_id_fkey'
            columns: ['inquiry_id']
            referencedRelation: 'inquiries'
            referencedColumns: ['id']
          },
        ]
      }
      inquiries: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          url: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          url?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          url?: string | null
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'inquiries_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      jobs: {
        Row: {
          id: number
          company_name: string
          job_title: string
          conditions: string[]
          job_type: string
          position_description: string
          main_task: string
          qualifications: string[]
          preferred_qualifications: string[]
          logo_url: string | null
          url: string | null
          prompt_content: string | null
          deadline: string
          created_at: string
          updated_at: string
        }
        Insert: {
          company_name: string
          job_title: string
          conditions: string[]
          job_type: string
          position_description: string
          main_task: string
          qualifications: string[]
          preferred_qualifications: string[]
          logo_url?: string | null
          url?: string | null
          prompt_content?: string | null
          deadline: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          company_name?: string
          job_title?: string
          conditions?: string[]
          job_type?: string
          position_description?: string
          main_task?: string
          qualifications?: string[]
          preferred_qualifications?: string[]
          logo_url?: string | null
          url?: string | null
          prompt_content?: string | null
          deadline?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string
          nickname: string
          created_at: string
          updated_at: string
          is_verified: boolean
          is_admin: boolean
        }
        Insert: {
          id: string
          email: string
          nickname: string
          created_at?: string
          updated_at?: string
          is_verified?: boolean
          is_admin?: boolean
        }
        Update: {
          id?: string
          email?: string
          nickname?: string
          created_at?: string
          updated_at?: string
          is_verified?: boolean
          is_admin?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
