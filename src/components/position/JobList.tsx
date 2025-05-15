import { sortedJobs as jobs } from '@/constants/job.data'
import Link from 'next/link'
import Image from 'next/image'
import { encrypt } from '@/utils/crypto'
import { getProxyImageUrl } from '@/utils/image'

export default function JobList() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
      {jobs.map((job) => {
        // Encrypt the ID for use in the URL
        const encryptedId = encrypt(job.id)

        return (
          <article
            key={job.id}
            className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md lg:overflow-hidden"
          >
            <Link
              href={`/position?id=${encryptedId}`}
              className="flex h-full flex-col"
              aria-label={`${job.companyName} ${job.jobTitle} 상세 정보 보기`}
            >
              {/* Mobile/Tablet Layout (below lg) */}
              <div className="lg:hidden">
                <div className="flex h-30 w-full items-center justify-center overflow-hidden pt-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-lg">
                    <Image
                      src={getProxyImageUrl(job.logoUrl)}
                      alt={`${job.companyName} 로고`}
                      fill
                      className="object-contain transition-transform group-hover:scale-110"
                      sizes="(max-width: 768px) 96px, (max-width: 1024px) 128px, 160px"
                    />
                  </div>
                </div>
                <div className="flex flex-col p-4">
                  <h2 className="group-hover:text-text-secondary mb-1 line-clamp-2 text-lg font-semibold text-gray-900">
                    {job.jobTitle}
                  </h2>
                  <p className="mb-3 text-sm text-gray-500">
                    {job.companyName}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {job.conditions.map((condition, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop Layout (lg and above) */}
              <div className="hidden lg:flex lg:h-36 lg:flex-col lg:justify-between lg:overflow-hidden lg:p-4">
                <div className="mb-4 flex items-start">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                    <Image
                      src={getProxyImageUrl(job.logoUrl)}
                      alt={`${job.companyName} 로고`}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="ml-4 min-w-0 flex-1 overflow-hidden">
                    <h2 className="group-hover:text-text-secondary line-clamp-2 text-lg font-semibold text-gray-900">
                      {job.jobTitle}
                    </h2>
                    <p className="text-sm text-gray-500">{job.companyName}</p>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {job.conditions.map((condition, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </article>
        )
      })}
    </div>
  )
}
