"use server"

import User from "@/database/user.model"
import { connectToDatabase } from "../mongoose"
import {
  GetAllUsersParams,
  GetUserByIdParams,
  CreateUserParams,
  DeleteUserParams,
  UpdateUserParams,
  GetUserStatsParams,
} from "@/types/shared"
import { revalidatePath } from "next/cache"
import Question from "@/database/question.model"
import Answer from "@/database/answer.model"
import Tag from "@/database/tag.model"
import { FilterQuery } from "mongoose"
import { BadgeCriteriaType } from "@/types"
import { assignBadges } from "../utils"

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    await connectToDatabase()

    const { page = 1, pageSize = 20, filter, searchQuery } = params

    // if match any condition then return
    const query: FilterQuery<typeof User> = searchQuery
      ? {
          $or: [
            { name: { $regex: new RegExp(searchQuery, "i") } },
            { username: { $regex: new RegExp(searchQuery, "i") } },
          ],
        }
      : {}

    let sortOption = {}

    switch (filter) {
      case "new_users":
        sortOption = { joinedAt: -1 }
        break
      case "old_users":
        sortOption = { joinedAt: 1 }
        break
      case "top_contributors":
        sortOption = { reputation: -1 }
        break
      default:
        sortOption = { reputation: -1 }
        break
    }

    const users = await User.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(sortOption)

    const totalUsers = await User.countDocuments(query)

    const hasNextPage = totalUsers > (page - 1) * pageSize + users.length

    return { users, hasNextPage }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getUserById(params: GetUserByIdParams) {
  try {
    await connectToDatabase()

    const { userId } = params
    const user = await User.findOne({ clerkId: userId })
    return user
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    await connectToDatabase()

    const newUser = await User.create(userData)
    return newUser
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    await connectToDatabase()

    const { clerkId, updateData, path } = params

    await User.findOneAndUpdate({ clerkId }, updateData, { new: true })

    revalidatePath(path)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    await connectToDatabase()

    const { clerkId } = params

    const user = await User.findOneAndDelete({ clerkId })

    if (!user) throw new Error("User not found")

    // Delete user from database
    // and questions, answers, comments, etc..

    // return an array with questionIds with distinct value
    // const userQuestionIds = await Question.find({ author: user._id }).distinct("_id")

    // delete user questions Ids
    await Question.deleteMany({ author: user._id })

    // TODO: delete user answers, comments...

    const deleteUser = await User.findByIdAndDelete(user._id)
    return deleteUser
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase()

    const { userId } = params

    const user = await User.findOne({ clerkId: userId })

    if (!user) throw new Error("User not found")

    const totalQuestions = await Question.countDocuments({ author: user._id }) // count where author=userId
    const totalAnswers = await Answer.countDocuments({ author: user._id })

    // get summary of every action
    const [questionSum] = await Question.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0, // exclude
          upVotes: { $size: "$upVotes" }, // create a field which is the size of upVotes
          views: { $sum: "＄views" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpVotes: { $sum: "$upVotes" },
          totalViews: { $sum: "$views" },
        },
      },
    ])

    const [answerUpVotes] = await Answer.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0, // exclude
          upVotes: { $size: "$upVotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpVotes: { $sum: "$upVotes" },
        },
      },
    ])

    const scores = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionSum?.totalUpVotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpVotes?.totalUpVotes || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionSum?.totalViews || 0,
      },
    ]

    const badgeCounts = assignBadges({ criteria: scores })

    return {
      user,
      totalAnswers,
      totalQuestions,
      badgeCounts,
      reputation: user.reputation,
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    connectToDatabase()

    const { userId, page = 1, pageSize = 10 } = params

    const totalQuestions = await Question.countDocuments({ author: userId }) // count where author=userId

    const userQuestions = await Question.find({ author: userId })
      .sort({ createdAt: -1, views: -1, upVotes: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate("author", "_id name clerkId picture")

    const hasNextPage =
      totalQuestions > (page - 1) * pageSize + userQuestions.length

    return { questions: userQuestions, totalQuestions, hasNextPage }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    connectToDatabase()

    const { userId, page = 1, pageSize = 10 } = params

    const totalAnswers = await Answer.countDocuments({ author: userId })
    const userAnswers = await Answer.find({ author: userId })
      .sort({ createdAt: -1, upVotes: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate("author", "_id name clerkId picture")
      .populate("question", "title _id ")

    const hasNextPage =
      totalAnswers > (page - 1) * pageSize + userAnswers.length

    return { answers: userAnswers, totalAnswers, hasNextPage }
  } catch (error) {
    console.log(error)
    throw error
  }
}
