import mongoose, { Schema, Document, Model, Types } from 'mongoose'
import type { MatchingMode, Locale } from '@/types'

export interface SettingsDocument extends Document {
  matchingMode: MatchingMode
  platformFeePercent: number
  maintenanceMode: boolean
  allowedLocales: Locale[]
  updatedAt: Date
  updatedBy?: Types.ObjectId
}

const settingsSchema = new Schema<SettingsDocument>(
  {
    matchingMode: {
      type: String,
      enum: ['refugee_choice', 'first_come', 'auto'],
      default: 'refugee_choice',
    },
    platformFeePercent: { type: Number, default: 10, min: 0, max: 50 },
    maintenanceMode: { type: Boolean, default: false },
    allowedLocales: {
      type: [String],
      default: ['ar', 'ku', 'en', 'de'],
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
)

const Settings: Model<SettingsDocument> =
  mongoose.models.Settings || mongoose.model<SettingsDocument>('Settings', settingsSchema)

export async function getSettings(): Promise<SettingsDocument> {
  let settings = await Settings.findOne()
  if (!settings) {
    settings = await Settings.create({})
  }
  return settings
}

export default Settings
