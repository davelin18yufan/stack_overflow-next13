"use server"

import { GetAllTagsParams, GetTopInteractedTagsParams } from "@/types/shared"
import { connectToDatabase } from "../mongoose"
import User from "@/database/user.model"
import Tag from "@/database/tag.model"

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
