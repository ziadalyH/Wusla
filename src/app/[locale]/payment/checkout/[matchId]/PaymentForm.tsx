'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'

function CheckoutForm({ matchId, locale }: { matchId: string; locale: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError('')

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/${locale}/payment/success?matchId=${matchId}`,
      },
    })

    if (stripeError) {
      setError(stripeError.message || 'Payment failed')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  )
}

export default function PaymentForm({
  matchId,
  amount,
  locale,
  publishableKey,
}: {
  matchId: string
  amount: number
  locale: string
  publishableKey: string
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState('')
  const stripePromise = loadStripe(publishableKey)

  useEffect(() => {
    fetch('/api/payments/intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.clientSecret) setClientSecret(data.clientSecret)
        else setError(data.error || 'Could not load payment')
      })
      .catch(() => setError('Could not load payment'))
  }, [matchId])

  if (error) return <p className="text-sm text-red-600">{error}</p>
  if (!clientSecret) return <p className="text-center text-sm text-gray-400">Loading payment...</p>

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm matchId={matchId} locale={locale} />
    </Elements>
  )
}
