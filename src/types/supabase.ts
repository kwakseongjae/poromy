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
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          nickname?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nickname?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      [key: string]: unknown
    }
  }
}
