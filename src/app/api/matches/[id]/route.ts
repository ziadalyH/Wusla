import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Match from '@/models/Match'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await connectDB()

  const match = await Match.findById(id)
    .populate('refugeeId', 'name avatar')
    .populate('studentId', 'name avatar languages university bio averageRating')
    .populate('requestId')
    .lean()

  if (!match) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const m = match as typeof match & {
    refugeeId: { _id: { toString: () => string } }
    studentId: { _id: { toString: () => string } }
  }

  if (
    m.refugeeId._id.toString() !== session.user.id &&
    m.studentId._id.toString() !== session.user.id &&
    session.user.role !== 'admin'
  ) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json({ match })
}
