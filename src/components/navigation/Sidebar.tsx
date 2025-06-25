'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/contexts/SupabaseContext'
import {
  HamburgerIcon,
  BulbIcon,
  DisabledBulbIcon,
  DisabledHamburgerIcon,
  InquiryTextImage,
  LogoutIcon,
} from '@/assets'
import Image from 'next/image'
import { useState } from 'react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const router = useRouter()
  const { user, signOut } = useSupabase()
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [isPromptExpanded, setIsPromptExpanded] = useState(false)

  const handlePromptClick = () => {
    setIsPromptExpanded(!isPromptExpanded)
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setIsPromptExpanded(false)
    }, 300)
  }

  const handleLogout = async () => {
    await signOut()
    onClose()
  }

  const handleLogin = () => {
    router.push('/login')
    onClose()
  }

  const renderAuthUI = () => {
    if (user) {
      return (
        <button
          onClick={handleLogout}
          className="flex h-[60px] w-full cursor-pointer items-center border-gray-300 bg-white pl-[20px] text-[14px] font-semibold text-[#6B6B6B]"
        >
          <LogoutIcon className="h-[20px] w-[20px]" />
          <span className="ml-[10px]">로그아웃</span>
        </button>
      )
    }

    return (
      <div className="flex flex-col gap-[16px] bg-[#3182F6]/7 p-[20px]">
        <span className="text-[14px] font-semibold whitespace-pre-line text-[#171717]">
          {`회원가입만 하면\nPoromy가 추천하는 최적의 프롬프트 제공!`}
        </span>
        <button
          onClick={handleLogin}
          className="flex w-full cursor-pointer items-center justify-center rounded-[5px] border-gray-300 bg-[#3182F6] py-[14px]"
        >
          <span className="text-[14px] font-semibold text-white">회원가입</span>
        </button>
      </div>
    )
  }

  return (
    <div
      className={`fixed top-0 right-0 z-1000 block h-full w-full transform bg-white pt-[44px] transition-transform duration-300 sm:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex h-full flex-col">
        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto pt-4">
          <div>
            {/* Prompt Section */}
            <div
              className="group relative"
              onMouseEnter={() => setHoveredCategory('prompt')}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <button
                className="flex w-full cursor-pointer items-center gap-[8px] p-[20px] text-[16px]"
                onClick={handlePromptClick}
              >
                {hoveredCategory && hoveredCategory !== 'prompt' ? (
                  <DisabledHamburgerIcon className="h-[20px] w-[20px]" />
                ) : (
                  <HamburgerIcon className="h-[20px] w-[20px]" />
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
                className={`ml-[20px] overflow-hidden transition-all duration-300 ease-in-out ${
                  isPromptExpanded
                    ? 'max-h-[120px] opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <Link
                  href="/company"
                  className="block rounded-[5px] py-[20px] pl-[30px] text-[14px] font-semibold text-[#6B6B6B] hover:bg-[#EFEFEF]"
                  onClick={handleClose}
                >
                  기업 분석
                </Link>
                <Link
                  href="/position"
                  className="block rounded-[5px] py-[20px] pl-[30px] text-[14px] font-semibold text-[#6B6B6B] hover:bg-[#EFEFEF]"
                  onClick={handleClose}
                >
                  채용 공고 분석
                </Link>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            <Link
              href="/guide"
              className="flex items-center gap-[8px] p-[20px] text-[16px]"
              onMouseEnter={() => setHoveredCategory('guide')}
              onMouseLeave={() => setHoveredCategory(null)}
              onClick={handleClose}
            >
              {hoveredCategory && hoveredCategory !== 'guide' ? (
                <DisabledBulbIcon className="h-[20px] w-[20px]" />
              ) : (
                <BulbIcon className="h-[20px] w-[20px]" />
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
              className="flex items-center p-[20px]"
              onMouseEnter={() => setHoveredCategory('inquiry')}
              onMouseLeave={() => setHoveredCategory(null)}
              onClick={handleClose}
            >
              <Image
                src={InquiryTextImage}
                alt="문의하기"
                width={378}
                height={43}
                className="h-[18px]"
                style={{ width: 'auto' }}
              />
              <div className="ml-0.5 flex h-[18px] items-start">
                <span className="text-600 text-xs leading-none font-semibold">
                  Free
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Auth Button */}
        <div className="border-t border-gray-200">{renderAuthUI()}</div>
      </div>
    </div>
  )
}

export default Sidebar
