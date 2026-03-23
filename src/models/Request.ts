import mongoose, { Schema, Document, Model, Types } from 'mongoose'
import type { RequestStatus, MatchingMode, Language, Coordinates } from '@/types'

export interface RequestDocument extends Document {
  refugeeId: Types.ObjectId
  status: RequestStatus
  doctorType: string
  appointmentDate: Date
  appointmentAddress: string
  addressCoords?: Coordinates
  languagesNeeded: Language[]
  notes?: string
  budget: number
  matchingMode: MatchingMode
  matchId?: Types.ObjectId
  applicationCount: number
  createdAt: Date
  updatedAt: Date
}

const coordinatesSchema = new Schema<Coordinates>(
  { lat: { type: Number, required: true }, lng: { type: Number, required: true } },
  { _id: false }
)

const requestSchema = new Schema<RequestDocument>(
  {
    refugeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['open', 'matched', 'completed', 'cancelled'],
      default: 'open',
    },
    doctorType: { type: String, required: true, trim: true },
    appointmentDate: { type: Date, required: true },
    appointmentAddress: { type: String, required: true, trim: true },
    addressCoords: { type: coordinatesSchema },
    languagesNeeded: [
      { type: String, enum: ['ar', 'ku', 'en', 'de', 'tr', 'fa', 'so', 'fr'], required: true },
    ],
    notes: { type: String, maxlength: 500 },
    budget: { type: Number, required: true, min: 1 },
    matchingMode: {
      type: String,
      enum: ['refugee_choice', 'first_come', 'auto'],
      required: true,
    },
    matchId: { type: Schema.Types.ObjectId, ref: 'Match' },
    applicationCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

requestSchema.index({ refugeeId: 1 })
requestSchema.index({ status: 1, appointmentDate: 1 })
requestSchema.index({ languagesNeeded: 1 })
requestSchema.index({ addressCoords: '2dsphere' }, { sparse: true })

const Request: Model<RequestDocument> =
  mongoose.models.Request || mongoose.model<RequestDocument>('Request', requestSchema)

export default Request
