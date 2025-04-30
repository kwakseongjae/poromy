'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/contexts/SupabaseContext'
import { useCursor } from '@/contexts/CursorContext'
import {
  HamburgerIcon,
  BulbIcon,
  DisabledBulbIcon,
  DisabledHamburgerIcon,
  InquiryTextImage,
} from '@/assets'
import Image from 'next/image'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const router = useRouter()
  const { user, loading } = useSupabase()
  const { incrementClickCount } = useCursor()
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [isPromptExpanded, setIsPromptExpanded] = useState(false)

  const handlePromptClick = () => {
    setIsPromptExpanded(!isPromptExpanded)
    incrementClickCount()
  }

  const handleClose = () => {
    onClose()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    onClose()
  }

  const handleLogin = () => {
    router.push('/login')
    onClose()
  }

  const renderAuthUI = () => {
    if (loading) {
      return <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-50" />
    }

    if (user) {
      return (
        <button
          onClick={handleLogout}
          className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-red-400 hover:bg-red-50"
        >
          로그아웃
        </button>
      )
    }

    return (
      <button
        onClick={handleLogin}
        className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100"
      >
        회원가입/로그인
      </button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-999 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 z-1000 h-full w-64 transform bg-white pt-[44px] transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full flex-col">
          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {/* Prompt Section */}
              <div
                className="group relative"
                onMouseEnter={() => setHoveredCategory('prompt')}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <button
                  className="flex w-full cursor-pointer items-center gap-1 px-2 py-2"
                  onClick={handlePromptClick}
                >
                  {hoveredCategory && hoveredCategory !== 'prompt' ? (
                    <DisabledHamburgerIcon className="h-5 w-5" />
                  ) : (
                    <HamburgerIcon className="h-5 w-5" />
                  )}
                  <span
                    className={`font-semibold select-none ${
                      hoveredCategory && hoveredCategory !== 'prompt'
                        ? 'text-text-disabled'
                        : ''
                    }`}
                  >
                    프롬프트
                  </span>
                </button>
                <div
                  className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                    isPromptExpanded
                      ? 'max-h-24 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <Link
                    href="/company"
                    className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleClose}
                  >
                    기업 분석 프롬프트
                  </Link>
                  <Link
                    href="/position"
                    className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleClose}
                  >
                    채용 공고 분석 프롬프트
                  </Link>
                </div>
              </div>

              <div className="border-t border-gray-100" />

              <Link
                href="/guide"
                className="flex items-center gap-1 px-2 py-2"
                onMouseEnter={() => setHoveredCategory('guide')}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={handleClose}
              >
                {hoveredCategory && hoveredCategory !== 'guide' ? (
                  <DisabledBulbIcon className="h-5 w-5" />
                ) : (
                  <BulbIcon className="h-5 w-5" />
                )}
                <span
                  className={`font-semibold ${
                    hoveredCategory && hoveredCategory !== 'guide'
                      ? 'text-text-disabled'
                      : ''
                  }`}
                >
                  적용 가이드
                </span>
              </Link>

              <div className="border-t border-gray-100" />

              <Link
                href="/inquiry"
                className="flex items-center gap-1 px-2 py-2"
                onMouseEnter={() => setHoveredCategory('inquiry')}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={handleClose}
              >
                <Image
                  src={InquiryTextImage}
                  alt="문의하기"
                  width={120}
                  height={20}
                  className="h-4"
                />
                <span className="text-600 ml-0.5 text-xs leading-none font-semibold">
                  Free
                </span>
              </Link>
            </div>
          </div>

          {/* Auth Button */}
          <div className="border-t border-gray-200 p-4">{renderAuthUI()}</div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
