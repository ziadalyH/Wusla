import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Request from '@/models/Request'
import Application from '@/models/Application'
import User from '@/models/User'
import { runAutoMatch } from '@/app/api/applications/[id]/accept'

type Params = { params: Promise<{ id: string }> }

// GET /api/requests/[id]/applications — refugee sees applicants
export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await connectDB()

  const request = await Request.findById(id)
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Only the refugee who owns the request can see applicants
  if (
    session.user.role !== 'admin' &&
    request.refugeeId.toString() !== session.user.id
  ) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const applications = await Application.find({ requestId: id })
    .populate('studentId', 'name avatar languages university bio averageRating totalReviews stripeOnboarded')
    .sort({ appliedAt: 1 })
    .lean()

  return NextResponse.json({ applications })
}

// POST /api/requests/[id]/applications — student applies
export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'student') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  await connectDB()

  const request = await Request.findById(id)
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (request.status !== 'open') {
    return NextResponse.json({ error: 'Request is no longer open' }, { status: 400 })
  }

  const body = await req.json()

  try {
    const application = await Application.create({
      requestId: id,
      studentId: session.user.id,
      coverNote: body.coverNote || '',
    })

    // Increment counter
    await Request.findByIdAndUpdate(id, { $inc: { applicationCount: 1 } })

    // Handle first_come mode: auto-accept immediately
    if (request.matchingMode === 'first_come') {
      const student = await User.findById(session.user.id)
      if (student?.stripeOnboarded) {
        await runAutoMatch(application._id.toString(), request, session.user.id)
        return NextResponse.json({ application, matched: true }, { status: 201 })
      }
    }

    // Handle auto mode: score all applicants and potentially auto-accept
    if (request.matchingMode === 'auto') {
      await runAutoMatch(application._id.toString(), request, session.user.id)
    }

    return NextResponse.json({ application }, { status: 201 })
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 11000) {
      return NextResponse.json({ error: 'You have already applied' }, { status: 409 })
    }
    throw err
  }
}
