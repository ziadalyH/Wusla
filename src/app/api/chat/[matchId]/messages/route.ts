import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Match from '@/models/Match'
import Message from '@/models/Message'

type Params = { params: Promise<{ matchId: string }> }

async function assertMatchAccess(matchId: string, userId: string) {
  const match = await Match.findById(matchId)
  if (!match) return null
  if (
    match.refugeeId.toString() !== userId &&
    match.studentId.toString() !== userId
  ) {
    return null
  }
  return match
}

// GET — poll for messages (optionally since a timestamp)
export async function GET(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { matchId } = await params
  await connectDB()

  const match = await assertMatchAccess(matchId, session.user.id)
  if (!match) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { searchParams } = new URL(req.url)
  const after = searchParams.get('after')

  const filter: Record<string, unknown> = { matchId }
  if (after) {
    filter.createdAt = { $gt: new Date(after) }
  }

  const messages = await Message.find(filter)
    .populate('senderId', 'name avatar role')
    .sort({ createdAt: 1 })
    .limit(100)
    .lean()

  return NextResponse.json({ messages })
}

// POST — send a message
export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { matchId } = await params
  await connectDB()

  const match = await assertMatchAccess(matchId, session.user.id)
  if (!match) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const text = body.text?.trim()
  if (!text || text.length > 2000) {
    return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
  }

  const message = await Message.create({
    matchId,
    senderId: session.user.id,
    text,
  })

  const populated = await message.populate('senderId', 'name avatar role')
  return NextResponse.json({ message: populated }, { status: 201 })
}
