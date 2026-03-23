export type Role = 'refugee' | 'student' | 'admin'
export type Locale = 'ar' | 'ku' | 'en' | 'de'
export type Language = 'ar' | 'ku' | 'en' | 'de' | 'tr' | 'fa' | 'so' | 'fr'

export type MatchingMode = 'refugee_choice' | 'first_come' | 'auto'

export type RequestStatus = 'open' | 'matched' | 'completed' | 'cancelled'
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn'
export type MatchStatus = 'active' | 'visit_done' | 'paid' | 'disputed'

export interface Coordinates {
  lat: number
  lng: number
}

export interface IUser {
  _id: string
  email: string
  role: Role
  name: string
  avatar?: string
  phone?: string
  preferredLocale: Locale
  // student fields
  languages?: Language[]
  university?: string
  bio?: string
  locationCoords?: Coordinates
  locationLabel?: string
  stripeAccountId?: string
  stripeOnboarded?: boolean
  averageRating?: number
  totalReviews?: number
  // auth
  googleId?: string
  emailVerified?: boolean
  createdAt: string
  updatedAt: string
}

export interface IRequest {
  _id: string
  refugeeId: string | IUser
  status: RequestStatus
  doctorType: string
  appointmentDate: string
  appointmentAddress: string
  addressCoords?: Coordinates
  languagesNeeded: Language[]
  notes?: string
  budget: number
  matchingMode: MatchingMode
  matchId?: string
  applicationCount: number
  createdAt: string
  updatedAt: string
}

export interface IApplication {
  _id: string
  requestId: string | IRequest
  studentId: string | IUser
  status: ApplicationStatus
  coverNote?: string
  appliedAt: string
  updatedAt: string
}

export interface IMatch {
  _id: string
  requestId: string | IRequest
  refugeeId: string | IUser
  studentId: string | IUser
  applicationId: string | IApplication
  status: MatchStatus
  agreedAmount: number
  platformFeePercent: number
  stripePaymentIntentId?: string
  stripePayout: boolean
  paidAt?: string
  refugeeConfirmed: boolean
  studentConfirmed: boolean
  visitCompletedAt?: string
  createdAt: string
}

export interface IMessage {
  _id: string
  matchId: string
  senderId: string | IUser
  text: string
  readAt?: string
  createdAt: string
}

export interface IReview {
  _id: string
  matchId: string
  reviewerId: string | IUser
  revieweeId: string | IUser
  role: 'refugee_reviews_student' | 'student_reviews_refugee'
  rating: number
  comment?: string
  createdAt: string
}

export interface ISettings {
  _id: string
  matchingMode: MatchingMode
  platformFeePercent: number
  maintenanceMode: boolean
  allowedLocales: Locale[]
  updatedAt: string
  updatedBy?: string
}
