import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import Match from '@/models/Match'
import User from '@/models/User'
import stripe from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'refugee') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { matchId } = await req.json()
  await connectDB()

  const match = await Match.findById(matchId)
  if (!match || match.refugeeId.toString() !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (match.status !== 'visit_done') {
    return NextResponse.json({ error: 'Visit not confirmed yet' }, { status: 400 })
  }

  if (match.stripePaymentIntentId) {
    // Return existing intent
    const intent = await stripe.paymentIntents.retrieve(match.stripePaymentIntentId)
    return NextResponse.json({ clientSecret: intent.client_secret })
  }

  const student = await User.findById(match.studentId)
  if (!student?.stripeAccountId) {
    return NextResponse.json({ error: 'Student payment account not set up' }, { status: 400 })
  }

  const amountCents = Math.round(match.agreedAmount * 100)
  const feePercent = match.platformFeePercent / 100
  const feeCents = Math.round(amountCents * feePercent)

  const intent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: 'eur',
    application_fee_amount: feeCents,
    transfer_data: {
      destination: student.stripeAccountId,
    },
    metadata: {
      matchId: matchId,
      refugeeId: session.user.id,
      studentId: match.studentId.toString(),
    },
  })

  match.stripePaymentIntentId = intent.id
  await match.save()

  return NextResponse.json({ clientSecret: intent.client_secret })
}
