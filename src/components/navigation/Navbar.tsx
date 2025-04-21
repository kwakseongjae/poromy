'use client'

import Link from 'next/link'
import {
  LogoIcon,
  HamburgerIcon,
  BulbIcon,
  DisabledBulbIcon,
  DisabledHamburgerIcon,
} from '@/assets'
import { useEffect, useState } from 'react'
import { useCursor } from '@/contexts/CursorContext'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const { incrementClickCount } = useCursor()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handlePromptClick = () => {
    incrementClickCount()
  }

  return (
    <nav
      className={`sticky top-0 z-9999 bg-white transition-all duration-200 ${
        isScrolled ? 'border-b border-gray-200' : ''
      }`}
    >
      <div className="mx-auto flex justify-between px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4">
        {/* Left Side */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <LogoIcon className="w-25 sm:w-28 lg:w-32" />
            </Link>
          </div>
          {/* Category */}
          <div className="flex items-center gap-4">
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
                  className={`font-semibold select-none ${hoveredCategory && hoveredCategory !== 'prompt' ? 'text-text-disabled' : ''}`}
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
                  onClick={() => setIsModalOpen(false)}
                >
                  채용 공고 분석 프롬프트
                </Link>
                <Link
                  href="/company"
                  className="flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsModalOpen(false)}
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
            >
              {hoveredCategory && hoveredCategory !== 'guide' ? (
                <DisabledBulbIcon className="h-5 w-5" />
              ) : (
                <BulbIcon className="h-5 w-5" />
              )}
              <span
                className={`font-semibold ${hoveredCategory && hoveredCategory !== 'guide' ? 'text-text-disabled' : ''}`}
              >
                적용 가이드
              </span>
            </Link>
            <Link
              href="/inquiry"
              className="flex items-center gap-1 px-2 py-2"
              onMouseEnter={() => setHoveredCategory('inquiry')}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <span
                className={`font-semibold ${hoveredCategory && hoveredCategory !== 'inquiry' ? 'text-text-disabled' : ''}`}
              >
                분석 요청
              </span>
            </Link>
          </div>
        </div>

        {/* Right Side */}
        {/* Sign In Button */}
        <div className="flex items-center">
          <button className="text-500 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-bold hover:bg-gray-100">
            회원가입/로그인
          </button>
        </div>
        {/* <div className="flex items-center">
          <Image
            src={ProfileImage}
            alt="Profile"
            className="aspect-square w-8 rounded-full object-cover sm:w-9 lg:w-10"
          />
        </div> */}
      </div>
    </nav>
  )
}

export default Navbar
