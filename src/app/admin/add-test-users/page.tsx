import { createAdminClient } from '@/lib/supabase-server'
import AddTestUserForm from './AddTestUserForm'

async function getTestUserCount() {
  const supabase = createAdminClient()
  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_test_user', true)
  return count || 0
}

export default async function AddTestUsersPage() {
  const testUserCount = await getTestUserCount()

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-md flex-col items-center justify-center gap-6 rounded-lg bg-white p-8 shadow">
        <h2 className="mb-2 text-xl font-bold">테스트 유저 추가</h2>
        <p className="mb-4">
          현재 테스트 유저 수:{' '}
          <span className="font-mono">{testUserCount}</span>
        </p>
        <AddTestUserForm />
      </div>
    </main>
  )
}
