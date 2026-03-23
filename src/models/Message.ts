import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface MessageDocument extends Document {
  matchId: Types.ObjectId
  senderId: Types.ObjectId
  text: string
  readAt?: Date
  createdAt: Date
}

const messageSchema = new Schema<MessageDocument>(
  {
    matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, maxlength: 2000, trim: true },
    readAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

messageSchema.index({ matchId: 1, createdAt: 1 })
messageSchema.index({ senderId: 1 })

const Message: Model<MessageDocument> =
  mongoose.models.Message || mongoose.model<MessageDocument>('Message', messageSchema)

export default Message
