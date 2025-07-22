import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api-client'
import { queryKeys } from '../query-keys'

/**
 * Authentication-related React Query hooks
 */

// Get current user
export function useUser() {
  return useQuery({
    queryKey: queryKeys.auth.user().queryKey,
    queryFn: authApi.getUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get user profile
export function useProfile(userId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.auth.profile(userId).queryKey,
    queryFn: () => authApi.getProfile(userId),
    enabled: enabled && !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Update user profile
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (data, variables) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.user().queryKey,
      })
      
      // Update profile cache
      if (data.profile?.id) {
        queryClient.setQueryData(
          queryKeys.auth.profile(data.profile.id).queryKey,
          data
        )
      }
    },
  })
}

// Create user profile
export function useCreateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.createProfile,
    onSuccess: (data) => {
      // Invalidate user data to refetch with new profile
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.user().queryKey,
      })
      
      // Set profile cache
      if (data.profile?.id) {
        queryClient.setQueryData(
          queryKeys.auth.profile(data.profile.id).queryKey,
          data
        )
      }
    },
  })
}