'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Inquiry } from '@/types/inquiry'
import { HomeInquiryCard } from './HomeInquiryCard'
import { ChevronIcon } from '@/assets'
import useEmblaCarousel from 'embla-carousel-react'

interface InquiryCarouselProps {
  inquiries: Inquiry[]
  isLoading?: boolean
}

export const InquiryCarousel = ({
  inquiries,
  isLoading = false,
}: InquiryCarouselProps) => {
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Embla Carousel for page scroll (one page = itemsPerPage cards)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: false,
    slidesToScroll: 1,
  })

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(2)
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(3)
      } else {
        setItemsPerPage(5)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 페이지 수 계산
  const totalPages = Math.ceil((inquiries.length + 1) / itemsPerPage) // +1 for 더보기

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setCurrentIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  const handlePrev = () => {
    if (isTransitioning || currentIndex === 0) return
    setIsTransitioning(true)
    emblaApi && emblaApi.scrollPrev()
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const handleNext = () => {
    if (isTransitioning || !emblaApi || currentIndex >= totalPages - 1) return
    setIsTransitioning(true)
    emblaApi.scrollNext()
    setTimeout(() => setIsTransitioning(false), 300)
  }

  // 한 페이지에 들어갈 카드 묶음 반환
  const getPageCards = (pageIdx: number) => {
    const start = pageIdx * itemsPerPage
    const end = start + itemsPerPage
    return inquiries.slice(start, end)
  }

  // Skeleton slides (페이지 단위)
  const renderSkeletonSlides = () =>
    Array.from({ length: 1 }).map((_, index) => (
      <div
        key={index}
        className="w-full shrink-0 px-1"
        role="group"
        aria-roledescription="slide"
        aria-label={`Skeleton page ${index + 1}`}
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: itemsPerPage }).map((_, idx) => (
            <div
              key={idx}
              className="group block h-full overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-md"
            >
              <div className="relative aspect-video w-full overflow-hidden">
                <div className="absolute inset-0 h-full w-full animate-pulse bg-gray-200" />
              </div>
              <div className="p-4">
                <div className="mb-2 h-14">
                  <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
                  <div className="mt-2 h-6 w-1/2 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))

  // 페이지 슬라이드 렌더링
  const renderSlides = () =>
    Array.from({ length: totalPages }).map((_, pageIdx) => {
      const cards = getPageCards(pageIdx)
      const isLastPage = pageIdx === totalPages - 1
      return (
        <div
          key={pageIdx}
          className="w-full shrink-0 px-1"
          role="group"
          aria-roledescription="slide"
          aria-label={`Page ${pageIdx + 1}`}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {cards.map((inquiry) => (
              <HomeInquiryCard key={inquiry.id} inquiry={inquiry} />
            ))}
            {/* 마지막 페이지에 더보기 카드 추가 */}
            {isLastPage && !isLoading && (
              <Link
                key="more"
                href="/inquiry"
                className="flex h-full min-h-[200px] w-full items-center justify-center rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50 sm:min-h-[160px] lg:min-h-[200px]"
                tabIndex={0}
                aria-label="더보기"
              >
                <span className="text-text-secondary font-medium">더보기</span>
              </Link>
            )}
          </div>
        </div>
      )
    })

  return (
    <div className="relative">
      <div className="relative sm:mt-2">
        <div className="flex items-center gap-4">
          <div className="relative w-full overflow-hidden">
            <div
              ref={emblaRef}
              className="overflow-x-clip"
              role="region"
              aria-roledescription="carousel"
              aria-label="문의 캐러셀"
            >
              <div className="flex">
                {isLoading ? renderSkeletonSlides() : renderSlides()}
              </div>
            </div>
          </div>
        </div>
        {!isLoading && (
          <>
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0 || isTransitioning}
              className="bg-background absolute top-1/2 -left-4 -translate-y-1/2 cursor-pointer rounded-full border border-gray-200 p-2 opacity-60 shadow-md transition-opacity duration-200 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40 sm:-left-6"
              aria-label="이전"
            >
              <ChevronIcon className="h-5 w-5 rotate-270" fill="#808080" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= totalPages - 1 || isTransitioning}
              className="bg-background absolute top-1/2 -right-4 -translate-y-1/2 cursor-pointer rounded-full border border-gray-200 p-2 opacity-60 shadow-md transition-opacity duration-200 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40 sm:-right-6"
              aria-label="다음"
            >
              <ChevronIcon className="h-5 w-5 rotate-90" fill="#808080" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
