import { getUserQuestions } from "@/lib/actions/user.action"
import { SearchParamsProps } from "@/types"
import React from "react"
import QuestionCard from "../cards/QuestionCard"
import Paginator from "./Paginator"

interface Props extends SearchParamsProps {
  userId: string
  clerkId?: string | null
}

const QuestionTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserQuestions({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  })

  return (
    <>
      {result.questions.map((question) => (
        <QuestionCard
          key={question._id}
          _id={question._id}
          clerkId={clerkId}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upVotes={question.upVotes}
          views={question.views}
          answers={question.answers}
          createdAt={question.createdAt}
        />
      ))}

      <div className="mt-10">
        <Paginator 
          pageNumber={searchParams.page ? +searchParams.page : 1}
          hasNextPage={result.hasNextPage}
        />
      </div>
    </>
  )
}

export default QuestionTab
