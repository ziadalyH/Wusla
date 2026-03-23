import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface ReviewDocument extends Document {
  matchId: Types.ObjectId
  reviewerId: Types.ObjectId
  revieweeId: Types.ObjectId
  role: 'refugee_reviews_student' | 'student_reviews_refugee'
  rating: number
  comment?: string
  createdAt: Date
}

const reviewSchema = new Schema<ReviewDocument>(
  {
    matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
    reviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    revieweeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: {
      type: String,
      enum: ['refugee_reviews_student', 'student_reviews_refugee'],
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 300 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

// One review per side per match
reviewSchema.index({ matchId: 1, role: 1 }, { unique: true })
reviewSchema.index({ revieweeId: 1 })

const Review: Model<ReviewDocument> =
  mongoose.models.Review || mongoose.model<ReviewDocument>('Review', reviewSchema)

export default Review
