'use client'

import Link from 'next/link'
import {
  LogoIcon,
  HamburgerIcon,
  BulbIcon,
  DisabledBulbIcon,
  DisabledHamburgerIcon,
  ProfileImage,
  InquiryTextImage,
} from '@/assets'
import { useEffect, useState } from 'react'
import { useCursor } from '@/contexts/CursorContext'
import { useSupabase } from '@/contexts/SupabaseContext'
import Image from 'next/image'
import ProfileModal from '@/components/modal/ProfileModal'
import Sidebar from './Sidebar'
import { trackNavigationClick } from '@/lib/gtag'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { incrementClickCount } = useCursor()
  const { user, loading } = useSupabase()

  // 사용자 UI 상태를 관리하는 상태 변수
  const [authUIState, setAuthUIState] = useState<
    'loading' | 'authenticated' | 'unauthenticated'
  >('loading')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 사용자 인증 상태에 따라 UI 상태 업데이트
  useEffect(() => {
    if (loading) {
      setAuthUIState('loading')
    } else if (user) {
      setAuthUIState('authenticated')
    } else {
      setAuthUIState('unauthenticated')
    }
  }, [loading, user])

  const handlePromptClick = () => {
    incrementClickCount()
  }

  const handleProfileClick = () => {
    setIsProfileModalOpen(true)
  }

  const handleNavigationClick = (linkName: string, linkUrl: string) => {
    trackNavigationClick(linkName, linkUrl)
  }

  // 사용자 인증 UI 렌더링
  const renderAuthUI = () => {
    if (loading) {
      return <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-50" />
    }

    if (user) {
      return (
        <div className="flex items-center">
          <button
            className="flex cursor-pointer items-center justify-center"
            aria-label="User profile"
            tabIndex={0}
            onClick={() => {
              handleProfileClick()
              handleNavigationClick('프로필', '/profile')
            }}
          >
            <Image
              src={ProfileImage}
              alt="Profile"
              width={32}
              height={32}
              className="aspect-square w-8 rounded-full object-cover shadow-md hover:ring-6 hover:ring-gray-100"
            />
          </button>
        </div>
      )
    }

    return (
      <Link
        href="/login"
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100"
        aria-label="로그인 또는 회원가입"
        tabIndex={0}
        onClick={() => handleNavigationClick('로그인/회원가입', '/login')}
      >
        회원가입/로그인
      </Link>
    )
  }

  return (
    <>
      <nav
        className={`sticky top-0 z-9999 bg-white transition-all duration-200 ${
          isScrolled ? 'border-b border-gray-200' : ''
        }`}
      >
        <div className="mx-auto flex min-h-[44px] items-center justify-between px-4 sm:min-h-16 sm:px-6 lg:px-8">
          {/* Left Side */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" onClick={() => handleNavigationClick('Logo', '/')}>
                <LogoIcon className="w-25 sm:w-28 lg:w-32" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex sm:items-center sm:gap-4">
              <div
                className="group relative cursor-default"
                onMouseEnter={() => {
                  setIsModalOpen(true)
                  setHoveredCategory('prompt')
                }}
                onMouseLeave={() => {
                  setIsModalOpen(false)
                  setHoveredCategory(null)
                }}
                onClick={handlePromptClick}
              >
                <div className="flex items-center gap-1 px-2 py-2">
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
                </div>
                <div
                  className={`absolute top-full left-0 z-50 ml-2 w-48 rounded-lg border border-gray-200 bg-white p-2 shadow-lg transition-all duration-300 ${
                    isModalOpen ? 'block' : 'hidden'
                  }`}
                >
                  <Link
                    href="/position"
                    className="flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setIsModalOpen(false)
                      handleNavigationClick(
                        '채용 공고 분석 프롬프트',
                        '/position'
                      )
                    }}
                  >
                    채용 공고 분석 프롬프트
                  </Link>
                  <Link
                    href="/company"
                    className="flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setIsModalOpen(false)
                      handleNavigationClick('기업 분석 프롬프트', '/company')
                    }}
                  >
                    기업 분석 프롬프트
                  </Link>
                </div>
              </div>
              <Link
                href="/guide"
                className="flex items-center gap-1 px-2 py-2"
                onMouseEnter={() => setHoveredCategory('guide')}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => handleNavigationClick('적용 가이드', '/guide')}
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
              <Link
                href="/inquiry"
                onMouseEnter={() => setHoveredCategory('inquiry')}
                onMouseLeave={() => setHoveredCategory(null)}
                className="flex"
                onClick={() => handleNavigationClick('문의하기', '/inquiry')}
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

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              className="cursor-pointer sm:hidden"
              onClick={() => {
                if (isSidebarOpen) {
                  setIsSidebarOpen(false)
                } else {
                  setIsSidebarOpen(true)
                }
              }}
              aria-label="Toggle menu"
            >
              <HamburgerIcon className="h-6 w-6" />
            </button>

            {/* Desktop Auth UI */}
            <div className="hidden sm:block">{renderAuthUI()}</div>
          </div>
        </div>
      </nav>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  )
}

export default Navbar
