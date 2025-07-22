# React Query Migration Guide

This document outlines the migration from inconsistent Supabase client usage and manual fetch calls to a unified React Query architecture.

## Overview

### ✅ Completed Changes

1. **Removed direct Supabase usage from RootLayout** - Authentication is now handled client-side via SupabaseProvider
2. **Created centralized API client** - All server communication goes through `/src/lib/react-query/api-client.ts`
3. **Implemented type-safe query keys** - Using `@lukemorales/query-key-factory` for consistent key management
4. **Built comprehensive React Query hooks** - All data fetching operations have dedicated hooks
5. **Updated React Query provider** - Optimized configuration with proper error handling and retry logic

### 🔄 Migration Examples

#### Before: Manual fetch with useState/useEffect
```typescript
// Old pattern
const [jobs, setJobs] = useState<Job[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
  const fetchJobs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/jobs?limit=10')
      const data = await response.json()
      setJobs(data.jobs)
    } catch (err) {
      setError('Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }
  fetchJobs()
}, [])
```

#### After: React Query hook
```typescript
// New pattern
import { useLatestJobs } from '@/lib/react-query/hooks'

const {
  data: jobs,
  isLoading: loading,
  error
} = useLatestJobs(10)
```

#### Before: Direct Supabase queries
```typescript
// Old pattern
const [user, setUser] = useState<User | null>(null)
const supabase = createBrowserSupabaseClient()

useEffect(() => {
  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }
  getUser()
}, [])
```

#### After: React Query with API route
```typescript
// New pattern
import { useUser } from '@/lib/react-query/hooks'

const { data: user, isLoading } = useUser()
```

## Architecture

### File Structure
```
src/lib/react-query/
├── index.ts                 # Main export file
├── client.ts               # Query client configuration
├── query-keys.ts           # Type-safe query key factory
├── api-client.ts           # Centralized API client
└── hooks/
    ├── index.ts            # Export all hooks
    ├── auth-hooks.ts       # Authentication hooks
    ├── jobs-hooks.ts       # Jobs-related hooks
    ├── inquiries-hooks.ts  # Inquiries hooks
    ├── admin-hooks.ts      # Admin functionality hooks
    └── utils-hooks.ts      # Utility hooks (prompts, link preview, etc.)
```

### Query Key Structure
```typescript
// Type-safe query keys using query-key-factory
import { queryKeys } from '@/lib/react-query/query-keys'

// Examples:
queryKeys.jobs.list({ page: 1, limit: 20 })
queryKeys.jobs.detail('123')
queryKeys.auth.user()
queryKeys.inquiries.answers('456')
```

### API Client Features
- **Centralized error handling** - Consistent error types and responses
- **Request timeout management** - 10 second default timeout
- **Type-safe responses** - Full TypeScript support
- **Custom error class** - `ApiError` with status codes
- **Automatic JSON handling** - Content-Type headers and parsing

## Available Hooks

### Authentication
- `useUser()` - Current user data
- `useProfile(userId)` - User profile information
- `useUpdateProfile()` - Profile update mutation
- `useCreateProfile()` - Profile creation mutation

### Jobs
- `useJobs(params)` - Jobs with filtering and pagination
- `useLatestJobs(limit)` - Recent job postings
- `usePaginatedJobs(page, limit)` - Paginated job list
- `useInfiniteJobs(params)` - Infinite scroll jobs
- `useJob(id)` - Single job details
- `useJobsByCompany(companyId)` - Company-specific jobs
- `useJobsByType(type)` - Jobs by type/category
- `useSearchJobs(query)` - Job search functionality
- `useJobsCount()` - Total job count
- `useCreateJob()` - Create job (admin)
- `useUpdateJob()` - Update job (admin)
- `useDeleteJob()` - Delete job (admin)

### Inquiries
- `useInquiries(params)` - Inquiry list with filtering
- `useInquiry(id)` - Single inquiry details
- `useAnswers(inquiryId)` - Answers for an inquiry
- `useUserInquiries(userId)` - User's inquiries
- `useCreateInquiry()` - Create inquiry mutation
- `useUpdateInquiry()` - Update inquiry mutation
- `useCreateAnswer()` - Create answer mutation

### Admin
- `useAdminStats()` - Admin dashboard statistics
- `useAdminUsers(params)` - User management
- `useAdminJobs(params)` - Admin job management
- `useAdminInquiries(params)` - Admin inquiry management
- `useAddTestUsers()` - Add test users mutation

