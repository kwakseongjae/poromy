'use client'

import { useCustomEmblaCarousel } from '@/hooks/useEmblaCarousel'
import { companies } from '@/constants/company.data'
import type { Company } from '@/types/company'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronIcon } from '@/assets'
import { encrypt } from '@/utils/crypto'

// Navigation button component
const NavigationButton = ({
  direction,
  onClick,
  disabled,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
  disabled: boolean
}) => {
  const rotation = direction === 'prev' ? 'rotate-270' : 'rotate-90'
  const label = direction === 'prev' ? 'Previous slide' : 'Next slide'

  return (
    <button
      onClick={onClick}
      className="bg-background cursor-pointer rounded-sm p-2 shadow-sm transition-colors hover:bg-gray-100 disabled:opacity-50"
      aria-label={label}
      disabled={disabled}
    >
      <ChevronIcon className={rotation} fill="#808080" />
    </button>
  )
}

// Individual card component
const CompanyCard = ({ company }: { company: Company }) => {
  const encryptedId = encrypt(company.id)

  return (
    <article>
      <Link
        href={`/company/${encryptedId}`}
        className="block"
        aria-label={`Learn more about ${company.name}`}
      >
        <div
          className={`${company.color} ${company.borderColor} relative flex h-64 flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-lg transition-transform hover:scale-[1.02]`}
        >
          {/* Logo and Text content */}
          <div className="pt-8">
            <h3
              className={`${company.textColor} mb-4 text-2xl font-bold md:text-3xl`}
            >
              {company.logoUrl ? (
                <Image
                  src={company.logoUrl}
                  alt={`${company.name} logo`}
                  width={120}
                  height={40}
                  className="h-7 w-auto object-contain md:h-8 lg:h-10"
                  priority
                />
              ) : (
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
                  {company.name}
                </span>
              )}
            </h3>
            <p
              className={`${company.textColor} ml-1 line-clamp-3 whitespace-pre-line opacity-80 lg:line-clamp-4`}
            >
              {company.thumbnailDescription}
            </p>
          </div>

          {/* Button */}
          <div className="mt-auto">
            <button
              className={`${company.buttonColor} cursor-pointer rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-colors sm:px-5 sm:py-2.5 md:text-base`}
            >
              자세히 보기
            </button>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default function CompanyCarousel() {
  const { emblaRef, scrollPrev, scrollNext, prevBtnDisabled, nextBtnDisabled } =
    useCustomEmblaCarousel()

  return (
    <section className="w-full" aria-label="Featured Companies">
      {/* Navigation controls */}
      <nav
        className="mb-6 flex items-center justify-end"
        aria-label="Carousel navigation"
      >
        <div className="flex space-x-2">
          <NavigationButton
            direction="prev"
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
          />
          <NavigationButton
            direction="next"
            onClick={scrollNext}
            disabled={nextBtnDisabled}
          />
        </div>
      </nav>

      {/* Carousel container */}
      <div className="relative overflow-y-visible">
        <div
          className="overflow-x-clip"
          ref={emblaRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured companies carousel"
        >
          <div className="flex touch-pan-y">
            {companies.map((company) => (
              <div
                key={company.id}
                className="relative mr-6 min-w-0 flex-[0_0_50%] lg:flex-[0_0_33.33%]"
                role="group"
                aria-roledescription="slide"
                aria-label={`${company.name} slide`}
              >
                <CompanyCard company={company} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
