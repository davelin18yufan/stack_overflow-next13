"use server"

import Tag from "@/database/tag.model"
import User from "@/database/user.model"
import { connectToDatabase } from "../mongoose"
import Question from "@/database/question.model"
import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  ToggleSaveQuestionParams,
  QuestionVoteParams,
} from "@/types/shared"
import { revalidatePath } from "next/cache"

export async function getQuestions(params: GetQuestionsParams) {
  try {
    await connectToDatabase()
    const questions = await Question.find({})
      .populate({ path: "tags", model: Tag }) // Specifies paths which should be populated with other documents
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 })

    return { questions }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase()

    const { questionId } = params

    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id name clerkId picture",
      })

    return question
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase()

    // path is used to revalidate the homepage
    const { title, content, author, tags, path } = params

    const question = await Question.create({
      title,
      content,
      author,
    })

    const tagDocuments = []
    // create tag or find it if existed
    // update if found, otherwise insert a new one
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${tag}$,"i"`) },
        },
        {
          $setOnInsert: { name: tag, $push: { question: question._id } }, // do update if target found
        },
        {
          upsert: true, // upsert if target not found
          new: true, // return new doc instead original one
        }
      )
      tagDocuments.push(existingTag._id)
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    })

    // revalidation => purge data cache and update UI
    revalidatePath(path)
  } catch (error) {
    console.log(error)
  }
}

export async function upVoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase()

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params

    let updateQuery = {}

    if (hasupVoted) {
      updateQuery = { $pull: { upVotes: userId } }
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downVotes: userId },
        $push: { upVotes: userId },
      }
    } else {
      // Adds values to the array if not already present.
      updateQuery = { $addToSet: { upVotes: userId } }
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    })

    if (!question) throw new Error("Question not found!")

    // TODO: interaction

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function downVoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase()

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params

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

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    })

    if (!question) throw new Error("Question not found!")

    // TODO: interaction

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase()

    const { userId, questionId, path } = params

    const user = await User.findById(userId)

    if (!user) throw new Error("User not found!")

    const isQuestionSaved = user.postSaved.includes(questionId)

    if (isQuestionSaved) {
      // remove question from saved
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: { postSaved: questionId },
        },
        { new: true }
      )
    } else {
      // add question to saved
      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { postSaved: questionId },
        },
        { new: true }
      )
    }

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}
