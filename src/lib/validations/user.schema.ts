import { z } from 'zod'

const LANGUAGES = ['ar', 'ku', 'en', 'de', 'tr', 'fa', 'so', 'fr'] as const

export const registerRefugeeSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  preferredLocale: z.enum(['ar', 'ku', 'en', 'de']).default('en'),
})

export const registerStudentSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  preferredLocale: z.enum(['ar', 'ku', 'en', 'de']).default('en'),
  languages: z.array(z.enum(LANGUAGES)).min(1, 'Select at least one language'),
  university: z.string().min(2).max(200).optional(),
  bio: z.string().max(500).optional(),
  locationLabel: z.string().max(200).optional(),
})

export type RegisterRefugeeInput = z.infer<typeof registerRefugeeSchema>
export type RegisterStudentInput = z.infer<typeof registerStudentSchema>
