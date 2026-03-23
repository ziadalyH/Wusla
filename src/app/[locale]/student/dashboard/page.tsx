import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/db'
import Request from '@/models/Request'
import User from '@/models/User'
import Link from 'next/link'
import Image from 'next/image'

const LANG_LABELS: Record<string, string> = {
  ar: 'Arabic',
  ku: 'Kurdish',
  en: 'English',
  de: 'German',
  tr: 'Turkish',
  fa: 'Farsi',
  so: 'Somali',
  fr: 'French',
}

function daysUntil(date: Date | string): number {
  return Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

function formatAppointment(date: Date | string): string {
  const d = new Date(date)
  const weekday = d.toLocaleDateString('en-GB', { weekday: 'short' })
  const day = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return `${weekday} ${day} · ${time}`
}

export default async function StudentDashboard({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await auth()
  if (!session?.user || session.user.role !== 'student') {
    redirect(`/${locale}/auth/signin`)
  }

  await connectDB()

  const student = await User.findById(session.user.id).lean()
  const languages = student?.languages || []

  const requests = await Request.find({
    status: 'open',
    ...(languages.length > 0 ? { languagesNeeded: { $in: languages } } : {}),
    appointmentDate: { $gt: new Date() },
  })
    .populate('refugeeId', 'name')
    .sort({ appointmentDate: 1 })
    .limit(30)
    .lean()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/student-refugee.png"
              alt=""
              width={48}
              height={48}
              unoptimized
              className="rounded-full object-cover"
              style={{ width: 48, height: 48 }}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Available Requests</h1>
              <p className="text-sm text-gray-500">
                Filtered by your languages: {languages.map((l: string) => LANG_LABELS[l] || l).join(', ') || 'all'}
              </p>
            </div>
          </div>
          <Link
            href={`/${locale}/student/applications`}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            My Sessions
          </Link>
        </div>

        {!student?.stripeOnboarded && (
          <div className="mb-6 rounded-xl border border-yellow-300 bg-yellow-50 p-4">
            <p className="text-sm font-medium text-yellow-800">
              Set up your payment account to be accepted for requests.{' '}
              <Link href={`/${locale}/student/earnings`} className="underline">
                Set up now
              </Link>
            </p>
          </div>
        )}

        {requests.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow">
            <div className="mb-4 text-5xl">🔍</div>
            <p className="text-gray-500">No open requests matching your languages.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => {
              const days = daysUntil(req.appointmentDate)
              const isUrgent = days <= 3

              return (
                <div
                  key={req._id.toString()}
                  className="rounded-2xl bg-white p-5 shadow-lg"
                  style={{ border: '1px solid #E5E7EB' }}
                >
                  {/* Top row */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {req.languagesNeeded.slice(0, 2).map((l: string) => (
                        <span
                          key={l}
                          style={{ backgroundColor: '#F0FDF4', color: '#15803D', borderRadius: '4px' }}
                          className="px-2 py-0.5 text-xs font-semibold uppercase"
                        >
                          {LANG_LABELS[l] || l.toUpperCase()}
                        </span>
                      ))}
                      <span className="text-xs text-gray-400">{req.doctorType}</span>
                    </div>
                    {isUrgent && (
                      <span
                        style={{ backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '4px' }}
                        className="px-2 py-0.5 text-xs font-semibold"
                      >
                        Urgent
                      </span>
                    )}
                  </div>

                  {/* Address as main title */}
                  <p className="font-semibold text-gray-900">{req.appointmentAddress}</p>

                  {/* Date */}
                  <p className="mt-1 text-sm text-gray-500">{formatAppointment(req.appointmentDate)}</p>

                  {/* Budget + Apply */}
                  <div className="mt-3 flex items-center justify-between">
                    <span style={{ color: 'var(--student-accent)' }} className="text-base font-bold">
                      €{req.budget}
                    </span>
                    <Link
                      href={`/${locale}/student/requests/${req._id}`}
                      style={{ backgroundColor: 'var(--student-primary)', borderRadius: '6px' }}
                      className="px-4 py-1.5 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      Apply
                    </Link>
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
