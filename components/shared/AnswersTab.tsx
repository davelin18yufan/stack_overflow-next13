import { SearchParamsProps } from "@/types"
import { getUserAnswers } from "@/lib/actions/user.action"
import { getTimestamp, formatNumber } from "@/lib/utils"
import Link from "next/link"
import Metric from "./Metric"

interface Props extends SearchParamsProps {
  userId: string
  clerkId?: string | null
}

const AnswersTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserAnswers({
    userId,
    page: 1,
  })

  return (
    <>
      {result.answers.map(answer =>
      (<div className="card-wrapper rounded-[10px] p-9 sm:px-11">
        <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {/* for mobile size */}
            {getTimestamp(answer.question.createdAt)}
          </span>{" "}
          <Link href={`/question/${answer.question._id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {answer.question.title}
            </h3>
          </Link>
        </div>

        <div className="flex-between mt-6 w-full flex-wrap gap-3">
          {/* question author */}
          <Metric
            imgUrl={answer.question.author.picture}
            value={answer.quesiton.author.name}
            alt="user"
            title={` - asked ${getTimestamp(answer.question.createdAt)}`}
            href={`/profile/${answer.question.author._id}`}
            textStyles="body-medium text-dark400_light700"
          />

          <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
            <Metric
              imgUrl="/assets/icons/like.svg"
              value={formatNumber(answer.upVotes.length)}
              alt="UpVotes"
              title="Votes"
              textStyles="small-medium text-dark400_light800"
            />
          </div>
        </div>
      </div>)
      )}
    </>
  )
}

export default AnswersTab
