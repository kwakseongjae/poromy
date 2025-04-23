'use client'

import { useSupabase } from '@/contexts/SupabaseContext'
import Image from 'next/image'
import { ProfileImage } from '@/assets'

export default function ProfileModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { user, signOut } = useSupabase()

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
            <h3 className="text-lg font-medium text-gray-900">
              {user?.user_metadata.nickname}
            </h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
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
