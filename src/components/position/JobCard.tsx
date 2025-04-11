// components/JobCard.jsx
import Image from 'next/image'
import Link from 'next/link'

interface JobCardProps {
  id: string
  companyName: string
  jobTitle: string
  conditions: string[]
  logoUrl: string
}

const JobCard = ({
  id,
  companyName,
  jobTitle,
  conditions,
  logoUrl,
}: JobCardProps) => {
  return (
    <Link href={`/job/${id}`} className="block">
      <div className="border-light-gray overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
        <div className="flex">
          {/* Left company logo area */}
          <div className="p-4">
            <Image
              src={logoUrl}
              alt={`${companyName} 로고`}
              width={100}
              height={100}
              className="aspect-square h-full"
            />
          </div>

          {/* Right text area */}
          <div className="flex flex-col justify-center px-2 py-4">
            {/* Job title area */}
            <div>
              <h3 className="text-text-primary text-lg font-bold">
                {companyName}
              </h3>
              <p className="text-text-disabled">{jobTitle}</p>
            </div>

            {/* Job conditions area */}
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {conditions.map((condition, index) => (
                  <span
                    key={index}
                    className="bg-secondary text-text-primary inline-block rounded-full px-2 py-1 text-xs font-medium"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default JobCard
