import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import User from '@/models/User'
import stripe from '@/lib/stripe'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const accountId = searchParams.get('accountId')

  if (!accountId) {
    return NextResponse.redirect(new URL('/en/student/earnings', req.url))
  }

  const account = await stripe.accounts.retrieve(accountId)

  if (account.details_submitted) {
    await connectDB()
    await User.findOneAndUpdate(
      { stripeAccountId: accountId },
      { stripeOnboarded: true }
    )
  }

  return NextResponse.redirect(new URL('/en/student/earnings', req.url))
}
