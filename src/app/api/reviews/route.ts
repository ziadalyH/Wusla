import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Match from '@/models/Match'
import Review from '@/models/Review'
import User from '@/models/User'
import { z } from 'zod'

const reviewSchema = z.object({
  matchId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(300).optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = reviewSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  await connectDB()

  const match = await Match.findById(parsed.data.matchId)
  if (!match || match.status !== 'paid') {
    return NextResponse.json({ error: 'Cannot review this match' }, { status: 400 })
  }

  const isRefugee = match.refugeeId.toString() === session.user.id
  const isStudent = match.studentId.toString() === session.user.id

  if (!isRefugee && !isStudent) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const role = isRefugee ? 'refugee_reviews_student' : 'student_reviews_refugee'
  const revieweeId = isRefugee ? match.studentId : match.refugeeId

  try {
    const review = await Review.create({
      matchId: match._id,
      reviewerId: session.user.id,
      revieweeId,
      role,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    })

    // Update reviewee's average rating
    const allReviews = await Review.find({ revieweeId })
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    await User.findByIdAndUpdate(revieweeId, {
      averageRating: Math.round(avg * 10) / 10,
      totalReviews: allReviews.length,
    })

    return NextResponse.json({ review }, { status: 201 })
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 11000) {
      return NextResponse.json({ error: 'You have already reviewed this match' }, { status: 409 })
    }
    throw err
  }
}
