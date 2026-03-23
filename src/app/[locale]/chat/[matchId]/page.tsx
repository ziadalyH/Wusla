import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { connectDB } from '@/lib/db'
import Match from '@/models/Match'
import ChatWindow from './ChatWindow'
import ConfirmVisitButton from './ConfirmVisitButton'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string; matchId: string }> }

export default async function ChatPage({ params }: Props) {
  const { locale, matchId } = await params
  const session = await auth()
  if (!session?.user) redirect(`/${locale}/auth/signin`)

  await connectDB()

  const match = await Match.findById(matchId)
    .populate('refugeeId', 'name avatar')
    .populate('studentId', 'name avatar languages university')
    .populate('requestId', 'doctorType appointmentDate appointmentAddress budget')
    .lean()

  if (!match) notFound()

  const isRefugee = (match.refugeeId as { _id: { toString(): string } })._id.toString() === session.user.id
  const isStudent = (match.studentId as { _id: { toString(): string } })._id.toString() === session.user.id

  if (!isRefugee && !isStudent) notFound()

  const refugee = match.refugeeId as unknown as { _id: string; name: string }
  const student = match.studentId as unknown as { _id: string; name: string; university?: string; languages: string[] }
  const request = match.requestId as unknown as {
    doctorType: string; appointmentDate: string; appointmentAddress: string; budget: number
  }

  const otherName = isRefugee ? student.name : refugee.name
  const userAlreadyConfirmed = isRefugee ? match.refugeeConfirmed : match.studentConfirmed

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-4 py-6" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div className="mb-4 rounded-2xl bg-white p-4 shadow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-gray-800">Chat with {otherName}</h1>
            <p className="text-sm text-gray-500">
              {request.doctorType} •{' '}
              {new Date(request.appointmentDate).toLocaleDateString('de-DE', {
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
              })}
            </p>
            <p className="text-sm text-gray-400">{request.appointmentAddress}</p>
          </div>
          <span className="text-xl font-bold text-indigo-600">€{request.budget}</span>
        </div>

        {/* Status bar */}
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${
            match.status === 'active' ? 'bg-blue-100 text-blue-700' :
            match.status === 'visit_done' ? 'bg-green-100 text-green-700' :
            match.status === 'paid' ? 'bg-purple-100 text-purple-700' :
            'bg-gray-100 text-gray-600'
          }`}>
            {match.status === 'active' ? '🏥 Visit upcoming' :
             match.status === 'visit_done' ? '✅ Visit done' :
             match.status === 'paid' ? '💰 Paid' : match.status}
          </span>

          {match.status === 'active' && (
            <ConfirmVisitButton
              matchId={matchId}
              alreadyConfirmed={userAlreadyConfirmed}
              refugeeConfirmed={match.refugeeConfirmed}
              studentConfirmed={match.studentConfirmed}
            />
          )}

          {match.status === 'visit_done' && isRefugee && (
            <Link
              href={`/${locale}/payment/checkout/${matchId}`}
              className="rounded-lg bg-green-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-700"
            >
              💳 Pay Now
            </Link>
          )}

          {match.status === 'paid' && (
            <Link
              href={`/${locale}/review/${matchId}`}
              className="rounded-lg bg-yellow-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-yellow-600"
            >
              ⭐ Leave Review
            </Link>
          )}
        </div>
      </div>

      {/* Chat window */}
      <ChatWindow matchId={matchId} currentUserId={session.user.id} />
    </div>
  )
}
