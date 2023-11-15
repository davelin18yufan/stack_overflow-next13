import Link from "next/link"
import Image from "next/image"
import React from "react"
import { Job } from "@/types"
import { formatISODate, getTimestamp } from "@/lib/utils"

interface JobLocationProps {
  job_country?: string
  source?: string
}

const JobLocation = ({ job_country, source }: JobLocationProps) => {
  return (
    <div className="background-light800_dark400 flex items-center justify-end gap-2 rounded-2xl px-3 py-1.5">
      {job_country && (
        <Image
          src={`https://flagsapi.com/US/flat/64.png`}
          alt="country symbol"
          width={16}
          height={16}
          className="rounded-full"
        />
      )}

      <p className="body-medium text-dark400_light700">{job_country}</p>
      {source && (
        <>
          <div>
            <Image
              src="/assets/icons/link.svg"
              width={12}
              height={12}
              alt="link"
              className="invert-colors"
            />
          </div>
          <p className="body-medium text-dark400_light700">{source}</p>
        </>
      )}
    </div>
  )
}

const JobCard = ({ job }: { job: Job }) => {
  const {
    title,
    application_url,
    company_name,
    plain_text_description,
    source,
    location,
    salary,
    publication_time,
  } = job

  return (
    <section className="background-light900_dark200 light-border shadow-light100_darknone flex flex-col items-start gap-6 rounded-lg border p-6 sm:flex-row sm:p-8">
      <div className="flex gap-3 w-full justify-end sm:hidden">
        <JobLocation job_country={location} />
        <JobLocation source={source} />
      </div>

      <div className="flex items-center gap-6">
        <Image
          src="/assets/icons/suitcase.svg"
          alt="suitcase"
          width={60}
          height={60}
          className="invert-colors rounded-[10px]"
        />
      </div>

      <div className="w-full">
        <div className="flex-between flex-wrap gap-2">
          <p className="base-semibold text-dark200_light900">{title}</p>
          <p className="paragraph-semibold text-dark200_light900">
            {company_name}
          </p>

          <div className="hidden gap-5 sm:flex">
            <JobLocation job_country={location} />
            <JobLocation source={source} />
          </div>
        </div>

        <p className="body-regular text-dark500_light700  mt-2 line-clamp-2">
          {plain_text_description?.slice(0, 200)}
        </p>

        <div className="flex-between mt-8 flex-wrap gap-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/clock-2.svg"
                alt="clock"
                width={20}
                height={20}
              />

              <p className="body-medium text-light-500">
                {formatISODate(publication_time)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/currency-dollar-circle.svg"
                alt="dollar symbol"
                width={20}
                height={20}
              />

              {salary?.min_salary ? (
                <>
                  <p className="body-medium text-light-500">
                    <span>{salary?.currency}</span>
                    {salary?.min_salary} ~ {salary?.max_salary}
                  </p>
                  <p className="small-medium text-light-500">
                    {" "}
                    {salary?.salary_type}
                  </p>
                </>
              ) : (
                <p className="body-medium text-light-500">Not disclosed</p>
              )}
            </div>
          </div>

          <Link
            href={application_url ?? "/jobs"}
            target="_blank"
            className="flex items-center gap-2"
          >
            <p className="body-semibold primary-text-gradient">View job</p>

            <Image
              src="/assets/icons/arrow-up-right.svg"
              alt="arrow up right"
              width={20}
              height={20}
            />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default JobCard
