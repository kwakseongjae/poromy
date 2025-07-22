import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  useInfiniteQuery,
  keepPreviousData 
} from '@tanstack/react-query'
import { jobsApi } from '../api-client'
import { queryKeys } from '../query-keys'

/**
 * Jobs-related React Query hooks
 */

// Get jobs with pagination and filters
export function useJobs(params?: {
  page?: number
  limit?: number
  offset?: number
  latest?: boolean
  company?: string
  type?: string
  query?: string
}) {
  return useQuery({
    queryKey: queryKeys.jobs.list(params || {}).queryKey,
    queryFn: () => jobsApi.getJobs(params),
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get latest jobs
export function useLatestJobs(limit = 10) {
  return useQuery({
    queryKey: queryKeys.jobs.list({ latest: true, limit }).queryKey,
    queryFn: () => jobsApi.getJobs({ latest: true, limit }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get paginated jobs
export function usePaginatedJobs(page = 1, limit = 20) {
  return useQuery({
    queryKey: queryKeys.jobs.list({ page, limit }).queryKey,
    queryFn: () => jobsApi.getJobs({ page, limit }),
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Infinite query for jobs
export function useInfiniteJobs(params?: {
  limit?: number
  company?: string
  type?: string
  query?: string
}) {
  return useInfiniteQuery({
    queryKey: queryKeys.jobs.infinite(params || {}).queryKey,
    queryFn: ({ pageParam = 0 }) => 
      jobsApi.getJobs({ offset: pageParam, limit: params?.limit || 20, ...params }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.length * (params?.limit || 20)
      return lastPage.jobs.length === (params?.limit || 20) ? totalFetched : undefined
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get single job
export function useJob(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.jobs.detail(id).queryKey,
    queryFn: () => jobsApi.getJob(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Get jobs by company
export function useJobsByCompany(companyId: string, params?: { limit?: number }) {
  return useQuery({
    queryKey: queryKeys.jobs.byCompany(companyId, params).queryKey,
    queryFn: () => jobsApi.getJobsByCompany(companyId, params),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get jobs by type
export function useJobsByType(type: string, params?: { limit?: number }) {
  return useQuery({
    queryKey: queryKeys.jobs.byType(type, params).queryKey,
    queryFn: () => jobsApi.getJobsByType(type, params),
    enabled: !!type,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Search jobs
export function useSearchJobs(
  query: string, 
  params?: { limit?: number; offset?: number },
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.jobs.search(query, params).queryKey,
    queryFn: () => jobsApi.searchJobs(query, params),
    enabled: enabled && !!query.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get jobs count
export function useJobsCount() {
  return useQuery({
    queryKey: queryKeys.jobs.count().queryKey,
    queryFn: jobsApi.getJobsCount,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Admin: Get all jobs
export function useAllJobs(params?: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: queryKeys.jobs.list(params || {}).queryKey,
    queryFn: () => jobsApi.getJobs(params),
    placeholderData: keepPreviousData,
    staleTime: 1 * 60 * 1000, // 1 minute for admin
  })
}

// Create job mutation
export function useCreateJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: jobsApi.createJob,
    onSuccess: () => {
      // Invalidate all job queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.jobs.all().queryKey,
      })
      // Invalidate jobs count
      queryClient.invalidateQueries({
        queryKey: queryKeys.jobs.count().queryKey,
      })
    },
  })
}

// Update job mutation
export function useUpdateJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      jobsApi.updateJob(id, data),
    onSuccess: (data, variables) => {
      // Update specific job cache
      queryClient.setQueryData(
        queryKeys.jobs.detail(variables.id).queryKey,
        data
      )
      // Invalidate job lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.jobs.lists().queryKey,
      })
    },
  })
}

// Delete job mutation
export function useDeleteJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: jobsApi.deleteJob,
    onSuccess: (_, jobId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: queryKeys.jobs.detail(jobId).queryKey,
      })
      // Invalidate job lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.jobs.lists().queryKey,
      })
      // Invalidate jobs count
      queryClient.invalidateQueries({
        queryKey: queryKeys.jobs.count().queryKey,
      })
    },
  })
}