import LocalSearchbar from "@/components/shared/search/LocalSearchbar"
import Filter from "@/components/shared/Filter"
import { QuestionFilters } from "@/constants/filters"
import QuestionCard from "@/components/cards/QuestionCard"
import NoResult from "@/components/shared/NoResult"
import { getSavedQuestions } from "@/lib/actions/question.action"
import { auth } from "@clerk/nextjs"
import { SearchParamsProps } from "@/types"
import Paginator from "@/components/shared/Paginator"

export default async function page({ searchParams }: SearchParamsProps) {
  const { userId } = auth()
  if (!userId) return null

  const result = await getSavedQuestions({
    clerkId: userId,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1
  })

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/collection"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search Questions..."
          otherClasses="flex-1" // make sure searchbar width expanded and take place over filter
        />

        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
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
            title="There's no question saved to show"
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
