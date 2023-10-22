import { Schema, model, models, Document } from "mongoose"

// Document possess the types of database properties, such as "_id"
export interface IQuestion extends Document {
  title: string
  content: string
  views: number
  tags: Schema.Types.ObjectId[] /* connection to another model */
  author: Schema.Types.ObjectId
  answers: Schema.Types.ObjectId[]
  upVotes: Schema.Types.ObjectId[]
  downVotes: Schema.Types.ObjectId[]
  createdAt: Date
}

export const QuestionSchema = new Schema<IQuestion>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  author: { type: Schema.Types.ObjectId, ref: "User" },
  upVotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downVotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now() },
})

const Question = models.Question || model<IQuestion>("Question", QuestionSchema)

export default Question
