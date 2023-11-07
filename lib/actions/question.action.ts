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
  GetSavedQuestionsParams,
  EditQuestionParams,
  DeleteQuestionParams,
} from "@/types/shared"
import { revalidatePath } from "next/cache"
import { FilterQuery } from "mongoose"
import Answer from "@/database/answer.model"
import Interaction from "@/database/interaction.model"

export async function getQuestions(params: GetQuestionsParams) {
  try {
    await connectToDatabase()

    const { searchQuery, page = 1, pageSize = 10, filter } = params

    const query: FilterQuery<typeof Question> = searchQuery
      ? {
          // if match any condition then return
          $or: [
            { title: { $regex: new RegExp(searchQuery, "i") } },
            { content: { $regex: new RegExp(searchQuery, "i") } },
          ],
        }
      : {}

    let sortOption = {}

    switch (filter) {
      case "newest":
        sortOption = { createdAt: -1 }
        break
      case "frequent":
        sortOption = { views: -1 }
        break
      case "unanswered":
        query.answers = { $size: 0 } // update the find query
        break
      default:
        sortOption = { createdAt: -1 }
        break
    }

    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag }) // Specifies paths which should be populated with other documents
      .populate({ path: "author", model: User })
      .sort(sortOption)
      .skip((page - 1) * pageSize)
      .limit(pageSize)

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
          name: { $regex: new RegExp(`^${tag}$`, "i") },
        },
        {
          $setOnInsert: { name: tag }, // do update if target found
          $push: { questions: question._id },
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

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase()

    const { clerkId, searchQuery, filter, page = 1, pageSize = 10 } = params

    const query: FilterQuery<typeof Question> = searchQuery
      ? {
          $or: [
            { title: { $regex: new RegExp(searchQuery, "i") } },
            { content: { $regex: new RegExp(searchQuery, "i") } },
          ],
        }
      : {}

    let sortOption = {}

    switch (filter) {
      case "most_recent":
        sortOption = {createdAt : -1}
        break
      case "oldest":
        sortOption = { createdAt: 1 }
        break
      case "most_voted":
        sortOption = { upVotes: -1 }
        break
      case "most_viewed":
        sortOption = { views: -1 }
        break
      case "most_answered":
        sortOption = { answers: -1 }
        break
      default:
        break
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "postSaved",
      match: query,
      options: {
        sort: sortOption,
      },
      populate: [
        { path: "author", model: User, select: "_id name clerkId picture" },
        { path: "tags", model: Tag, select: "_id name" },
      ],
    })

    if (!user) throw new Error("User not found")

    return { questions: user.postSaved }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase()

    const { questionId, path } = params

    // delete question/answers/interactivity/tags associate with question
    await Question.deleteOne({ _id: questionId })
    await Answer.deleteMany({ question: questionId })
    await Interaction.deleteMany({ question: questionId })
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    )

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase()

    const { questionId, title, content, path } = params

    const question = await Question.findById(questionId).populate("tags")

    if (!question) throw new Error("Question not found")

    question.title = title
    question.content = content

    await question.save()

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getHotQuestions() {
  try {
    connectToDatabase()

    const hotQuestions = await Question.find({})
      .sort({ views: -1, upVotes: -1 }) // descending order
      .limit(5)

    return hotQuestions
  } catch (error) {
    console.log(error)
    throw error
  }
}
