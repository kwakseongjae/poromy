'use client'

import Image from 'next/image'
import Link from 'next/link'
import { LogoIcon, ProfileImage } from '@/assets'
import { useEffect, useState } from 'react'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 bg-white transition-all duration-200 ${isScrolled ? 'border-b border-gray-200' : ''}`}
    >
      <div className="mx-auto flex justify-between px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4">
        <div className="flex items-center">
          <Link href="/">
            <LogoIcon className="w-25 sm:w-28 lg:w-32" />
          </Link>
        </div>
        <div className="flex items-center">
          <Image
            src={ProfileImage}
            alt="Profile"
            className="aspect-square w-8 rounded-full object-cover sm:w-9 lg:w-10"
          />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
