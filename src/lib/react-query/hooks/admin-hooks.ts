import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { adminApi } from '../api-client'
import { queryKeys } from '../query-keys'

/**
 * Admin-related React Query hooks
 */

// Get admin stats
export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.admin.stats().queryKey,
    queryFn: adminApi.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get users (admin only)
export function useAdminUsers(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.admin.users(params).queryKey,
    queryFn: () => adminApi.getUsers(params),
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get admin jobs view
export function useAdminJobs(params?: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: queryKeys.admin.jobs(params).queryKey,
    queryFn: () => adminApi.getAdminJobs(params),
    placeholderData: keepPreviousData,
    staleTime: 1 * 60 * 1000, // 1 minute for admin view
  })
}

// Get admin inquiries view
export function useAdminInquiries(params?: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: queryKeys.admin.inquiries(params).queryKey,
    queryFn: () => adminApi.getAdminInquiries(params),
    placeholderData: keepPreviousData,
    staleTime: 1 * 60 * 1000, // 1 minute for admin view
  })
}

// Get test user count
export function useTestUserCount() {
  return useQuery({
    queryKey: queryKeys.admin.testUserCount().queryKey,
    queryFn: adminApi.getTestUserCount,
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Add test users mutation
export function useAddTestUsers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: adminApi.addTestUsers,
    onSuccess: () => {
      // Invalidate admin stats
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.stats().queryKey,
      })
      
      // Invalidate users list
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.users().queryKey,
      })
      
      // Invalidate test user count
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.testUserCount().queryKey,
      })
    },
  })
}