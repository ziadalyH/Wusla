import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { connectDB } from '@/lib/db'
import Request from '@/models/Request'
import Application from '@/models/Application'
import Match from '@/models/Match'
import Image from 'next/image'
import Link from 'next/link'
import AcceptApplicantButton from './AcceptApplicantButton'

type Props = { params: Promise<{ locale: string; id: string }> }

const AVATAR_COLORS = [
  'bg-violet-500', 'bg-blue-500', 'bg-emerald-500',
  'bg-amber-500', 'bg-rose-500', 'bg-sky-500', 'bg-pink-500',
]

function getAvatarColor(id: string): string {
  const code = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_COLORS[code % AVATAR_COLORS.length]
}

function StarRating({ rating, total }: { rating: number; total: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}
          style={{ fontSize: 16 }}
        >
          ★
        </span>
      ))}
      <span className="ml-1 text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
      <span className="text-sm text-gray-400">({total} review{total !== 1 ? 's' : ''})</span>
    </div>
  )
}

export default async function RefugeeRequestDetailPage({ params }: Props) {
  const { locale, id } = await params
  const session = await auth()
  if (!session?.user || session.user.role !== 'refugee') redirect(`/${locale}/auth/signin`)

  await connectDB()

  const request = await Request.findById(id).lean()
  if (!request || request.refugeeId.toString() !== session.user.id) notFound()

  const applications = await Application.find({ requestId: id })
    .populate('studentId', 'name avatar languages university bio averageRating totalReviews stripeOnboarded locationLabel')
    .sort({ appliedAt: 1 })
    .lean()

  const match = request.matchId
    ? await Match.findById(request.matchId).lean()
    : null

  const statusColors: Record<string, string> = {
    open: 'bg-green-100 text-green-700',
    matched: 'bg-blue-100 text-blue-700',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-600',
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Request details */}
      <div className="mb-6 rounded-2xl bg-white p-6 shadow">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{request.doctorType}</h1>
            <p className="mt-1 text-gray-500">
              {new Date(request.appointmentDate).toLocaleDateString('de-DE', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
            <p className="mt-1 text-gray-500">{request.appointmentAddress}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {request.languagesNeeded.map((l: string) => (
                <span key={l} className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
                  {l.toUpperCase()}
                </span>
              ))}
            </div>
            {request.notes && <p className="mt-2 text-sm text-gray-400">{request.notes}</p>}
          </div>
          <div className="text-right">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[request.status]}`}>
              {request.status}
            </span>
            <p className="mt-2 text-2xl font-bold text-indigo-600">€{request.budget}</p>
          </div>
        </div>

        {match && (
          <div className="mt-4 border-t pt-4">
            <Link
              href={`/${locale}/chat/${match._id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              💬 Open Chat
            </Link>
            {match.status === 'visit_done' && (
              <Link
                href={`/${locale}/payment/checkout/${match._id}`}
                className="ml-3 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
              >
                💳 Pay Now
              </Link>
            )}
            {match.status === 'paid' && (
              <Link
                href={`/${locale}/review/${match._id}`}
                className="ml-3 inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-600"
              >
                ⭐ Leave Review
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Applicants */}
      {request.status === 'open' && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-700">
            Applicants ({applications.length})
          </h2>

          {applications.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow">
              <div className="mb-3 text-4xl">👀</div>
              <p className="text-gray-400">No applicants yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const student = app.studentId as unknown as {
                  _id: string; name: string; avatar?: string; languages: string[];
                  university?: string; bio?: string; averageRating: number;
                  totalReviews: number; stripeOnboarded: boolean; locationLabel?: string
                }
                const avatarColor = getAvatarColor(student._id)
                const initial = student.name[0]?.toUpperCase() ?? '?'

                return (
                  <div key={app._id.toString()} className="rounded-2xl bg-white p-5 shadow">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {student.avatar ? (
                          <Image
                            src={student.avatar}
                            alt={student.name}
                            width={56}
                            height={56}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className={`flex h-14 w-14 items-center justify-center rounded-full ${avatarColor} text-xl font-bold text-white`}
                          >
                            {initial}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-gray-800">{student.name}</p>
                            {student.university && (
                              <p className="text-sm text-gray-500">{student.university}</p>
                            )}
                            {student.locationLabel && (
                              <p className="text-sm text-gray-400">📍 {student.locationLabel}</p>
                            )}
                          </div>

                          {app.status === 'pending' ? (
                            <AcceptApplicantButton
                              applicationId={app._id.toString()}
                              canAccept={student.stripeOnboarded}
                              locale={locale}
                              requestId={id}
                            />
                          ) : (
                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                              app.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {app.status}
                            </span>
                          )}
                        </div>

                        {/* Languages */}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {student.languages.map((l: string) => (
                            <span key={l} className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
                              {l.toUpperCase()}
                            </span>
                          ))}
                        </div>

                        {/* Bio */}
                        {student.bio && (
                          <p className="mt-2 text-sm text-gray-500">{student.bio}</p>
                        )}

                        {/* Cover note */}
                        {app.coverNote && (
                          <p className="mt-2 rounded-lg bg-gray-50 p-3 text-sm italic text-gray-600">
                            &ldquo;{app.coverNote}&rdquo;
                          </p>
                        )}

                        {/* Rating + payment status */}
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <StarRating rating={student.averageRating} total={student.totalReviews} />
                          {!student.stripeOnboarded && (
                            <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-500">
                              No payment setup
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {request.status !== 'open' && !match && (
        <div className="mt-4 rounded-2xl bg-white p-8 text-center shadow">
          <p className="text-gray-400">This request is {request.status}.</p>
        </div>
      )}
    </div>
  )
}
