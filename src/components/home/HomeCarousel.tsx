'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Fade from 'embla-carousel-fade'
import { ChevronIcon } from '@/assets'
import Image from 'next/image'

const SLIDE_COUNT = 3
const SLIDE_INTERVAL = 5000

const slides = [
  {
    image:
      'https://images.unsplash.com/photo-1742943892619-501567da0c62?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Beautiful landscape 1',
    title: 'Mountain Landscape',
    description:
      'Discover the breathtaking views of majestic mountains and serene valleys.',
    backgroundColor: 'bg-[#6395ee]',
    textColor: 'text-black',
  },
  {
    image:
      'https://images.unsplash.com/photo-1719906002002-a546cb5d9551?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    alt: 'Beautiful landscape 2',
    title: 'Ocean Sunset',
    description:
      'Experience the magical moments of sunset over the calm ocean waters.',
    backgroundColor: 'bg-[#a2574f]',
    textColor: 'text-white',
  },
  {
    image: 'https://images.unsplash.com/photo-1682687220199-d0124f48f95b',
    alt: 'Beautiful landscape 3',
    title: 'Forest Path',
    description:
      'Walk through the peaceful forest paths surrounded by ancient trees.',
    backgroundColor: 'bg-[#101113]',
    textColor: 'text-white',
  },
]

export default function HomeCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Fade()])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)

  const resetAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current)
    }
    autoplayTimerRef.current = setInterval(() => {
      if (emblaApi) emblaApi.scrollNext()
    }, SLIDE_INTERVAL)
  }, [emblaApi])

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev()
      resetAutoplay()
    }
  }, [emblaApi, resetAutoplay])

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext()
      resetAutoplay()
    }
  }, [emblaApi, resetAutoplay])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    onSelect()
    emblaApi.on('select', onSelect)
    resetAutoplay()

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current)
      }
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect, resetAutoplay])

  return (
    <div
      className={`relative h-96 w-full cursor-pointer overflow-hidden transition-colors duration-500 ${slides[selectedIndex].backgroundColor} ${slides[selectedIndex].textColor}`}
    >
      <div
        className="absolute top-1/2 right-32 aspect-video w-2/5 -translate-y-1/2 overflow-hidden"
        ref={emblaRef}
      >
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div key={index} className="relative min-w-0 flex-[0_0_100%]">
              <Image
                src={slide.image}
                alt={slide.alt}
                width={1000}
                height={1000}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="absolute top-1/2 left-32 flex w-1/3 -translate-y-1/2 flex-col gap-8">
        {/* Carousel Information */}
        <div className="rounded-lg">
          <h2
            key={`title-${selectedIndex}`}
            className="animate-fade-in text-lg font-bold"
          >
            {slides[selectedIndex].title}
          </h2>
          <p
            key={`desc-${selectedIndex}`}
            className="animate-fade-in-delayed text-sm"
          >
            {slides[selectedIndex].description}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="bg-800 flex w-fit items-center justify-center gap-2 rounded-full px-4 py-2 text-white">
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
            <span className="inline-block w-3 text-center">{SLIDE_COUNT}</span>
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
  )
}
