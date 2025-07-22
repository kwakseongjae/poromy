/**
 * Simple Query Keys without factory functions to avoid webpack initialization issues
 */
export const queryKeys = {
  // Authentication queries
  auth: {
    user: () => ({
      queryKey: ['poromy', 'auth', 'user'],
    }),
    profile: (userId: string) => ({ 
      queryKey: ['poromy', 'auth', 'profile', userId] 
    }),
  },

  // Job-related queries
  jobs: {
    all: () => ({
      queryKey: ['poromy', 'jobs', 'all'],
    }),
    lists: () => ({
      queryKey: ['poromy', 'jobs', 'list'],
    }),
    list: (params: {
      page?: number
      limit?: number
      offset?: number
      latest?: boolean
      company?: string
      type?: string
      query?: string
    }) => ({
      queryKey: ['poromy', 'jobs', 'list', params],
    }),
    infinite: (params: {
      limit?: number
      company?: string
      type?: string
      query?: string
    }) => ({
      queryKey: ['poromy', 'jobs', 'infinite', params],
    }),
    detail: (id: string) => ({
      queryKey: ['poromy', 'jobs', 'detail', id],
    }),
    byCompany: (companyId: string, params?: { limit?: number }) => ({
      queryKey: ['poromy', 'jobs', 'by-company', companyId, params],
    }),
    byType: (type: string, params?: { limit?: number }) => ({
      queryKey: ['poromy', 'jobs', 'by-type', type, params],
    }),
    search: (query: string, params?: { limit?: number; offset?: number }) => ({
      queryKey: ['poromy', 'jobs', 'search', query, params],
    }),
    count: () => ({
      queryKey: ['poromy', 'jobs', 'count'],
    }),
  },

  // Company-related queries
  companies: {
    all: () => ({
      queryKey: ['poromy', 'companies', 'all'],
    }),
    lists: () => ({
      queryKey: ['poromy', 'companies', 'list'],
    }),
    detail: (id: string) => ({
      queryKey: ['poromy', 'companies', 'detail', id],
    }),
    search: (query: string) => ({
      queryKey: ['poromy', 'companies', 'search', query],
    }),
  },

  // Inquiry-related queries
  inquiries: {
    all: () => ({
      queryKey: ['poromy', 'inquiries', 'all'],
    }),
    lists: () => ({
      queryKey: ['poromy', 'inquiries', 'list'],
    }),
    list: (params: {
      page?: number
      limit?: number
      status?: string
      category?: string
    }) => ({
      queryKey: ['poromy', 'inquiries', 'list', params],
    }),
    detail: (id: string) => ({
      queryKey: ['poromy', 'inquiries', 'detail', id],
    }),
    answers: (inquiryId: string) => ({
      queryKey: ['poromy', 'inquiries', 'answers', inquiryId],
    }),
    byUser: (userId: string, params?: { limit?: number }) => ({
      queryKey: ['poromy', 'inquiries', 'by-user', userId, params],
    }),
  },

  // Admin-related queries
  admin: {
    stats: () => ({
      queryKey: ['poromy', 'admin', 'stats'],
    }),
    users: (params?: { page?: number; limit?: number }) => ({
      queryKey: ['poromy', 'admin', 'users', params],
    }),
    jobs: (params?: { page?: number; limit?: number; status?: string }) => ({
      queryKey: ['poromy', 'admin', 'jobs', params],
    }),
    inquiries: (params?: { page?: number; limit?: number; status?: string }) => ({
      queryKey: ['poromy', 'admin', 'inquiries', params],
    }),
  },

  // Prompt-related queries
  prompts: {
    company: (id: string) => ({
      queryKey: ['poromy', 'prompts', 'company', id],
    }),
    position: (id: string) => ({
      queryKey: ['poromy', 'prompts', 'position', id],
    }),
  },

  // Utility queries
  utils: {
    linkPreview: (url: string) => ({
      queryKey: ['poromy', 'utils', 'link-preview', url],
    }),
  },
}

// Type exports for better TypeScript support
export type QueryKeys = typeof queryKeys
export type JobsQueryKeys = typeof queryKeys.jobs
export type AuthQueryKeys = typeof queryKeys.auth