### Utilities
- `useCompanyPrompt(id)` - Company-specific prompts
- `usePositionPrompt(id)` - Position-specific prompts
- `useLinkPreview(url)` - Link preview data
- `useSendInquiryNotification()` - Send inquiry notification
- `useSendAnswerNotification()` - Send answer notification
- `useRevalidate()` - Cache revalidation

## Migration Status

### ✅ Completed Components
- `LinkPreview.tsx` - Migrated to `useLinkPreview()`
- New example: `NewPositionContent.tsx` - Modern React Query implementation

### 🔄 Components In Progress
- `PositionContent.tsx` - Large complex component (replace with NewPositionContent.tsx)
- `InquiryList.tsx` - Complex Supabase queries
- `ProfileModal.tsx` - Profile management

### 📋 Components Pending Migration
- `LinkPreviewThumbnail.tsx`
- `AnswerForm.tsx` 
- `DeviceAwarePositionView.tsx`
- `JobList.tsx`
- Admin components
- Authentication pages

### 🚫 Legacy Hook Status
- `useJobsQueries.ts` - **DEPRECATED** - Now exports new hooks for backward compatibility

## Benefits

### Performance
- **Automatic caching** - Reduces unnecessary API calls
- **Background updates** - Data stays fresh without blocking UI
- **Request deduplication** - Multiple components can use same query without multiple requests
- **Optimistic updates** - Immediate UI feedback for mutations

### Developer Experience
- **Type safety** - Full TypeScript support with query key factory
- **Loading states** - Built-in loading, error, and success states
- **DevTools** - React Query DevTools for debugging
- **Consistent patterns** - Unified approach across all data fetching

### Reliability
- **Error boundaries** - Graceful error handling
- **Retry logic** - Automatic retries with exponential backoff
- **Network resilience** - Handles offline/online scenarios
- **Cache persistence** - Data survives component unmounts

## Migration Steps for Components

### 1. Identify Current Pattern
- Direct `fetch()` calls
- `useState` + `useEffect` for data
- Direct Supabase client usage

### 2. Choose Appropriate Hook
- Find existing hook in `/src/lib/react-query/hooks/`
- If none exists, create new hook following established patterns

### 3. Replace State Management
```typescript
// Remove
const [data, setData] = useState()
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

// Replace with
const { data, isLoading: loading, error } = useAppropriateHook()
```

### 4. Remove Manual Fetch Logic
- Delete `useEffect` with fetch calls
- Remove manual error handling
- Remove loading state management

### 5. Update Error Handling
```typescript
// Old
if (error) {
  return <div>Error: {error}</div>
}

// New  
if (error) {
  return <div>Error: {error.message}</div>
}
```

### 6. Test
- Verify data loading works
- Check loading states
- Test error scenarios
- Confirm caching behavior

## Best Practices

### Hook Usage
- Enable/disable queries based on dependencies
- Use `keepPreviousData` for pagination
- Set appropriate `staleTime` based on data freshness needs
- Use mutations for data modifications

### Error Handling
- Always handle error states in UI
- Use React Query's built-in retry logic
- Implement fallback UI for critical failures
- Log errors appropriately

### Performance
- Set reasonable `staleTime` values
- Use infinite queries for large lists
- Implement proper loading states
- Avoid over-fetching data

### Caching Strategy
- Shorter cache times for real-time data (1-2 minutes)
- Longer cache times for static data (10-30 minutes)
- Use query invalidation for related data updates
- Consider cache dependencies

## Troubleshooting

### Common Issues
1. **Query not running** - Check `enabled` condition
2. **Stale data** - Adjust `staleTime` or manually invalidate
3. **Too many requests** - Verify query key stability
4. **Type errors** - Ensure proper TypeScript types in API client

### Debug Tools
- React Query DevTools in development
- Network tab in browser DevTools  
- Console logging for query states
- Query key inspection

## Next Steps

1. **Complete component migrations** - Finish updating remaining components
2. **Add missing API endpoints** - Create any missing hooks for new features
3. **Optimize caching strategies** - Fine-tune based on usage patterns
4. **Add testing** - Unit tests for hooks and integration tests
5. **Performance monitoring** - Track query performance and optimization opportunities

---

This migration provides a solid foundation for scalable, maintainable data fetching patterns throughout the application.