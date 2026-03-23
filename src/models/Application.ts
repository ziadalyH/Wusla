import mongoose, { Schema, Document, Model, Types } from 'mongoose'
import type { ApplicationStatus } from '@/types'

export interface ApplicationDocument extends Document {
  requestId: Types.ObjectId
  studentId: Types.ObjectId
  status: ApplicationStatus
  coverNote?: string
  appliedAt: Date
  updatedAt: Date
}

const applicationSchema = new Schema<ApplicationDocument>(
  {
    requestId: { type: Schema.Types.ObjectId, ref: 'Request', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
      default: 'pending',
    },
    coverNote: { type: String, maxlength: 300 },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: 'appliedAt', updatedAt: true } }
)

// Prevent duplicate applications
applicationSchema.index({ requestId: 1, studentId: 1 }, { unique: true })
applicationSchema.index({ studentId: 1 })
applicationSchema.index({ status: 1 })

const Application: Model<ApplicationDocument> =
  mongoose.models.Application ||
  mongoose.model<ApplicationDocument>('Application', applicationSchema)

export default Application
