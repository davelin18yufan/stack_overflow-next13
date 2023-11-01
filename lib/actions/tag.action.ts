"use server"

import {
  GetAllTagsParams,
  GetTopInteractedTagsParams,
  GetQuestionsByTagIdParams,
} from "@/types/shared"
import { connectToDatabase } from "../mongoose"
import User from "@/database/user.model"
import Tag, { ITag } from "@/database/tag.model"
import Question from "@/database/question.model"
import { FilterQuery } from "mongoose"

export async function getTopInteractiveTags(
  params: GetTopInteractedTagsParams
) {
  try {
    connectToDatabase()

    const { userId, limit = 3 } = params

    const user = await User.findById(userId)

    if (!user) throw Error("user not found")

    // find interactions for the user and grown tags...
    // interaction

    return [
      { _id: "123", name: "HTML" },
      { _id: "123", name: "HTML" },
      { _id: "123", name: "HTML" },
    ]
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    await connectToDatabase()

    const tags = await Tag.find({})

    return { tags }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getQuestionByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase()

    const { tagId, searchQuery, page = 1, pageSize = 10 } = params

    const tagFilter: FilterQuery<ITag> = { _id: tagId }

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: new RegExp(searchQuery, "i") } }
        : {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "author", model: User, select: "_id name clerkId picture" },
        { path: "tags", model: Tag, select: "_id name" },
      ],
    })

    if (!tag) throw new Error("No tag found")

    const questions = tag.questions

    return { tagTitle: tag.name, questions }
  } catch (error) {
    console.log(error)
    throw error
  }
}
