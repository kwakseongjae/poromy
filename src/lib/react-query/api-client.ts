/**
 * API Client for all server communication
 * 
 * This module provides:
 * - Centralized API communication
 * - Type-safe request/response handling
 * - Error handling and retries
 * - Request/response interceptors
 */

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || ''

// Request configuration
interface RequestConfig extends RequestInit {
  timeout?: number
}

// Generic API response type
interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Generic API client function
async function apiClient<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { timeout = 10000, ...requestConfig } = config
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...requestConfig,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...requestConfig.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new ApiError(
        `HTTP Error: ${response.status} ${response.statusText}`,
        response.status,
        response
      )
    }

    const data = await response.json()
    
    // Handle API-level errors
    if (data.error) {
      throw new ApiError(data.error, response.status, response)
    }

    return data
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error instanceof ApiError) {
      throw error
    }
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408)
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error',
      0
    )
  }
}

// Authentication API
export const authApi = {
  getUser: () => apiClient<{ user: any }>('/api/auth/user'),
  getProfile: (userId: string) => 
    apiClient<{ profile: any }>(`/api/auth/profile/${userId}`),
  updateProfile: (data: any) => 
    apiClient<{ profile: any }>('/api/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  createProfile: (data: any) => 
    apiClient<{ profile: any }>('/api/auth/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getAdminStatus: () => 
    apiClient<{ isAdmin: boolean }>('/api/auth/admin-status'),
}

// Jobs API
export const jobsApi = {
  getJobs: (params?: {
    page?: number
    limit?: number
    offset?: number
    latest?: boolean
    company?: string
    type?: string
    query?: string
  }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, value.toString())
        }
      })
    }
    return apiClient<{ jobs: any[]; total?: number }>(`/api/jobs?${searchParams}`)
  },
  
  getJob: (id: string) => 
    apiClient<{ job: any }>(`/api/jobs/${id}`),
  
  getJobsByCompany: (companyId: string, params?: { limit?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.limit) {
      searchParams.set('limit', params.limit.toString())
    }
    return apiClient<{ jobs: any[] }>(`/api/jobs/company/${companyId}?${searchParams}`)
  },
  
  getJobsByType: (type: string, params?: { limit?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.limit) {
      searchParams.set('limit', params.limit.toString())
    }
    return apiClient<{ jobs: any[] }>(`/api/jobs/type/${type}?${searchParams}`)
  },
  
  searchJobs: (query: string, params?: { limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams({ query })
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, value.toString())
        }
      })
    }
    return apiClient<{ jobs: any[]; total?: number }>(`/api/jobs/search?${searchParams}`)
  },
  
  getJobsCount: () => 
    apiClient<{ count: number }>('/api/jobs/count'),
  
  createJob: (data: any) => 
    apiClient<{ job: any }>('/api/admin/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updateJob: (id: string, data: any) => 
    apiClient<{ job: any }>(`/api/admin/jobs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  deleteJob: (id: string) => 
    apiClient<{ success: boolean }>(`/api/admin/jobs/${id}`, {
      method: 'DELETE',
    }),
}

// Companies API
export const companiesApi = {
  getCompanies: () => 
    apiClient<{ companies: any[] }>('/api/companies'),
  
  getCompany: (id: string) => 
    apiClient<{ company: any }>(`/api/companies/${id}`),
  
  searchCompanies: (query: string) => 
    apiClient<{ companies: any[] }>(`/api/companies/search?query=${encodeURIComponent(query)}`),
}

// Inquiries API
export const inquiriesApi = {
  getInquiries: (params?: {
    page?: number
    limit?: number
    status?: string
    category?: string
  }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, value.toString())
        }
      })
    }
    return apiClient<{ inquiries: any[]; total?: number }>(`/api/inquiries?${searchParams}`)
  },
  
  getInquiry: (id: string) => 
    apiClient<{ inquiry: any }>(`/api/inquiries/${id}`),
  
  createInquiry: (data: any) => 
    apiClient<{ inquiry: any }>('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updateInquiry: (id: string, data: any) => 
    apiClient<{ inquiry: any }>(`/api/inquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  getAnswers: (inquiryId: string) => 
    apiClient<{ answers: any[] }>(`/api/inquiries/${inquiryId}/answers`),
  
  createAnswer: (inquiryId: string, data: any) => 
    apiClient<{ answer: any }>(`/api/inquiries/${inquiryId}/answers`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getUserInquiries: (userId: string, params?: { limit?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.limit) {
      searchParams.set('limit', params.limit.toString())
    }
    return apiClient<{ inquiries: any[] }>(`/api/inquiries/user/${userId}?${searchParams}`)
  },
}

// Admin API
export const adminApi = {
  getStats: () => 
    apiClient<{ stats: any }>('/api/admin/stats'),
  
  getUsers: (params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, value.toString())
        }
      })
    }
    return apiClient<{ users: any[]; total?: number }>(`/api/admin/users?${searchParams}`)
  },
  
  getAdminJobs: (params?: { page?: number; limit?: number; status?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, value.toString())
        }
      })
    }
    return apiClient<{ jobs: any[]; total?: number }>(`/api/admin/jobs?${searchParams}`)
  },
  
  getAdminInquiries: (params?: { page?: number; limit?: number; status?: string }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, value.toString())
        }
      })
    }
    return apiClient<{ inquiries: any[]; total?: number }>(`/api/admin/inquiries?${searchParams}`)
  },
  
  addTestUsers: (data: { count: number }) => 
    apiClient<{ created: number; error?: string }>('/api/admin/add-test-users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  getTestUserCount: () =>
    apiClient<{ count: number }>('/api/admin/test-users/count'),
}

// Prompts API
export const promptsApi = {
  getCompanyPrompt: (id: string) => 
    apiClient<{ prompt: string }>(`/api/prompts/company/${id}`),
  
  getPositionPrompt: (id: string) => 
    apiClient<{ prompt: string }>(`/api/prompts/position/${id}`),
}

// Utilities API
export const utilsApi = {
  getLinkPreview: (url: string) => 
    apiClient<{ preview: any }>('/api/link-preview', {
      method: 'POST',
      body: JSON.stringify({ url }),
    }),
  
  sendInquiryNotification: (data: any) => 
    apiClient<{ success: boolean }>('/api/email/inquiry-notification', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  sendAnswerNotification: (data: any) => 
    apiClient<{ success: boolean }>('/api/email/answer-notification', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  revalidate: (path: string) => 
    apiClient<{ success: boolean }>('/api/revalidate', {
      method: 'POST',
      body: JSON.stringify({ path }),
    }),
}

// Export the main API client for custom requests
export { apiClient }