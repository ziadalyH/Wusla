import mongoose, { Schema, Document, Model } from 'mongoose'
import type { Role, Locale, Language, Coordinates } from '@/types'

export interface UserDocument extends Document {
  email: string
  passwordHash?: string
  role: Role
  name: string
  avatar?: string
  phone?: string
  preferredLocale: Locale
  // student fields
  languages: Language[]
  university?: string
  bio?: string
  locationCoords?: Coordinates
  locationLabel?: string
  stripeAccountId?: string
  stripeOnboarded: boolean
  averageRating: number
  totalReviews: number
  // refugee fields
  // auth
  googleId?: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

const coordinatesSchema = new Schema<Coordinates>(
  { lat: { type: Number, required: true }, lng: { type: Number, required: true } },
  { _id: false }
)

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    role: { type: String, enum: ['refugee', 'student', 'admin'], required: true },
    name: { type: String, required: true, trim: true },
    avatar: { type: String },
    phone: { type: String },
    preferredLocale: { type: String, enum: ['ar', 'ku', 'en', 'de'], default: 'en' },
    // student
    languages: [{ type: String, enum: ['ar', 'ku', 'en', 'de', 'tr', 'fa', 'so', 'fr'] }],
    university: { type: String },
    bio: { type: String, maxlength: 500 },
    locationCoords: { type: coordinatesSchema },
    locationLabel: { type: String },
    stripeAccountId: { type: String },
    stripeOnboarded: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    // auth
    googleId: { type: String },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
)

userSchema.index({ role: 1 })
userSchema.index({ languages: 1 })
userSchema.index({ locationCoords: '2dsphere' }, { sparse: true })
userSchema.index({ stripeAccountId: 1 }, { sparse: true })

const User: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>('User', userSchema)

export default User
