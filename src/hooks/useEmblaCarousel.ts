import { useState, useCallback, useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'

// Default carousel options
const DEFAULT_OPTIONS = {
  loop: true,
  align: 'start',
  slidesToScroll: 1,
} as const

type UseEmblaCarouselOptions = {
  options?: typeof DEFAULT_OPTIONS
}

type UseEmblaCarouselReturn = {
  emblaRef: (node: HTMLElement | null) => void
  scrollPrev: () => void
  scrollNext: () => void
  prevBtnDisabled: boolean
  nextBtnDisabled: boolean
  selectedIndex: number
}

/**
 * Custom hook for Embla Carousel
 * Encapsulates all carousel logic and state management
 */
export function useCustomEmblaCarousel({
  options = DEFAULT_OPTIONS,
}: UseEmblaCarouselOptions = {}): UseEmblaCarouselReturn {
  // Initialize Embla carousel
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  // State management
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Navigation handlers
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  // Slide selection event handler
  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [emblaApi])

  // Event listener setup
  useEffect(() => {
    if (!emblaApi) return

    // Set initial state
    onSelect()

    // Register event listeners
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)

    // Cleanup function
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  return {
    emblaRef,
    scrollPrev,
    scrollNext,
    prevBtnDisabled,
    nextBtnDisabled,
    selectedIndex,
  }
}
