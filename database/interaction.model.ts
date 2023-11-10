import {Schema, model, models, Document} from "mongoose"

// record user action to every question 
export interface IInteraction extends Document {
  user: Schema.Types.ObjectId 
  action: string // what action user doing for platform
  question: Schema.Types.ObjectId // recording which question user been focusing
  answer: Schema.Types.ObjectId 
  tags: Schema.Types.ObjectId[] // which tag be recommended to user
  createdAt: Date
}

export const InteractionSchema = new Schema<IInteraction>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, require: true },
  question: { type: Schema.Types.ObjectId, ref: "Question" },
  answer: { type: Schema.Types.ObjectId, ref: "Answer" },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  createdAt: {type: Date, default: Date.now()}
})

const Interaction = models.Interaction || model('Interaction', InteractionSchema)

export default Interaction