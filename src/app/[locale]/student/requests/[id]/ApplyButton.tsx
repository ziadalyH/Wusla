'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ApplyButton({ requestId, locale }: { requestId: string; locale: string }) {
  const router = useRouter()
  const [coverNote, setCoverNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleApply() {
    setLoading(true)
    setError('')

    const res = await fetch(`/api/requests/${requestId}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coverNote }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Failed to apply')
      return
    }

    if (data.matched) {
      router.push(`/${locale}/chat/${data.application.matchId || ''}`)
    } else {
      router.push(`/${locale}/student/applications`)
    }
  }

  return (
    <div className="space-y-3">
      <textarea
        value={coverNote}
        onChange={(e) => setCoverNote(e.target.value)}
        placeholder="Short message to the refugee (optional)..."
        rows={3}
        maxLength={300}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-teal-700 focus:outline-none"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        onClick={handleApply}
        disabled={loading}
        className="w-full rounded-lg bg-teal-700 py-2.5 font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
      >
        {loading ? 'Applying...' : 'Apply for this visit'}
      </button>
    </div>
  )
}
