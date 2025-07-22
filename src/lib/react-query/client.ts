import { QueryClient } from '@tanstack/react-query'

/**
 * React Query Client Configuration
 * 
 * Centralized configuration for React Query with optimized defaults
 */

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      // Global query defaults
      staleTime: 5 * 60 * 1000, // 5 minutes default
      gcTime: 10 * 60 * 1000, // 10 minutes garbage collection (was cacheTime)
      retry: (failureCount: number, error: any) => {
        // Don't retry on 4xx errors except 408 (timeout)
        if (error?.status >= 400 && error?.status < 500 && error?.status !== 408) {
          return false
        }
        // Retry up to 3 times for other errors
        return failureCount < 3
      },
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false, // Disable for better UX in development
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      // Global mutation defaults
      retry: 1, // Only retry mutations once
      gcTime: 5 * 60 * 1000, // 5 minutes
    },
  },
}

// Create the query client
export const createQueryClient = () => new QueryClient(queryClientConfig)

// Default query client instance (if needed)
export const queryClient = createQueryClient()

// Query client persistence options for SSR
export const getQueryClientOptions = () => ({
  ...queryClientConfig,
  // Additional SSR-specific options can be added here
})