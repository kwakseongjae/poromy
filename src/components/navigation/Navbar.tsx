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
  CloseIcon,
} from '@/assets'
import { useEffect, useState } from 'react'
import { useSupabase } from '@/contexts/SupabaseContext'
import Image from 'next/image'
import ProfileModal from '@/components/modal/ProfileModal'
import Sidebar from './Sidebar'

// gtag 함수를 동적으로 임포트
const trackNavigationClick = async (linkName: string, linkUrl: string) => {
  const { trackNavigationClick: track } = await import('@/lib/gtag')
  track(linkName, linkUrl)
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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
              unoptimized
            />
          </button>
        </div>
      )
    }

    return (
      <Link
        href="/login"
        className="rounded-[5px] bg-[#3182F6]/14 px-[16px] py-[10px] text-[14px] font-semibold text-[#3182F6]"
        aria-label="로그인"
        tabIndex={0}
        onClick={() => {
          handleNavigationClick('로그인/회원가입', '/login')
          setIsSidebarOpen(false)
        }}
      >
        로그인
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
        <div className="mx-auto flex h-[60px] items-center justify-between py-[10px] pr-[8px] pl-[16px] sm:px-[20px] lg:px-[30px]">
          {/* Left Side */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                onClick={() => handleNavigationClick('Logo', '/')}
                aria-label="Poromy 홈페이지로 이동"
              >
                <LogoIcon className="h-[22px] w-[84px]" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex sm:items-center">
              <div
                className="px-2 py-2"
                onMouseEnter={() => {
                  setIsModalOpen(true)
                  setHoveredCategory('prompt')
                }}
                onMouseLeave={() => {
                  setIsModalOpen(false)
                  setHoveredCategory(null)
                }}
              >
                <div className="group relative cursor-default">
                  <div className="flex items-center gap-[8px] px-[8px] py-[12px]">
                    {hoveredCategory && hoveredCategory !== 'prompt' ? (
                      <DisabledHamburgerIcon className="h-[18pxpx] w-[18pxpx]" />
                    ) : (
                      <HamburgerIcon className="h-[18pxpx] w-[18pxpx]" />
                    )}
                    <span
                      className={`text-[14px] font-semibold select-none ${
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
              </div>
              <div
                className="px-2 py-2"
                onMouseEnter={() => setHoveredCategory('guide')}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link
                  href="/guide"
                  className="flex items-center gap-[8px] px-[8px] py-[12px]"
                  onClick={() => handleNavigationClick('적용 가이드', '/guide')}
                >
                  {hoveredCategory && hoveredCategory !== 'guide' ? (
                    <DisabledBulbIcon className="h-[18px] w-[18px]" />
                  ) : (
                    <BulbIcon className="h-[18px] w-[18px]" />
                  )}
                  <span
                    className={`text-[14px] font-semibold ${
                      hoveredCategory && hoveredCategory !== 'guide'
                        ? 'text-text-disabled'
                        : ''
                    }`}
                  >
                    적용 가이드
                  </span>
                </Link>
              </div>
              <div
                className="px-2 py-2"
                onMouseEnter={() => setHoveredCategory('inquiry')}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link
                  href="/inquiry"
                  className="flex"
                  onClick={() => handleNavigationClick('문의하기', '/inquiry')}
                >
                  <Image
                    src={InquiryTextImage}
                    alt="문의하기"
                    width={378}
                    height={43}
                    className="h-[16px]"
                    style={{ width: 'auto' }}
                  />
                  <span className="text-600 ml-0.5 text-xs leading-none font-semibold">
                    Free
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-[8px]">
            <div>{renderAuthUI()}</div>
            {/* Mobile Menu Button */}
            <button
              className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center sm:hidden"
              onClick={() => {
                if (isSidebarOpen) {
                  setIsSidebarOpen(false)
                } else {
                  setIsSidebarOpen(true)
                }
              }}
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? (
                <CloseIcon className="h-[24px] w-[24px]" />
              ) : (
                <HamburgerIcon className="h-[24px] w-[24px]" />
              )}
            </button>
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
