import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import Request from '@/models/Request'
import Match from '@/models/Match'

export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const [totalUsers, totalStudents, totalRefugees, totalRequests, totalMatches, paidMatches] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'refugee' }),
      Request.countDocuments(),
      Match.countDocuments(),
      Match.find({ status: 'paid' }).select('agreedAmount platformFeePercent').lean(),
    ])

  const revenue = paidMatches.reduce((sum, m) => {
    return sum + m.agreedAmount * (m.platformFeePercent / 100)
  }, 0)

  return NextResponse.json({
    totalUsers,
    totalStudents,
    totalRefugees,
    totalRequests,
    totalMatches,
    revenue: Math.round(revenue * 100) / 100,
  })
}
