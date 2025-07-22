import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { inquiriesApi } from '../api-client'
import { queryKeys } from '../query-keys'

/**
 * Inquiries-related React Query hooks
 */

// Get inquiries with pagination and filters
export function useInquiries(params?: {
  page?: number
  limit?: number
  status?: string
  category?: string
}) {
  return useQuery({
    queryKey: queryKeys.inquiries.list(params || {}).queryKey,
    queryFn: () => inquiriesApi.getInquiries(params),
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get single inquiry
export function useInquiry(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.inquiries.detail(id).queryKey,
    queryFn: () => inquiriesApi.getInquiry(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get answers for an inquiry
export function useAnswers(inquiryId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.inquiries.answers(inquiryId).queryKey,
    queryFn: () => inquiriesApi.getAnswers(inquiryId),
    enabled: enabled && !!inquiryId,
    staleTime: 1 * 60 * 1000, // 1 minute for real-time feel
  })
}

// Get user's inquiries
export function useUserInquiries(userId: string, params?: { limit?: number }) {
  return useQuery({
    queryKey: queryKeys.inquiries.byUser(userId, params).queryKey,
    queryFn: () => inquiriesApi.getUserInquiries(userId, params),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Create inquiry mutation
export function useCreateInquiry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: inquiriesApi.createInquiry,
    onSuccess: (data, variables) => {
      // Invalidate inquiries lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.inquiries.lists().queryKey,
      })
      
      // Invalidate user's inquiries if user is known
      if (variables.userId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.inquiries.byUser(variables.userId).queryKey,
        })
      }
    },
  })
}

// Update inquiry mutation
export function useUpdateInquiry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      inquiriesApi.updateInquiry(id, data),
    onSuccess: (data, variables) => {
      // Update specific inquiry cache
      queryClient.setQueryData(
        queryKeys.inquiries.detail(variables.id).queryKey,
        data
      )
      
      // Invalidate inquiries lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.inquiries.lists().queryKey,
      })
    },
  })
}

// Create answer mutation
export function useCreateAnswer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ inquiryId, data }: { inquiryId: string; data: any }) => 
      inquiriesApi.createAnswer(inquiryId, data),
    onSuccess: (data, variables) => {
      // Invalidate answers for this inquiry
      queryClient.invalidateQueries({
        queryKey: queryKeys.inquiries.answers(variables.inquiryId).queryKey,
      })
      
      // Invalidate inquiry details to update answer count
      queryClient.invalidateQueries({
        queryKey: queryKeys.inquiries.detail(variables.inquiryId).queryKey,
      })
      
      // Invalidate inquiries lists to update answer counts
      queryClient.invalidateQueries({
        queryKey: queryKeys.inquiries.lists().queryKey,
      })
    },
  })
}