'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

const DOCTOR_TYPES = [
  'General Practitioner',
  'Dentist',
  'Gynecologist',
  'Pediatrician',
  'Psychiatrist',
  'Specialist',
  'Emergency',
  'Other',
]

const LANGUAGES = [
  { value: 'ar', label: 'Arabic' },
  { value: 'ku', label: 'Kurdish' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'German' },
  { value: 'tr', label: 'Turkish' },
  { value: 'fa', label: 'Farsi/Dari' },
  { value: 'so', label: 'Somali' },
  { value: 'fr', label: 'French' },
]

export default function NewRequestPage() {
  const { locale } = useParams<{ locale: string }>()
  const router = useRouter()

  const [form, setForm] = useState({
    doctorType: 'General Practitioner',
    appointmentDate: '',
    appointmentAddress: '',
    languagesNeeded: [] as string[],
    notes: '',
    budget: 20,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function toggleLanguage(lang: string) {
    setForm((f) => ({
      ...f,
      languagesNeeded: f.languagesNeeded.includes(lang)
        ? f.languagesNeeded.filter((l) => l !== lang)
        : [...f.languagesNeeded, lang],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.appointmentDate) {
      setError('Please select an appointment date')
      return
    }
    if (form.languagesNeeded.length === 0) {
      setError('Please select at least one language')
      return
    }
    if (!form.appointmentAddress.trim()) {
      setError('Please enter the doctor\'s address')
      return
    }
    setLoading(true)
    setError('')

    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to create request')
      setLoading(false)
      return
    }

    router.push(`/${locale}/refugee/dashboard`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">New Request</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Doctor Type</label>
            <select
              value={form.doctorType}
              onChange={(e) => setForm({ ...form, doctorType: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
            >
              {DOCTOR_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Appointment Date & Time
            </label>
            <input
              type="datetime-local"
              value={form.appointmentDate}
              onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
              min={new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Doctor&apos;s Address
            </label>
            <input
              type="text"
              value={form.appointmentAddress}
              onChange={(e) => setForm({ ...form, appointmentAddress: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. Hauptstraße 1, 10117 Berlin"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Languages you need help with
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.value}
                  type="button"
                  onClick={() => toggleLanguage(lang.value)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                    form.languagesNeeded.includes(lang.value)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Budget (€)
            </label>
            <input
              type="number"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
              min={5}
              max={500}
              required
            />
            <p className="mt-1 text-xs text-gray-400">
              Suggested: €20. You can adjust based on visit complexity.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes (optional)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
              rows={3}
              maxLength={500}
              placeholder="Any additional context for the companion..."
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Request'}
          </button>
        </form>
      </div>
    </div>
  )
}
