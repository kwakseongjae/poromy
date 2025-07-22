/**
 * React Query Library - Main Export
 * 
 * This module provides a complete React Query setup with:
 * - Type-safe query keys
 * - Centralized API client
 * - Custom hooks for all data operations
 * - Optimized client configuration
 */

// Query keys and types
export * from './query-keys'

// API client functions
export * from './api-client'

// React Query hooks
export * from './hooks'

// Query client configuration
export * from './client'

// Re-export commonly used React Query utilities
export {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  keepPreviousData,
} from '@tanstack/react-query'