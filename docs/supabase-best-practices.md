# Supabase Client Best Practices

## Overview

This document outlines the best practices for using Supabase clients in the Poromy project. Following these patterns ensures efficient resource usage, consistent authentication handling, and maintainable code.

## Client Types and Usage

### 1. Browser Client (Client-Side)
```typescript
import { createBrowserSupabaseClient } from '@/lib/supabase-client'

// Usage in React components
const supabase = createBrowserSupabaseClient()
```

**When to use:**
- Client-side React components
- Browser-based authentication
- Real-time subscriptions
- User-scoped operations

**Features:**
- Singleton pattern (reuses same instance)
- Automatic session persistence
- Cookie-based authentication

### 2. Server Client (Server-Side)
```typescript
import { createClient } from '@/lib/supabase-server'

// Usage in Server Components and API routes
const supabase = await createClient()
```

**When to use:**
- Server components
- API routes (for user-authenticated requests)
- Server-side data fetching
- Operations that respect RLS policies

**Features:**
- Fresh instance per request
- Cookie-based authentication
- Respects Row Level Security (RLS)

### 3. Admin Client (Service Role)
```typescript
import { createAdminClient } from '@/lib/supabase-server'

// Usage for admin operations
const supabase = createAdminClient()
```

**When to use:**
- Admin operations that bypass RLS
- User management (creating, updating users)
- System-level operations
- Background jobs and migrations

**Features:**
- Cached instance for performance
- Bypasses all RLS policies
- Full database access
- Service role authentication

### 4. Middleware Client
```typescript
import { createMiddlewareClient } from '@/lib/supabase-middleware'

// Usage in middleware.ts
const supabase = createMiddlewareClient(request, response)
```

**When to use:**
- Next.js middleware
- Route protection
- Authentication checks before page load

**Features:**
- Request/Response cookie handling
- Lightweight authentication checks

## Anti-Patterns to Avoid

### ❌ Don't import createClient directly from @supabase/supabase-js
```typescript
// Bad
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
```

### ❌ Don't create clients at module level in API routes
```typescript
// Bad - creates instance on module load
const supabase = createClient(...) // Module level

export async function GET() {
  // Uses stale client
}
```

### ❌ Don't mix client types
```typescript
// Bad - using browser client in server context
import { createBrowserSupabaseClient } from '@/lib/supabase-client'

export async function GET() {
  const supabase = createBrowserSupabaseClient() // Won't work properly
}
```

## Correct Patterns

### ✅ API Route with User Authentication
```typescript
import { createClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // User-scoped operations
  const { data } = await supabase
    .from('user_data')
    .select('*')
    .eq('user_id', user.id)
}
```

### ✅ API Route with Admin Operations
```typescript
import { createAdminClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  const supabase = createAdminClient()
  
  // Admin operations that bypass RLS
  const { data, error } = await supabase
    .from('profiles')
    .update({ is_verified: true })
    .eq('id', userId)
}
```

### ✅ React Component with Real-time
```typescript
'use client'

import { createBrowserSupabaseClient } from '@/lib/supabase-client'
import { useEffect } from 'react'

export function RealtimeComponent() {
  const supabase = createBrowserSupabaseClient()
  
  useEffect(() => {
    const channel = supabase
      .channel('realtime-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        console.log('Change received!', payload)
      })
      .subscribe()
      
    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])
}
```

## Performance Optimization

### Client Caching
- **Browser Client**: Automatically cached (singleton)
- **Admin Client**: Automatically cached for service role operations
- **Server Client**: Not cached (fresh per request for proper auth)

### Connection Pooling
All clients are configured with:
- `Connection: keep-alive` headers
- Optimized for connection reuse
- Minimal overhead for subsequent requests

### Best Practices Summary

1. **Always use the appropriate client for your context**
   - Browser components → `createBrowserSupabaseClient()`
   - Server components/API routes → `await createClient()`
   - Admin operations → `createAdminClient()`

2. **Create clients inside functions, not at module level**
   - Ensures fresh authentication state
   - Prevents stale connections

3. **Use TypeScript types from @/types/supabase**
   - Provides type safety for database operations
   - Auto-completion for table and column names

4. **Handle errors appropriately**
   - Always check for errors in Supabase operations
   - Provide meaningful error messages
   - Log errors for debugging

5. **Respect Row Level Security (RLS)**
   - Use regular clients for user operations
   - Only use admin client when absolutely necessary
   - Document why admin access is needed

## Migration Checklist

When adding new Supabase operations:

- [ ] Identify the context (client/server/admin)
- [ ] Import from the correct lib file
- [ ] Create client inside the function
- [ ] Handle authentication if needed
- [ ] Check for errors
- [ ] Test with appropriate user permissions