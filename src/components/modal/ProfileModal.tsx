'use client'

import { useSupabase } from '@/contexts/SupabaseContext'
import Image from 'next/image'
import { EditIcon, ProfileImage } from '@/assets'
import { useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'

export default function ProfileModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { user, signOut, refreshSession } = useSupabase()
  const [isEditing, setIsEditing] = useState(false)
  const [newNickname, setNewNickname] = useState(
    user?.user_metadata.nickname || ''
  )
  const [error, setError] = useState<string | null>(null)
  const supabase = createBrowserSupabaseClient()

  const handleUpdateNickname = async () => {
    if (!user) return

    try {
      setError(null)

      // 1. Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { nickname: newNickname },
      })

      if (updateError) throw updateError

      // 2. Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ nickname: newNickname })
        .eq('id', user.id)

      if (profileError) throw profileError

      await refreshSession()
      setIsEditing(false)
    } catch (error) {
      console.error('닉네임 업데이트 오류:', error)
      setError('닉네임 업데이트 중 오류가 발생했습니다.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-80 rounded-lg bg-white p-4 shadow-xl">
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-4 border-b border-gray-200 pb-4">
          <Image
            src={ProfileImage}
            alt="Profile"
            width={80}
            height={80}
            className="rounded-full"
          />
          <div className="text-center">
            {isEditing ? (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    className="rounded border border-gray-300 p-1 text-center font-medium"
                    maxLength={20}
                  />
                  <button
                    onClick={handleUpdateNickname}
                    className="rounded bg-blue-500 px-2 py-1 text-sm whitespace-nowrap text-white hover:bg-blue-600"
                    aria-label="저장"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setError(null)
                      setNewNickname(user?.user_metadata.nickname || '')
                    }}
                    className="rounded bg-gray-200 px-2 py-1 text-sm whitespace-nowrap text-gray-700 hover:bg-gray-300"
                    aria-label="취소"
                  >
                    취소
                  </button>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {user?.user_metadata.nickname}
                  </h3>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="cursor-pointer rounded-lg bg-gray-100 p-1 hover:bg-gray-300"
                    aria-label="닉네임 수정"
                    tabIndex={0}
                  >
                    <EditIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            <p className="mt-1 text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Actions Section */}
        <div className="mt-4">
          <button
            onClick={() => {
              signOut()
              onClose()
            }}
            className="w-full cursor-pointer rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  )
}
