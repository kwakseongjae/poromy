'use client'

import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'
import AdminGuard from '@/components/admin/AdminGuard'
import AddTestUserForm from './AddTestUserForm'

function AddTestUsersContent() {
  const [testUserCount, setTestUserCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTestUserCount() {
      try {
        const supabase = createBrowserSupabaseClient()
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('is_test_user', true)
        setTestUserCount(count || 0)
      } catch (error) {
        console.error('Error fetching test user count:', error)
        setTestUserCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchTestUserCount()
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-md flex-col items-center justify-center gap-6 rounded-lg bg-white p-8 shadow">
        <h2 className="mb-2 text-xl font-bold">테스트 유저 추가</h2>
        <p className="mb-4">
          현재 테스트 유저 수:{' '}
          <span className="font-mono">
            {loading ? '...' : testUserCount}
          </span>
        </p>
        <AddTestUserForm />
      </div>
    </main>
  )
}

export default function AddTestUsersPage() {
  return (
    <AdminGuard>
      <AddTestUsersContent />
    </AdminGuard>
  )
}
