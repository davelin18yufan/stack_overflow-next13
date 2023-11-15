import React from "react"
import {
  fetchCountries,
  fetchJobs,
  fetchLocation,
} from "@/lib/actions/jobs.action"
import JobFilter from "@/components/jobs/JobFilter"
import Paginator from "@/components/shared/Paginator"
import { Job, URLProps } from "@/types"
import JobCard from "@/components/cards/JobCard"

const Page = async ({ searchParams }: URLProps) => {
  const countries = await fetchCountries()
  const userLocation = await fetchLocation()

  const jobs = await fetchJobs({
    query: searchParams.q || "",
    page: searchParams?.page ? searchParams.page : "1",
    location: searchParams?.location || userLocation,
  })
  
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>

      <div className="flex">
        <JobFilter countriesList={countries} />
      </div>

      <section className="light-border mb-9 mt-11 flex flex-col gap-9 border-b pb-9">
        {jobs?.length > 0 ? (
          jobs.map((job: Job) => {
            if (job.title && job.title.toLowerCase() !== "undefined")
              return <JobCard key={job.id} job={job} />

            return null
          })
        ) : (
          <div className="paragraph-regular text-dark200_light800 w-full text-center">
            Oops! We couldn&apos;t find any jobs at the moment. Please try again
            later
          </div>
        )}
      </section>

      {jobs?.length > 0 && (
        <Paginator
          pageNumber={searchParams.page ? +searchParams.page : 1}
          hasNextPage={jobs.length === 10}
        />
      )}
    </>
  )
}

export default Page
