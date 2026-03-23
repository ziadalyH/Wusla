import mongoose, { Schema, Document, Model, Types } from 'mongoose'
import type { MatchStatus } from '@/types'

export interface MatchDocument extends Document {
  requestId: Types.ObjectId
  refugeeId: Types.ObjectId
  studentId: Types.ObjectId
  applicationId: Types.ObjectId
  status: MatchStatus
  agreedAmount: number
  platformFeePercent: number
  stripePaymentIntentId?: string
  stripePayout: boolean
  paidAt?: Date
  refugeeConfirmed: boolean
  studentConfirmed: boolean
  visitCompletedAt?: Date
  createdAt: Date
}

const matchSchema = new Schema<MatchDocument>(
  {
    requestId: { type: Schema.Types.ObjectId, ref: 'Request', required: true, unique: true },
    refugeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
    status: {
      type: String,
      enum: ['active', 'visit_done', 'paid', 'disputed'],
      default: 'active',
    },
    agreedAmount: { type: Number, required: true, min: 1 },
    platformFeePercent: { type: Number, required: true },
    stripePaymentIntentId: { type: String },
    stripePayout: { type: Boolean, default: false },
    paidAt: { type: Date },
    refugeeConfirmed: { type: Boolean, default: false },
    studentConfirmed: { type: Boolean, default: false },
    visitCompletedAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

matchSchema.index({ refugeeId: 1 })
matchSchema.index({ studentId: 1 })
matchSchema.index({ status: 1 })
matchSchema.index({ stripePaymentIntentId: 1 }, { sparse: true })

const Match: Model<MatchDocument> =
  mongoose.models.Match || mongoose.model<MatchDocument>('Match', matchSchema)

export default Match
