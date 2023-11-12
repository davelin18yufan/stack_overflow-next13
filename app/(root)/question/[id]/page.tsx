import { getQuestionById } from "@/lib/actions/question.action"
import Image from "next/image"
import Link from "next/link"
import Metric from "@/components/shared/Metric"
import { formatNumber, getTimestamp } from "@/lib/utils"
import ParseHTML from "@/components/shared/ParseHTML"
import RenderTag from "@/components/shared/RenderTag"
import Answer from "@/components/forms/Answer"
import AllAnswers from "@/components/shared/AllAnswers"
import { auth } from "@clerk/nextjs"
import { getUserById } from "@/lib/actions/user.action"
import Votes from "@/components/shared/Votes"
import { URLProps } from "@/types"
import type { Metadata } from "next"

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const { id } = params
  const { userId: clerkId } = auth()

  let mongoUser

  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId })
  }

  const result = await getQuestionById({ questionId: id })

  return {
    title: `${result.title} | Dev Overflow`,
  }
}

// :id => {params}, ?id => {searchParams}
const page = async ({ params, searchParams }: URLProps) => {
  const { id } = params
  const { userId: clerkId } = auth()

  let mongoUser

  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId })
  }

  const result = await getQuestionById({ questionId: id })

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${result.author.clerkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result.author.picture}
              alt="profile"
              width={22}
              height={22}
              className="rounded-full"
            />

            <p className="paragraph-semibold text-dark300_light700">
              {result.author.name}
            </p>
          </Link>

          <div className="flex justify-end">
            <Votes
              type="Question"
              itemId={JSON.stringify(result._id)}
              userId={JSON.stringify(mongoUser._id)}
              upVotes={result.upVotes.length}
              downVotes={result.downVotes.length}
              hasUpVoted={result.upVotes.includes(mongoUser._id)}
              hasDownVoted={result.downVotes.includes(mongoUser._id)}
              hasSaved={mongoUser?.postSaved.includes(result._id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {result.title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          value={` asked ${getTimestamp(result.createdAt)}`}
          alt="clock icon"
          title=""
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          value={formatNumber(result.answers.length)}
          alt="Message"
          title="Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          value={formatNumber(result.views)}
          alt="eye"
          title="Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>

      <ParseHTML data={result.content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {result.tags.map((tag: any) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <AllAnswers
        questionId={result._id}
        userId={mongoUser._id}
        totalAnswers={result.answers.length}
        filter={searchParams?.filter}
        page={searchParams?.page}
      />

      <Answer
        question={result.content}
        questionId={JSON.stringify(result._id)}
        authorId={JSON.stringify(mongoUser._id)}
      />
    </>
  )
}

export default page
