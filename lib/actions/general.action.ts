"use server"

import { SearchParams } from "@/types/shared"
import { connectToDatabase } from "../mongoose"
import Question from "@/database/question.model"
import Tag from "@/database/tag.model"
import User from "@/database/user.model"
import Answer from "@/database/answer.model"

const SearchableTypes = ["tag", "answer", "question", "user"]

export async function globalSearch(params: SearchParams) {
  try {
    connectToDatabase()

    const { query, type } = params

    const regexQuery = { $regex: query, $options: "i" }
    const modelsAndTypes = [
      { model: Tag, searchFields: "name", type: "tag" },
      { model: Question, searchFields: "title", type: "question" },
      { model: User, searchFields: "name", type: "user" },
      { model: Answer, searchFields: "content", type: "answer" },
    ]

    let results = []
    const requestType = type?.toLowerCase()
    // if no filter type selected -> show 2 documents from each type
    // Array's map(), foreach() and other iteration methods do not use promises.
    if (!requestType || !SearchableTypes.includes(requestType)) {
      for (const { model, searchFields, type } of modelsAndTypes) {
        const queryResults = await model
          .find({ [searchFields]: regexQuery })
          .limit(2)

        results.push(
          ...queryResults.map((item) => {
            // let id = ""
            // switch (type) {
            //   case "user":
            //     id = item.clerkId
            //     break
            //   case "answer":
            //     id = item.question
            //     break
            //   default:
            //     id = item._id
            //     break
            // }

            return {
              title:
                type === "answer"
                  ? `Answers containing ${query}`
                  : item[searchFields],
              type,
              id:
                type === "user"
                  ? item.clerkId
                  : type === "answer"
                  ? item.question
                  : item._id,
            }
          })
        )
      }
    } else {
      // search for specific type -> 8 results
      const request = modelsAndTypes.find(
        (item) => item.type === requestType
      )

      if (!request) throw new Error("Invalid search type!")

      const queryResults = await request.model
        .find({ [request.searchFields]: regexQuery })
        .sort({ createdAt: -1 })
        .limit(8)

      results = queryResults.map((item) => ({
        title:
          type === "answer"
            ? `Answers containing ${query}`
            : item[request.searchFields],
        type,
        id:
          type === "user"
            ? item.clerkId
            : type === "answer"
            ? item.question
            : item._id,
      }))
    }

    return JSON.stringify(results)
  } catch (error) {
    console.log(error)
    throw error
  }
}
