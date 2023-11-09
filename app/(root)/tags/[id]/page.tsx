import React from "react"
import LocalSearchbar from "@/components/shared/search/LocalSearchbar"
import NoResult from "@/components/shared/NoResult"
import QuestionCard from "@/components/cards/QuestionCard"
import { getQuestionByTagId } from "@/lib/actions/tag.action"
import { URLProps } from "@/types"
import Paginator from "@/components/shared/Paginator"

const Page = async ({ params, searchParams }: URLProps) => {
  const result = await getQuestionByTagId({
    tagId: params.id,
    page: searchParams.page ? +searchParams.page : 1,
    searchQuery: searchParams.q,
  })

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>

      <div className="mt-11 w-full">
        <LocalSearchbar
          route={`/tags/${params.id}`}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search Tag Questions..."
          otherClasses="flex-1" // make sure searchbar width expanded and take place over filter
        />
      </div>

      <div className="custom-scrollbar mt-10 flex w-full flex-col gap-6 overflow-y-auto">
        {/* looping through questions */}
        {result.questions.length > 0 ? (
          result.questions.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upVotes={question.upVotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no tag question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
        discussion. our query could be the next big thing others learn from. Get
        involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>

      <div className="mt-10">
        <Paginator
          pageNumber={searchParams.page ? +searchParams.page : 1}
          hasNextPage={result.hasNextPage}
        />
      </div>
    </>
  )
}

export default Page
