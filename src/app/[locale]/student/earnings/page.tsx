import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Match from '@/models/Match'
import StripeConnectButton from './StripeConnectButton'

type Props = { params: Promise<{ locale: string }> }

export default async function EarningsPage({ params }: Props) {
  const { locale } = await params
  const session = await auth()
  if (!session?.user || session.user.role !== 'student') redirect(`/${locale}/auth/signin`)

  await connectDB()

  const user = await User.findById(session.user.id).lean()
  const paidMatches = await Match.find({
    studentId: session.user.id,
    status: 'paid',
  }).populate('requestId', 'doctorType appointmentDate').sort({ paidAt: -1 }).lean()

  const totalEarned = paidMatches.reduce((sum, m) => {
    return sum + m.agreedAmount * (1 - m.platformFeePercent / 100)
  }, 0)

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Earnings</h1>

      {/* Stripe Connect status */}
      <div className="mb-6 rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-3 text-lg font-semibold text-gray-700">Payout Account</h2>
        {user?.stripeOnboarded ? (
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-500" />
            <p className="text-sm font-medium text-green-700">Payment account connected</p>
          </div>
        ) : (
          <div>
            <p className="mb-3 text-sm text-gray-500">
              Set up your Stripe account to receive payments from refugees.
            </p>
            <StripeConnectButton />
          </div>
        )}
      </div>

      {/* Total */}
      <div className="mb-6 rounded-2xl bg-indigo-600 p-6 text-white shadow">
        <p className="text-sm opacity-80">Total Earned</p>
        <p className="mt-1 text-4xl font-bold">€{totalEarned.toFixed(2)}</p>
        <p className="mt-1 text-sm opacity-70">{paidMatches.length} completed visits</p>
      </div>

      {/* History */}
      <h2 className="mb-3 text-lg font-semibold text-gray-700">Payment History</h2>
      {paidMatches.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow">
          <p className="text-gray-400">No payments yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paidMatches.map((m) => {
            const req = m.requestId as unknown as { doctorType: string; appointmentDate: string }
            const earned = m.agreedAmount * (1 - m.platformFeePercent / 100)
            return (
              <div key={m._id.toString()} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow">
                <div>
                  <p className="font-medium text-gray-800">{req.doctorType}</p>
                  <p className="text-sm text-gray-500">
                    {m.paidAt ? new Date(m.paidAt).toLocaleDateString('de-DE') : ''}
                  </p>
                </div>
                <span className="text-lg font-bold text-green-600">+€{earned.toFixed(2)}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
