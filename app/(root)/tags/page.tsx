import { TagFilters } from "@/constants/filters"
import LocalSearchbar from "@/components/shared/search/LocalSearchbar"
import Filter from "@/components/shared/Filter"
import React from "react"
import { getAllTags } from "@/lib/actions/tag.action"
import NoResult from "@/components/shared/NoResult"
import Link from "next/link"
import { SearchParamsProps } from "@/types"

const Page = async ({ searchParams }: SearchParamsProps) => {
  const result = await getAllTags({ searchQuery: searchParams.q })

  return (
    <>
      <h1 className="h1-bold text-dark100-light900">All Tags</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search by tag name..."
          route="/tags"
          otherClasses="flex-1"
        />

        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px] "
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {result.tags.length > 0 ? (
          result.tags.map((tag) => (
            <Link
              href={`/tags/${tag._id}`}
              className="shadow-light100_darknone"
              key={tag._id}
            >
              <article className="background-light900-dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
                <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
                  <p className="paragraph-semibold text-dark300_light900">
                    {tag.name}
                  </p>
                </div>

                {/* <p className="text-dark500_light700 small-regular">
                  {tag.description}
                </p> */}

                <p className="text-dark400_light500 small-medium mt-3.5">
                  <span className="primary-text-gradient body-semibold mr-2.5">
                    {tag.questions.length}+
                  </span>
                  Questions
                </p>
              </article>
            </Link>
          ))
        ) : (
          <NoResult
            title="Mo Tags Found"
            description="it looks like there are no tags found."
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </section>
    </>
  )
}

export default Page
