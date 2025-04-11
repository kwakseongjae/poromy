import { jobs } from '@/constants/job.data'
import Link from 'next/link'
import Image from 'next/image'
import { encrypt } from '@/utils/crypto'

export default function JobList() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => {
        // Encrypt the ID for use in the URL
        const encryptedId = encrypt(job.id)

        return (
          <article
            key={job.id}
            className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
          >
            <Link
              href={`/position/${encryptedId}`}
              className="flex h-full flex-col"
              aria-label={`${job.companyName} ${job.jobTitle} 상세 정보 보기`}
            >
              <div className="mb-4 flex items-center">
                <div className="relative h-14 w-14 overflow-hidden rounded-sm">
                  <Image
                    src={job.logoUrl}
                    alt={`${job.companyName} 로고`}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="ml-4">
                  <h2 className="group-hover:text-text-secondary text-lg font-semibold text-gray-900">
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
            </Link>
          </article>
        )
      })}
    </div>
  )
}
