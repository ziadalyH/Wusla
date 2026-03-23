import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Match from '@/models/Match'
import Message from '@/models/Message'

type Params = { params: Promise<{ matchId: string }> }

export async function POST(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { matchId } = await params
  await connectDB()

  const match = await Match.findById(matchId)
  if (
    !match ||
    (match.refugeeId.toString() !== session.user.id &&
      match.studentId.toString() !== session.user.id)
  ) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await Message.updateMany(
    {
      matchId,
      senderId: { $ne: session.user.id },
      readAt: null,
    },
    { readAt: new Date() }
  )

  return NextResponse.json({ success: true })
}
