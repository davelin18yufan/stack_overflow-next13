"use server"

import { GetTopInteractedTagsParams } from "@/types/shared";
import { connectToDatabase } from "../mongoose";
import User from "@/database/user.model";

export async function getTopInteractiveTags(params: GetTopInteractedTagsParams){
  try {
    connectToDatabase()

    const {userId, limit = 3} = params

    const user = await User.findById(userId)

    if(!user) throw Error("user not found")

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