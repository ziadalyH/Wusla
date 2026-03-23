import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { getSettings } from '@/models/Settings'
import Settings from '@/models/Settings'

export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const settings = await getSettings()
  return NextResponse.json({ settings })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const body = await req.json()

  const settings = await getSettings()
  const allowed = ['matchingMode', 'platformFeePercent', 'maintenanceMode']

  allowed.forEach((key) => {
    if (body[key] !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(settings as any)[key] = body[key]
    }
  })

  settings.updatedBy = session.user.id as unknown as typeof settings.updatedBy

  await settings.save()
  return NextResponse.json({ settings })
}
