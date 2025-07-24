'use client'

import AdminGuard from '@/components/admin/AdminGuard'
import AddTestUserForm from '../../../components/admin/AddTestUserForm'
import { useTestUserCount } from '@/lib/react-query/hooks/admin-hooks'

function AddTestUsersContent() {
  const { data, isLoading, error } = useTestUserCount()
  const testUserCount = data?.count ?? null

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-md flex-col items-center justify-center gap-6 rounded-lg bg-white p-8 shadow">
        <h2 className="mb-2 text-xl font-bold">테스트 유저 추가</h2>
        <p className="mb-4">
          현재 테스트 유저 수:{' '}
          <span className="font-mono">
            {isLoading ? '...' : error ? 'Error' : testUserCount}
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
