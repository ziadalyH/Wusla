import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Request from '@/models/Request'
import { getSettings } from '@/models/Settings'
import { createRequestSchema } from '@/lib/validations/request.schema'
import { geocodeAddress } from '@/lib/geocoding'

// GET /api/requests — student feed (open requests filtered by language)
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 20
  const lang = searchParams.get('lang')

  const filter: Record<string, unknown> = { status: 'open' }
  if (lang) {
    filter.languagesNeeded = lang
  }

  const [requests, total] = await Promise.all([
    Request.find(filter)
      .populate('refugeeId', 'name avatar')
      .sort({ appointmentDate: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Request.countDocuments(filter),
  ])

  return NextResponse.json({ requests, total, page, pages: Math.ceil(total / limit) })
}

// POST /api/requests — refugee creates a request
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'refugee') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = createRequestSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  await connectDB()

  try {
    const settings = await getSettings()
    const addressCoords = await geocodeAddress(parsed.data.appointmentAddress)

    const request = await Request.create({
      ...parsed.data,
      appointmentDate: new Date(parsed.data.appointmentDate),
      refugeeId: session.user.id,
      matchingMode: settings.matchingMode,
      addressCoords: addressCoords || undefined,
    })

    return NextResponse.json({ request }, { status: 201 })
  } catch (err) {
    console.error('Create request error:', err)
    return NextResponse.json({ error: 'Failed to save request' }, { status: 500 })
  }
}
