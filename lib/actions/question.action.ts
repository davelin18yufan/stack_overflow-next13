"use server"

import Tag from "@/database/tag.model"
import User from "@/database/user.model"
import { connectToDatabase } from "../mongoose"
import Question from "@/database/question.model"
import { CreateQuestionParams, GetQuestionsParams } from "@/types/shared"
import { revalidatePath } from "next/cache"

export async function getQuestions(params: GetQuestionsParams) {
  try {
    await connectToDatabase()
    const questions = await Question.find({})
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({createdAt: -1})

    return { questions }
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


