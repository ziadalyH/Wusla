import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Request from '@/models/Request'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await connectDB()

  const request = await Request.findById(id).populate('refugeeId', 'name avatar').lean()
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ request })
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'refugee') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  await connectDB()

  const request = await Request.findById(id)
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (request.refugeeId.toString() !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (request.status !== 'open') {
    return NextResponse.json({ error: 'Cannot edit a non-open request' }, { status: 400 })
  }

  const body = await req.json()
  const allowed = ['doctorType', 'appointmentDate', 'appointmentAddress', 'notes', 'budget', 'languagesNeeded']
  allowed.forEach((key) => {
    if (body[key] !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(request as any)[key] = body[key]
    }
  })

  await request.save()
  return NextResponse.json({ request })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'refugee') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  await connectDB()

  const request = await Request.findById(id)
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (request.refugeeId.toString() !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (request.status !== 'open') {
    return NextResponse.json({ error: 'Cannot cancel a non-open request' }, { status: 400 })
  }

  request.status = 'cancelled'
  await request.save()

  return NextResponse.json({ success: true })
}
