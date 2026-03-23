import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Match from '@/models/Match'

type Params = { params: Promise<{ id: string }> }

export async function POST(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await connectDB()

  const match = await Match.findById(id)
  if (!match) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const isRefugee = match.refugeeId.toString() === session.user.id
  const isStudent = match.studentId.toString() === session.user.id

  if (!isRefugee && !isStudent) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (match.status !== 'active') {
    return NextResponse.json({ error: 'Match is not active' }, { status: 400 })
  }

  if (isRefugee) match.refugeeConfirmed = true
  if (isStudent) match.studentConfirmed = true

  if (match.refugeeConfirmed && match.studentConfirmed) {
    match.status = 'visit_done'
    match.visitCompletedAt = new Date()
  }

  await match.save()
  return NextResponse.json({ match })
}
