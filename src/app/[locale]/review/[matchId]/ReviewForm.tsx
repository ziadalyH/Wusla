'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ReviewForm({
  matchId,
  locale,
  revieweeName,
}: {
  matchId: string
  locale: string
  revieweeName: string
}) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    if (rating === 0) { setError('Please select a rating'); return }
    setLoading(true)
    setError('')

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId, rating, comment }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) { setError(data.error || 'Failed to submit'); return }
    router.push(`/${locale}/refugee/dashboard`)
    router.refresh()
  }

  return (
    <div className="space-y-5">
      {/* Star rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="text-3xl transition-transform hover:scale-110"
            >
              <span className={star <= (hovered || rating) ? 'text-yellow-400' : 'text-gray-300'}>
                ★
              </span>
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="mt-1 text-sm text-gray-500">
            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comment (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={300}
          placeholder={`Share your experience with ${revieweeName}...`}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-teal-700 focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={submit}
        disabled={loading}
        className="w-full rounded-lg bg-teal-700 py-2.5 font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  )
}
