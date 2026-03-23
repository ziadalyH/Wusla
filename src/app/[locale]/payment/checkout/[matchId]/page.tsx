import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { connectDB } from '@/lib/db'
import Match from '@/models/Match'
import PaymentForm from './PaymentForm'

type Props = { params: Promise<{ locale: string; matchId: string }> }

export default async function CheckoutPage({ params }: Props) {
  const { locale, matchId } = await params
  const session = await auth()
  if (!session?.user || session.user.role !== 'refugee') redirect(`/${locale}/auth/signin`)

  await connectDB()

  const match = await Match.findById(matchId)
    .populate('studentId', 'name')
    .populate('requestId', 'doctorType appointmentDate')
    .lean()

  if (!match) notFound()
  if ((match.refugeeId as unknown as { toString(): string }).toString() !== session.user.id) notFound()
  if (match.status !== 'visit_done') redirect(`/${locale}/chat/${matchId}`)

  const student = match.studentId as unknown as { name: string }
  const request = match.requestId as unknown as { doctorType: string; appointmentDate: string }
  const fee = Math.round(match.agreedAmount * match.platformFeePercent) / 100
  const studentGets = match.agreedAmount - fee

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <div className="rounded-2xl bg-white p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Pay Your Companion</h1>

        <div className="mb-6 space-y-2 rounded-xl bg-gray-50 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Companion</span>
            <span className="font-medium">{student.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Visit</span>
            <span className="font-medium">{request.doctorType}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Date</span>
            <span className="font-medium">
              {new Date(request.appointmentDate).toLocaleDateString('de-DE', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Companion earns</span>
              <span className="font-medium">€{studentGets.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Platform fee ({match.platformFeePercent}%)</span>
              <span className="font-medium">€{fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-bold">
              <span>Total</span>
              <span className="text-indigo-600">€{match.agreedAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <PaymentForm
          matchId={matchId}
          amount={match.agreedAmount}
          locale={locale}
          publishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
        />
      </div>
    </div>
  )
}
