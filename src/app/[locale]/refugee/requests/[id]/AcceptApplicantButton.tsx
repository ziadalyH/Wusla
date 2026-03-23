'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AcceptApplicantButton({
  applicationId,
  canAccept,
  locale,
  requestId,
}: {
  applicationId: string
  canAccept: boolean
  locale: string
  requestId: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function accept() {
    if (!canAccept) return
    setLoading(true)

    const res = await fetch(`/api/applications/${applicationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'accept' }),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok && data.matchId) {
      router.push(`/${locale}/chat/${data.matchId}`)
    } else {
      alert(data.error || 'Failed to accept')
    }
  }

  async function reject() {
    setLoading(true)
    await fetch(`/api/applications/${applicationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject' }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={accept}
        disabled={loading || !canAccept}
        title={!canAccept ? 'Student has not set up payments yet' : ''}
        className="rounded-lg bg-teal-700 px-4 py-1.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-40"
      >
        {loading ? '...' : 'Accept'}
      </button>
      <button
        onClick={reject}
        disabled={loading}
        className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
      >
        Reject
      </button>
    </div>
  )
}
