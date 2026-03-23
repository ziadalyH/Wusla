import { z } from 'zod'

const LANGUAGES = ['ar', 'ku', 'en', 'de', 'tr', 'fa', 'so', 'fr'] as const
const DOCTOR_TYPES = [
  'General Practitioner',
  'Dentist',
  'Gynecologist',
  'Pediatrician',
  'Psychiatrist',
  'Specialist',
  'Emergency',
  'Other',
] as const

export const createRequestSchema = z.object({
  doctorType: z.enum(DOCTOR_TYPES),
  appointmentDate: z.string().refine((d) => !isNaN(new Date(d).getTime()), {
    message: 'Invalid appointment date',
  }),
  appointmentAddress: z.string().min(5).max(300),
  languagesNeeded: z
    .array(z.enum(LANGUAGES))
    .min(1, 'Select at least one language'),
  notes: z.string().max(500).optional(),
  budget: z.number().min(5).max(500),
})

export type CreateRequestInput = z.infer<typeof createRequestSchema>
