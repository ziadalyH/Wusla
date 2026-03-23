'use client'

import { useState } from 'react'

export default function StripeConnectButton() {
  const [loading, setLoading] = useState(false)

  async function handleConnect() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/connect')
      const text = await res.text()
      let data: { url?: string; error?: string }
      try {
        data = JSON.parse(text)
      } catch {
        console.error('Non-JSON response:', text)
        alert('Stripe Connect is not enabled on your account. Go to dashboard.stripe.com → Settings → Connect and enable it first.')
        setLoading(false)
        return
      }
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Failed to connect Stripe')
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      alert('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleConnect}
      disabled={loading}
      className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
    >
      {loading ? 'Loading...' : 'Set up payouts with Stripe'}
    </button>
  )
}
