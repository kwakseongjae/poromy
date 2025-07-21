'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/contexts/SupabaseContext'
import AdminErrorBoundary from './AdminErrorBoundary'

interface AdminGuardProps {
  children: React.ReactNode
  fallbackUrl?: string
  loadingComponent?: React.ReactNode
}

/**
 * AdminGuard - HOC to protect admin-only pages
 * 
 * Usage:
 * <AdminGuard>
 *   <YourAdminComponent />
 * </AdminGuard>
 */
export default function AdminGuard({ 
  children, 
  fallbackUrl = '/403',
  loadingComponent
}: AdminGuardProps) {
  const { user, isAdmin, loading, adminLoading } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    // Skip if still loading
    if (loading || adminLoading) return

    // Not logged in - redirect to login
    if (!user) {
      router.push('/login')
      return
    }

    // Not admin - redirect to fallback URL
    if (!isAdmin) {
      router.push(fallbackUrl)
      return
    }
  }, [user, isAdmin, loading, adminLoading, router, fallbackUrl])

  // Show loading state
  if (loading || adminLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>
    }
    
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">
            {loading ? '인증을 확인하는 중...' : '권한을 확인하는 중...'}
          </p>
        </div>
      </div>
    )
  }

  // Not authorized - show nothing (redirect will happen)
  if (!user || !isAdmin) {
    return null
  }

  // Authorized - render children with error boundary
  return (
    <AdminErrorBoundary>
      {children}
    </AdminErrorBoundary>
  )
}

/**
 * withAdminAuth - HOC function to wrap components
 * 
 * Usage:
 * export default withAdminAuth(YourComponent)
 */
export function withAdminAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallbackUrl?: string
    loadingComponent?: React.ReactNode
  }
) {
  return function AdminAuthWrapper(props: P) {
    return (
      <AdminGuard 
        fallbackUrl={options?.fallbackUrl} 
        loadingComponent={options?.loadingComponent}
      >
        <Component {...props} />
      </AdminGuard>
    )
  }
}