import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Application from '@/models/Application'
import User from '@/models/User'
import { acceptApplication } from './accept'

type Params = { params: Promise<{ id: string }> }

// PATCH /api/applications/[id] — accept, reject, or withdraw
export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const { action } = body as { action: 'accept' | 'reject' | 'withdraw' }

  if (!['accept', 'reject', 'withdraw'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  await connectDB()

  const application = await Application.findById(id).populate('requestId')
  if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const request = application.requestId as unknown as { refugeeId: { toString: () => string }; status: string }

  if (action === 'withdraw') {
    if (application.studentId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    application.status = 'withdrawn'
    await application.save()
    return NextResponse.json({ success: true })
  }

  // accept or reject — only the refugee who owns the request can do this
  if (request.refugeeId.toString() !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (request.status !== 'open') {
    return NextResponse.json({ error: 'Request is no longer open' }, { status: 400 })
  }

  if (action === 'reject') {
    application.status = 'rejected'
    await application.save()
    return NextResponse.json({ success: true })
  }

  if (action === 'accept') {
    // Check student is Stripe onboarded
    const student = await User.findById(application.studentId)
    if (!student?.stripeOnboarded) {
      return NextResponse.json(
        { error: 'This student has not set up their payment account yet' },
        { status: 400 }
      )
    }

    const { matchId } = await acceptApplication(id)
    return NextResponse.json({ matchId })
  }
}
