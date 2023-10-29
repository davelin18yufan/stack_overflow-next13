"use client"

import Image from "next/image"
import React from "react"
import { formatNumber } from "@/lib/utils"

interface Props {
  type: string
  itemId: string
  userId: string
  upVotes: number
  downVotes: number
  hasUpVoted: boolean
  hasDownVoted: boolean
  hasSaved?: boolean
}

const Votes = async ({
  itemId,
  userId,
  type,
  upVotes,
  downVotes,
  hasUpVoted,
  hasDownVoted,
  hasSaved,
}: Props) => {

  const handleSave = () => {

  }

  const handleVote = async (vote) => {

  }

  return (
    <div className="flex gap-5 ">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5 ">
          <Image
            src={`/assets/icons/${hasUpVoted ? "upvoted" : "upvote"}.svg`}
            alt="upvote icon"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={handleVote('upVote')}
          />
          <div className="flex-center  background-light700_dark400 p-1 rounded-sm min-w-[18px] ">
            <p className="text-dark400_light900 subtle-medium text-center uppercase">
              {formatNumber(upVotes)}
            </p>
          </div>
        </div>

        <div className="flex-center gap-1.5 ">
          <Image
            src={`/assets/icons/${hasDownVoted ? "downvoted" : "downvote"}.svg`}
            alt="downvote icon"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={handleVote('downVote')}
          />
          <div className="flex-center  background-light700_dark400 p-1 rounded-sm min-w-[18px] ">
            <p className="text-dark400_light900 subtle-medium text-center uppercase">
              {formatNumber(downVotes)}
            </p>
          </div>
        </div>
      </div>

        <Image
          src={`/assets/icons/${
            type === "question" ? "star-filled" : "star-red"
          }.svg`}
          alt="star icon"
          width={18}
          height={18}
          className="cursor-pointer"
          onClick={handleSave}
        />
    </div>
  )
}

export default Votes
