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
import Interaction from "@/database/interaction.model"

export async function getTopInteractiveTags(
  params: GetTopInteractedTagsParams
) {
  try {
    connectToDatabase()

    const { userId, limit = 3 } = params

    const user = await User.findById(userId)

    if (!user) throw Error("user not found")

    // find interactions for the user and group tags...
    const tagCountMap = await Interaction.aggregate([
      { $match: { user: user._id, tags: { $exists: true, $ne: [] } } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ])

    const topTags = tagCountMap.map((tag) => tag._id)
    // Find the tag
    const topTagDocument = await Tag.find({ _id: { $in: topTags } })

    return topTagDocument
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    await connectToDatabase()

    const { searchQuery, page = 1, pageSize = 10, filter } = params

    const query: FilterQuery<typeof Tag> = searchQuery
      ? {
          $or: [
            { name: { $regex: new RegExp(searchQuery, "i") } },
            { description: { $regex: new RegExp(searchQuery, "i") } },
          ],
        }
      : {}

    let sortOption = {}

    switch (filter) {
      case "popular":
        sortOption = { questions: -1 }
        break
      case "recent":
        sortOption = { createdOn: -1 }
        break
      case "name":
        sortOption = { name: 1 }
        break
      case "old":
        sortOption = { createdOn: 1 }
        break
      default:
        break
    }

    const tags = await Tag.find(query)
      .sort(sortOption)
      .skip((page - 1) * pageSize)
      .limit(pageSize)

    const totalTags = await Tag.countDocuments(query)
    const hasNextPage = totalTags > (page - 1) * pageSize + tags.length

    return { tags, hasNextPage }
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
    const query: FilterQuery<typeof Tag> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {}

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: query,
      options: {
        sort: { createdAt: -1 },
        skip: (page - 1) * pageSize,
        limit: pageSize + 1, // check if there is any on the next page
      },
      populate: [
        { path: "author", model: User, select: "_id name clerkId picture" },
        { path: "tags", model: Tag, select: "_id name" },
      ],
    })

    if (!tag) throw new Error("No tag found")

    const questions = tag.questions

    const hasNextPage = questions.length > pageSize

    return { tagTitle: tag.name, questions, hasNextPage }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getTopPopularTags() {
  try {
    connectToDatabase()

    const popularTags = await Tag.aggregate([
      {
        $project: {
          name: 1, // include field
          numberOfQuestions: { $size: "$questions" }, // new field with a size of property
        },
      },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ])

    return popularTags
  } catch (error) {
    console.log(error)
  }
}
