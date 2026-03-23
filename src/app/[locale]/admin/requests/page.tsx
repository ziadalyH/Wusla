import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/db'
import Request from '@/models/Request'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-green-100 text-green-700',
  matched: 'bg-blue-100 text-blue-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-600',
}

export default async function AdminRequestsPage({ params }: Props) {
  const { locale } = await params
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') redirect(`/${locale}/auth/signin`)

  await connectDB()

  const requests = await Request.find()
    .populate('refugeeId', 'name email')
    .sort({ createdAt: -1 })
    .limit(100)
    .lean()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Requests ({requests.length})</h1>

      <div className="space-y-3">
        {requests.map((req) => {
          const refugee = req.refugeeId as unknown as { name: string; email: string }
          return (
            <div key={req._id.toString()} className="rounded-2xl bg-white p-4 shadow">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">{req.doctorType}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[req.status]}`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {refugee.name} ({refugee.email})
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(req.appointmentDate).toLocaleDateString('de-DE', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })} • {req.appointmentAddress}
                  </p>
                  <p className="text-sm text-gray-400">
                    Languages: {req.languagesNeeded.join(', ')} •
                    Budget: €{req.budget} •
                    Mode: {req.matchingMode} •
                    {req.applicationCount} applicants
                  </p>
                </div>
                {req.matchId && (
                  <Link
                    href={`/${locale}/chat/${req.matchId}`}
                    className="text-xs text-teal-700 hover:underline"
                  >
                    View chat →
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
