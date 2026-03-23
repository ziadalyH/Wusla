'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ConfirmVisitButton({
  matchId,
  alreadyConfirmed,
  refugeeConfirmed,
  studentConfirmed,
}: {
  matchId: string
  alreadyConfirmed: boolean
  refugeeConfirmed: boolean
  studentConfirmed: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  if (alreadyConfirmed) {
    const otherConfirmed = refugeeConfirmed && studentConfirmed
    return (
      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
        {otherConfirmed ? '✅ Both confirmed' : '✅ You confirmed — waiting for other side'}
      </span>
    )
  }

  async function confirm() {
    setLoading(true)
    await fetch(`/api/matches/${matchId}/complete`, { method: 'POST' })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={confirm}
      disabled={loading}
      className="rounded-lg bg-green-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? '...' : '✅ Confirm visit done'}
    </button>
  )
}
