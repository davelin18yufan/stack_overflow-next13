"use server"

import Answer from "@/database/answer.model"
import {
  AnswerVoteParams,
  CreateAnswerParams,
  GetAnswersParams,
  DeleteAnswerParams,
} from "@/types/shared"
import { connectToDatabase } from "../mongoose"
import { revalidatePath } from "next/cache"
import Question from "@/database/question.model"
import User from "@/database/user.model"
import Interaction from "@/database/interaction.model"

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase()

    const { author, content, question, path } = params
    const newAnswer = await Answer.create({ author, content, question })

    // Add answer into question's answer array
    const questionObj = await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    })

    // interaction -> create answer
    await Interaction.create({
      user: author,
      action: "answer",
      question,
      answer: newAnswer._id,
      tags: questionObj.tags,
    })

    // reputation + 10
    await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase()

    const { questionId, sortBy, page = 1, pageSize = 5 } = params

    let sortOption = {}

    switch (sortBy) {
      case "highestUpvotes":
        sortOption = { upVotes: -1 }
        break
      case "lowestUpvotes":
        sortOption = { upVotes: 1 }
        break
      case "recent":
        sortOption = { createdAt: -1 }
        break
      case "old":
        sortOption = { createdAt: 1 }
        break
      default:
        sortOption = { createdAt: -1 }
        break
    }

    const answers = await Answer.find({ question: questionId })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId picture name",
      })
      .sort(sortOption)
      .skip((page - 1) * pageSize)
      .limit(pageSize)

    const totalAnswers = await Answer.countDocuments({ question: questionId })
    const hasNextPage = totalAnswers > pageSize * (page - 1) + answers.length

    return { answers, hasNextPage }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function upVoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase()

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params

    let updateQuery = {}

    if (hasupVoted) {
      updateQuery = { $pull: { upVotes: userId } }
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downVotes: userId },
        $push: { upVotes: userId },
      }
    } else {
      updateQuery = { $addToSet: { upVotes: userId } }
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    })

    if (!answer) throw new Error("Answer not found")

    // reputation 
    if (userId !== answer.author.toString()) {
      // user reputation + 2
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: hasupVoted ? -2 : 2 },
      })
      // author reputation + 10
      await User.findByIdAndUpdate(answer.author, {
        $inc: { reputation: hasupVoted ? -10 : 10 },
      })
    }

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function downVoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase()

    const { answerId, userId, hasupVoted, hasdownVoted, path } = params

    let updateQuery = {}

    if (hasdownVoted) {
      updateQuery = { $pull: { downVotes: userId } }
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upVotes: userId },
        $push: { downVotes: userId },
      }
    } else {
      updateQuery = { $addToSet: { downVotes: userId } }
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    })

    if (!answer) throw new Error("Answer not found")

    if (userId !== answer.author.toString()) {
      // user reputation - 2
      await User.findByIdAndUpdate(userId, {
        $inc: { reputation: hasdownVoted ? 2 : -2 },
      })
      // author reputation + 10
      await User.findByIdAndUpdate(answer.author, {
        $inc: { reputation: hasdownVoted ? 10 : -10 },
      })
    }

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    connectToDatabase()

    const { answerId, path } = params

    const answer = await Answer.findById(answerId)

    if (!answer) throw new Error("Answer not found")

    // delete answer within question and interaction
    await Answer.deleteOne({ _id: answerId })
    await Question.updateMany(
      { answer: answerId },
      { $pull: { answers: answerId } }
    )
    await Interaction.deleteMany({ answer: answerId })

    // reputation - 10
    await User.findByIdAndUpdate(answer.author, {$inc: {reputation : -10}})

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}
