import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import { registerRefugeeSchema, registerStudentSchema } from '@/lib/validations/user.schema'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { role } = body

    if (role !== 'refugee' && role !== 'student') {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const schema = role === 'refugee' ? registerRefugeeSchema : registerStudentSchema
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    await connectDB()

    const existing = await User.findOne({ email: parsed.data.email })
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12)

    const { password: _pw, ...rest } = parsed.data as typeof parsed.data & { password?: string }
    await User.create({
      ...rest,
      role,
      passwordHash,
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
