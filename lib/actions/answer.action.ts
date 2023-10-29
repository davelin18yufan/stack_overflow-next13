"use server"

import Answer from "@/database/answer.model"
import { CreateAnswerParams, GetAnswersParams } from "@/types/shared"
import { connectToDatabase } from "../mongoose"
import { revalidatePath } from "next/cache"
import Question from "@/database/question.model"
import User from "@/database/user.model"

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase()

    const { author, content, question, path } = params
    const newAnswer = await Answer.create({ author, content, question })

    // Add answer into question's answer array
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    })

    // TODO: Add interaction...

    revalidatePath(path)

    return newAnswer
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase()
    const { questionId } = params

    const answers = await Answer.find({ question: questionId })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId picture name",
      })
      .sort({ createdAt: -1 })

    return { answers }
  } catch (error) {
    console.log(error)
    throw error
  }
}
