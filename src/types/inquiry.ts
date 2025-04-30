export interface Answer {
  id: string
  content: string
  url: string | null
  created_at: string
  admin_id: string
  inquiry_id: string
  admin?: {
    nickname: string
  }
}

export interface User {
  email: string
  nickname: string
}

export interface Profile {
  id: string
  email: string
  nickname: string
}

export interface Inquiry {
  id: string
  title: string
  content: string
  url?: string
  status: 'pending' | 'answered'
  created_at: string
  user_id: string
  user?: {
    id: string
    email: string
    nickname: string
  }
  answers?: {
    id: string
    content: string
    url?: string
    created_at: string
    admin_id: string
    inquiry_id: string
    admin: {
      nickname: string
    }
  }[]
  profiles?: {
    id: string
    email: string
    nickname: string
  }
}
