'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import Image from 'next/image'

const LOCALES = [
  { value: 'ar', label: 'العربية' },
  { value: 'ku', label: 'کوردی' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
]

export default function RegisterRefugeePage() {
  const { locale } = useParams<{ locale: string }>()
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    preferredLocale: locale || 'en',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleLocaleChange(newLocale: string) {
    setForm({ ...form, preferredLocale: newLocale })
    router.push(`/${newLocale}/auth/signup/refugee`)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, role: 'refugee' }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Registration failed')
      setLoading(false)
      return
    }

    await signIn('credentials', { email: form.email, password: form.password, redirect: false })
    router.push(`/${locale}/refugee/dashboard`)
    router.refresh()
  }

  return (
    <div style={{ backgroundColor: 'var(--refugee-surface)' }} className="min-h-screen">
      <div className="mx-auto flex max-w-5xl flex-col md:flex-row">

        {/* ── Left: Value prop ──────────────────────────────── */}
        <div className="flex flex-col justify-center px-10 py-16 md:w-1/2">
          {/* Back */}
          <Link
            href={`/${locale}`}
            style={{ color: 'var(--refugee-text-muted)' }}
            className="mb-10 flex items-center gap-1 text-sm hover:opacity-70"
          >
            ← Back
          </Link>

          {/* Wordmark */}
          <div className="mb-8 flex items-center gap-2">
            <Image src="/wusla-mark.svg" alt="" width={32} height={18} />
            <span
              style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.04em', color: 'var(--refugee-text)', fontSize: '1.25rem', fontWeight: 700 }}
            >
              wusla
            </span>
          </div>

          <Image
            src="/persona-refugee.png"
            alt=""
            width={80}
            height={80}
            unoptimized
            className="mb-6 rounded-full object-cover"
            style={{ width: 80, height: 80 }}
          />

          <h1
            style={{ color: 'var(--refugee-text)', letterSpacing: '-0.025em', lineHeight: 1.2 }}
            className="mb-4 text-3xl font-bold"
          >
            A real companion<br />at your doctor visit.
          </h1>
          <p style={{ color: 'var(--refugee-text-muted)' }} className="mb-8 leading-relaxed">
            Only 1.4% of German doctors speak Arabic, Kurdish, or Farsi.
            Wusla matches you with a student who speaks your language, comes with you
            to the clinic, and helps you understand everything.
          </p>

          <ul className="mb-8 space-y-3">
            {[
              ['🏥', 'In-person at the clinic — not just a phone call'],
              ['🗣️', 'Arabic, Kurdish, Farsi, Somali and more'],
              ['💰', 'You set the budget — starting from €15'],
              ['🔒', 'Pay only after the visit is done'],
            ].map(([icon, text]) => (
              <li key={text} className="flex items-start gap-3">
                <span className="text-lg leading-none mt-0.5">{icon}</span>
                <span style={{ color: 'var(--refugee-text)' }} className="text-sm leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>

          <div
            style={{ backgroundColor: 'var(--refugee-primary-light)', borderRadius: '12px', borderLeft: '3px solid var(--refugee-primary)' }}
            className="p-4"
          >
            <p style={{ color: 'var(--refugee-text)' }} className="text-sm leading-relaxed">
              <strong>Free to join.</strong> You only pay after a successful visit.
              No subscriptions, no hidden fees.
            </p>
          </div>
        </div>

        {/* ── Right: Form ───────────────────────────────────── */}
        <div className="flex flex-col justify-center px-6 py-16 md:w-1/2 md:px-10">
          {/* Language picker */}
          <div className="mb-6 flex gap-2">
            {LOCALES.map((l) => (
              <button
                key={l.value}
                onClick={() => handleLocaleChange(l.value)}
                style={
                  (form.preferredLocale || locale) === l.value
                    ? { backgroundColor: 'var(--refugee-primary)', color: '#fff' }
                    : { backgroundColor: '#fff', color: '#6B7280' }
                }
                className="rounded-full px-3 py-1 text-sm font-medium transition hover:opacity-80"
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm" style={{ border: '1px solid var(--refugee-border)' }}>
            <h2 style={{ color: 'var(--refugee-text)' }} className="mb-6 text-xl font-bold">
              Create your account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{ borderRadius: '10px' }}
                  className="mt-1 w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={{ borderRadius: '10px' }}
                  className="mt-1 w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={{ borderRadius: '10px' }}
                  className="mt-1 w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                  required
                  minLength={8}
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: 'var(--refugee-primary)', borderRadius: '12px' }}
                className="w-full py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <div className="mt-5 space-y-2 text-center text-sm text-gray-500">
              <p>
                Already have an account?{' '}
                <Link href={`/${locale}/auth/signin`} style={{ color: 'var(--refugee-primary)' }} className="font-medium hover:underline">
                  Sign in
                </Link>
              </p>
              <p>
                Are you a student?{' '}
                <Link href={`/${locale}/auth/signup/student`} className="font-medium text-gray-700 hover:underline">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
