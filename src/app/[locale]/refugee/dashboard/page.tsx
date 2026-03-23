import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/db'
import Request from '@/models/Request'
import Match from '@/models/Match'
import Link from 'next/link'
import Image from 'next/image'

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-600',
}

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const DOCTOR_ICONS: Record<string, string> = {
  dentist: '🦷',
  dental: '🦷',
  eye: '👁️',
  ophthalmolog: '👁️',
  psychiatr: '🧠',
  psycholog: '🧠',
  gynecolog: '🩺',
  cardio: '❤️',
  ortho: '🦴',
  pediatr: '👶',
  general: '🏥',
}

function getDoctorIcon(doctorType: string): string {
  const lower = doctorType.toLowerCase()
  for (const [key, icon] of Object.entries(DOCTOR_ICONS)) {
    if (lower.includes(key)) return icon
  }
  return '🏥'
}

function daysUntil(date: Date | string): number {
  return Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

function formatShortDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="mt-1 flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill={i <= Math.round(rating) ? '#D97706' : '#E5E7EB'}>
          <path d="M6 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6 9 2.5 10.5l.5-3.5L.5 4.5 4 4z" />
        </svg>
      ))}
      <span className="ml-1 text-xs font-medium text-gray-500">{rating.toFixed(1)}</span>
    </div>
  )
}

type CompanionInfo = {
  studentName: string
  university: string
  averageRating: number
}

export default async function RefugeeDashboard({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await auth()
  if (!session?.user || session.user.role !== 'refugee') {
    redirect(`/${locale}/auth/signin`)
  }

  await connectDB()
  const requests = await Request.find({ refugeeId: session.user.id })
    .sort({ createdAt: -1 })
    .lean()

  // Fetch companion info for matched requests
  const matchedReqs = requests.filter((r) => r.status === 'matched')
  const companionMap: Record<string, CompanionInfo> = {}

  if (matchedReqs.length > 0) {
    const matches = await Match.find({
      requestId: { $in: matchedReqs.map((r) => r._id) },
    })
      .populate('studentId', 'name university averageRating')
      .lean()

    for (const m of matches) {
      const student = m.studentId as unknown as { name: string; university: string; averageRating: number }
      companionMap[m.requestId.toString()] = {
        studentName: student?.name ?? 'Student',
        university: student?.university ?? '',
        averageRating: student?.averageRating ?? 0,
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/persona-refugee.png"
              alt=""
              width={48}
              height={48}
              unoptimized
              className="rounded-full object-cover"
              style={{ width: 48, height: 48 }}
            />
            <h1 className="text-2xl font-bold text-gray-800">My Requests</h1>
          </div>
          <Link
            href={`/${locale}/refugee/requests/new`}
            style={{ backgroundColor: 'var(--refugee-primary)', borderRadius: '8px' }}
            className="px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            + New Request
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow">
            <div className="mb-4 text-5xl">🏥</div>
            <p className="text-gray-500">No requests yet.</p>
            <Link
              href={`/${locale}/refugee/requests/new`}
              style={{ backgroundColor: 'var(--refugee-primary)', borderRadius: '8px' }}
              className="mt-4 inline-block px-6 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Post your first request
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => {
              const reqId = req._id.toString()
              const days = daysUntil(req.appointmentDate)
              const isUrgent = days <= 3 && req.status === 'open'
              const companion = companionMap[reqId]

              // ── Matched: companion confirmed card ────────────────
              if (req.status === 'matched' && companion) {
                const initials = companion.studentName
                  .split(' ')
                  .map((w: string) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()

                return (
                  <div
                    key={reqId}
                    className="rounded-2xl bg-white p-5 shadow-lg"
                    style={{ border: '1px solid #E5E7EB' }}
                  >
                    {/* Status row */}
                    <div className="mb-3 flex items-center gap-2">
                      <div
                        style={{ backgroundColor: 'var(--student-accent)', width: 8, height: 8, borderRadius: '50%' }}
                      />
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Companion confirmed
                      </span>
                    </div>

                    {/* Student info */}
                    <div className="flex items-center gap-3">
                      <div
                        style={{ backgroundColor: 'var(--refugee-primary)', borderRadius: '50%', width: 44, height: 44 }}
                        className="flex flex-shrink-0 items-center justify-center text-sm font-bold text-white"
                      >
                        {initials}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{companion.studentName}</p>
                        <p className="text-sm text-gray-500">{companion.university}</p>
                        {companion.averageRating > 0 && (
                          <StarRating rating={companion.averageRating} />
                        )}
                      </div>
                    </div>

                    {/* Visit details */}
                    <Link
                      href={`/${locale}/refugee/requests/${reqId}`}
                      style={{ backgroundColor: 'var(--refugee-surface)', borderRadius: '8px' }}
                      className="mt-3 flex items-center justify-between px-3 py-2 transition hover:opacity-80"
                    >
                      <span className="text-sm text-gray-600">
                        {formatShortDate(req.appointmentDate)} · {req.appointmentAddress}
                      </span>
                      <span style={{ color: 'var(--refugee-primary)' }} className="text-sm font-semibold">
                        View →
                      </span>
                    </Link>
                  </div>
                )
              }

              // ── Default card (open / completed / cancelled) ──────
              const icon = getDoctorIcon(req.doctorType)
              return (
                <Link
                  key={reqId}
                  href={`/${locale}/refugee/requests/${reqId}`}
                  className="block rounded-2xl bg-white p-5 shadow transition hover:shadow-md"
                  style={{ border: '1px solid #E5E7EB' }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-orange-50 text-2xl">
                      {icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate font-semibold text-gray-800">{req.doctorType}</h3>
                        <span className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[req.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {STATUS_LABELS[req.status] ?? req.status}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center gap-1.5 text-sm">
                        <span>{isUrgent ? '🔴' : '📅'}</span>
                        <span className={isUrgent ? 'font-medium text-red-600' : 'text-gray-500'}>
                          {days <= 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`}
                          {' · '}
                          {formatShortDate(req.appointmentDate)}
                        </span>
                      </div>

                      <p className="mt-0.5 truncate text-sm text-gray-400">
                        📍 {req.appointmentAddress}
                      </p>

                      <div className="mt-2 flex items-center justify-between">
                        <span style={{ color: 'var(--refugee-primary)' }} className="text-sm font-semibold">
                          €{req.budget}
                        </span>
                        {req.applicationCount > 0 && (
                          <span
                            style={{ backgroundColor: 'var(--refugee-primary)', borderRadius: '999px' }}
                            className="px-2.5 py-0.5 text-xs font-semibold text-white"
                          >
                            {req.applicationCount} applicant{req.applicationCount !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
