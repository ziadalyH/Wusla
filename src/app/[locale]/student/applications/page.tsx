import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/db'
import Application from '@/models/Application'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
  withdrawn: 'bg-gray-100 text-gray-500',
}

const STATUS_ICONS: Record<string, string> = {
  pending: '⏳',
  accepted: '✅',
  rejected: '❌',
  withdrawn: '↩️',
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

export default async function StudentApplicationsPage({ params }: Props) {
  const { locale } = await params
  const session = await auth()
  if (!session?.user || session.user.role !== 'student') redirect(`/${locale}/auth/signin`)

  await connectDB()

  const applications = await Application.find({ studentId: session.user.id })
    .populate('requestId', 'doctorType appointmentDate appointmentAddress budget status matchId')
    .sort({ appliedAt: -1 })
    .lean()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">My Sessions</h1>

        {applications.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow">
            <div className="mb-4 text-5xl">📋</div>
            <p className="text-gray-500">You haven&apos;t applied to any requests yet.</p>
            <Link
              href={`/${locale}/student/dashboard`}
              className="mt-4 inline-block rounded-lg bg-teal-700 px-6 py-2 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Browse requests
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => {
              const req = app.requestId as unknown as {
                _id: string; doctorType: string; appointmentDate: string;
                appointmentAddress: string; budget: number; status: string; matchId?: string
              }
              const days = daysUntil(req.appointmentDate)
              const isUpcoming = days >= 0
              const icon = getDoctorIcon(req.doctorType)

              return (
                <div key={app._id.toString()} className="rounded-2xl bg-white p-5 shadow">
                  <div className="flex items-start gap-4">
                    {/* Doctor icon */}
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50 text-2xl">
                      {icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate font-semibold text-gray-800">{req.doctorType}</h3>
                        <span className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[app.status]}`}>
                          {STATUS_ICONS[app.status]} {app.status}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                        <span>📅</span>
                        <span>
                          {new Date(req.appointmentDate).toLocaleDateString('de-DE', {
                            weekday: 'short', day: 'numeric', month: 'short',
                            hour: '2-digit', minute: '2-digit',
                          })}
                          {isUpcoming && days <= 7 && (
                            <span className="ml-1.5 font-medium text-teal-700">
                              (in {days === 0 ? 'today' : days === 1 ? '1 day' : `${days} days`})
                            </span>
                          )}
                        </span>
                      </div>

                      <p className="mt-0.5 truncate text-sm text-gray-400">
                        📍 {req.appointmentAddress}
                      </p>

                      <p className="mt-1.5 text-sm font-semibold text-teal-700">€{req.budget}</p>

                      {app.status === 'accepted' && req.matchId && (
                        <div className="mt-3 border-t pt-3">
                          <Link
                            href={`/${locale}/chat/${req.matchId}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-1.5 text-sm font-semibold text-white hover:bg-teal-800"
                          >
                            💬 Open Chat
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
