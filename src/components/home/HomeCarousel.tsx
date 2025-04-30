'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Fade from 'embla-carousel-fade'
import {
  ChevronIcon,
  HomeCarouselImage1,
  HomeCarouselImage2,
  HomeCarouselImage3,
} from '@/assets'
import Image from 'next/image'

const SLIDE_COUNT = 3
const SLIDE_INTERVAL = 5000

const slides = [
  {
    image: HomeCarouselImage1,
    alt: 'Job posting analysis request',
    title: '채용공고 분석 요청',
    description:
      '단 30초만 투자하면\n맞춤 채용공고 프롬프트를 받아볼 수 있습니다.',
    backgroundColor: 'bg-[#8590E9]',
    textColor: 'text-black',
  },
  {
    image: HomeCarouselImage2,
    alt: 'Job posting and company prompt',
    title: '채용공고 & 기업 프롬프트',
    description:
      'AI 프롬프트를 활용하여\n채용공고와 기업 정보를 효율적으로 분석하세요.',
    backgroundColor: 'bg-[#171A33]',
    textColor: 'text-white',
  },
  {
    image: HomeCarouselImage3,
    alt: 'Prompt guide',
    title: '프롬프트 적용 가이드',
    description:
      '프롬프트 적용 방법과\nAI 활용 팁을 제공하는 가이드를 확인하세요.',
    backgroundColor: 'bg-[#121212]',
    textColor: 'text-white',
  },
]

export default function HomeCarousel() {
  const [desktopEmblaRef, desktopEmblaApi] = useEmblaCarousel({ loop: true }, [
    Fade(),
  ])
  const [mobileEmblaRef, mobileEmblaApi] = useEmblaCarousel({ loop: true }, [
    Fade(),
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)

  const resetAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current)
    }
    autoplayTimerRef.current = setInterval(() => {
      if (desktopEmblaApi) desktopEmblaApi.scrollNext()
      if (mobileEmblaApi) mobileEmblaApi.scrollNext()
    }, SLIDE_INTERVAL)
  }, [desktopEmblaApi, mobileEmblaApi])

  const scrollPrev = useCallback(() => {
    if (desktopEmblaApi) desktopEmblaApi.scrollPrev()
    if (mobileEmblaApi) mobileEmblaApi.scrollPrev()
    resetAutoplay()
  }, [desktopEmblaApi, mobileEmblaApi, resetAutoplay])

  const scrollNext = useCallback(() => {
    if (desktopEmblaApi) desktopEmblaApi.scrollNext()
    if (mobileEmblaApi) mobileEmblaApi.scrollNext()
    resetAutoplay()
  }, [desktopEmblaApi, mobileEmblaApi, resetAutoplay])

  const onSelect = useCallback(() => {
    if (desktopEmblaApi) {
      setSelectedIndex(desktopEmblaApi.selectedScrollSnap())
    } else if (mobileEmblaApi) {
      setSelectedIndex(mobileEmblaApi.selectedScrollSnap())
    }
  }, [desktopEmblaApi, mobileEmblaApi])

  useEffect(() => {
    if (!desktopEmblaApi && !mobileEmblaApi) return

    onSelect()
    desktopEmblaApi?.on('select', onSelect)
    mobileEmblaApi?.on('select', onSelect)
    resetAutoplay()

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current)
      }
      desktopEmblaApi?.off('select', onSelect)
      mobileEmblaApi?.off('select', onSelect)
    }
  }, [desktopEmblaApi, mobileEmblaApi, onSelect, resetAutoplay])

  return (
    <div
      className={`relative w-full cursor-pointer overflow-hidden transition-colors duration-500 ${slides[selectedIndex].backgroundColor} ${slides[selectedIndex].textColor}`}
    >
      {/* Desktop Layout */}
      <div className="hidden h-[400px] md:block">
        {/* Image Container */}
        <div
          className="absolute top-1/2 right-40 aspect-square h-[300px] -translate-y-1/2 overflow-hidden md:right-32 lg:right-40"
          ref={desktopEmblaRef}
        >
          <div className="flex h-full">
            {slides.map((slide, index) => (
              <div key={index} className="relative min-w-0 flex-[0_0_100%]">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  width={1000}
                  height={1000}
                  className="aspect-square h-full object-cover"
                  priority
                />
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="absolute top-1/2 left-40 flex w-1/3 -translate-y-1/2 flex-col gap-8 md:left-32 lg:left-40">
          <div className="h-[100px]">
            <h2
              key={`title-${selectedIndex}`}
              className="animate-fade-in mb-3 overflow-hidden text-3xl font-bold whitespace-nowrap"
            >
              {slides[selectedIndex].title}
            </h2>
            <p
              key={`desc-${selectedIndex}`}
              className="animate-fade-in-delayed text-lg font-semibold whitespace-pre-line"
            >
              {slides[selectedIndex].description}
            </p>
          </div>

          <div className="flex w-fit items-center justify-center gap-2 rounded-full bg-[#262624] px-4 py-2 text-white">
            <button
              onClick={scrollPrev}
              className="cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronIcon className="h-4 w-4 rotate-270" fill="#fff" />
            </button>

            <div className="text-sm">
              <span className="inline-block w-3 text-center">
                {selectedIndex + 1}
              </span>
              <span className="text-text-disabled text-semibold mx-1">/</span>
              <span className="inline-block w-3 text-center">
                {SLIDE_COUNT}
              </span>
            </div>

            <button
              onClick={scrollNext}
              className="cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronIcon className="h-4 w-4 rotate-90" fill="#fff" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col md:hidden">
        {/* Image Container */}
        <div className="relative w-full overflow-hidden" ref={mobileEmblaRef}>
          <div className="flex">
            {slides.map((slide, index) => (
              <div key={index} className="relative min-w-0 flex-[0_0_100%]">
                <div className="relative mx-auto aspect-square w-3/7">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    width={1000}
                    height={1000}
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-start justify-center gap-4 px-8 py-6">
          <div className="h-[80px]">
            <h2
              key={`title-${selectedIndex}`}
              className="animate-fade-in mb-1 text-2xl font-bold"
            >
              {slides[selectedIndex].title}
            </h2>
            <p
              key={`desc-${selectedIndex}`}
              className="animate-fade-in-delayed text-base font-semibold whitespace-pre-line"
            >
              {slides[selectedIndex].description}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 rounded-full bg-[#262624] px-4 py-2 text-white">
            <button
              onClick={scrollPrev}
              className="cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronIcon className="h-4 w-4 rotate-270" fill="#fff" />
            </button>

            <div className="text-sm">
              <span className="inline-block w-3 text-center">
                {selectedIndex + 1}
              </span>
              <span className="text-text-disabled text-semibold mx-1">/</span>
              <span className="inline-block w-3 text-center">
                {SLIDE_COUNT}
              </span>
            </div>

            <button
              onClick={scrollNext}
              className="cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronIcon className="h-4 w-4 rotate-90" fill="#fff" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
