import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { connectDB } from '@/lib/db'
import Match from '@/models/Match'
import Review from '@/models/Review'
import ReviewForm from './ReviewForm'

type Props = { params: Promise<{ locale: string; matchId: string }> }

export default async function ReviewPage({ params }: Props) {
  const { locale, matchId } = await params
  const session = await auth()
  if (!session?.user) redirect(`/${locale}/auth/signin`)

  await connectDB()

  const match = await Match.findById(matchId)
    .populate('refugeeId', 'name')
    .populate('studentId', 'name')
    .lean()

  if (!match) notFound()

  const isRefugee = (match.refugeeId as { _id: { toString(): string } })._id.toString() === session.user.id
  const isStudent = (match.studentId as { _id: { toString(): string } })._id.toString() === session.user.id

  if (!isRefugee && !isStudent) notFound()
  if (match.status !== 'paid') redirect(`/${locale}/chat/${matchId}`)

  const role = isRefugee ? 'refugee_reviews_student' : 'student_reviews_refugee'

  const existing = await Review.findOne({ matchId, role }).lean()

  const refugee = match.refugeeId as unknown as { name: string }
  const student = match.studentId as unknown as { name: string }
  const revieweeName = isRefugee ? student.name : refugee.name

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <div className="rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-2 text-2xl font-bold text-gray-800">Leave a Review</h1>
        <p className="mb-6 text-gray-500">How was your experience with {revieweeName}?</p>

        {existing ? (
          <div className="rounded-xl bg-green-50 p-6 text-center">
            <p className="text-2xl mb-2">{'★'.repeat(existing.rating)}{'☆'.repeat(5 - existing.rating)}</p>
            <p className="font-medium text-green-700">You already reviewed this visit.</p>
            {existing.comment && <p className="mt-2 text-sm text-gray-600 italic">&ldquo;{existing.comment}&rdquo;</p>}
          </div>
        ) : (
          <ReviewForm matchId={matchId} locale={locale} revieweeName={revieweeName} />
        )}
      </div>
    </div>
  )
}
