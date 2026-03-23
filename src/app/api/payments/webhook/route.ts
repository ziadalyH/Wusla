import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe'
import { connectDB } from '@/lib/db'
import Match from '@/models/Match'
import Request from '@/models/Request'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object
    const matchId = intent.metadata?.matchId

    if (matchId) {
      await connectDB()
      const match = await Match.findById(matchId)
      if (match && match.status === 'visit_done') {
        match.status = 'paid'
        match.stripePayout = true
        match.paidAt = new Date()
        await match.save()

        await Request.findByIdAndUpdate(match.requestId, { status: 'completed' })
      }
    }
  }

  return NextResponse.json({ received: true })
}
