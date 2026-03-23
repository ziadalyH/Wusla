'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import Image from 'next/image'

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

const LOCALES = [
  { value: 'ar', label: 'العربية' },
  { value: 'ku', label: 'کوردی' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
]

export default function RegisterStudentPage() {
  const { locale } = useParams<{ locale: string }>()
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    preferredLocale: locale || 'en',
    languages: [] as string[],
    university: '',
    bio: '',
    locationLabel: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleLocaleChange(newLocale: string) {
    setForm({ ...form, preferredLocale: newLocale })
    router.push(`/${newLocale}/auth/signup/student`)
  }

  function toggleLanguage(lang: string) {
    setForm((f) => ({
      ...f,
      languages: f.languages.includes(lang)
        ? f.languages.filter((l) => l !== lang)
        : [...f.languages, lang],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.languages.length === 0) {
      setError('Please select at least one language')
      return
    }
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, role: 'student' }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Registration failed')
      setLoading(false)
      return
    }

    await signIn('credentials', { email: form.email, password: form.password, redirect: false })
    router.push(`/${locale}/student/dashboard`)
    router.refresh()
  }

  return (
    <div style={{ backgroundColor: 'var(--student-surface)' }} className="min-h-screen">
      <div className="mx-auto flex max-w-5xl flex-col md:flex-row">

        {/* ── Left: Value prop ──────────────────────────────── */}
        <div className="flex flex-col justify-center px-10 py-16 md:w-1/2">
          {/* Back */}
          <Link
            href={`/${locale}`}
            style={{ color: 'var(--student-text-muted)' }}
            className="mb-10 flex items-center gap-1 text-sm hover:opacity-70"
          >
            ← Back
          </Link>

          {/* Wordmark */}
          <div className="mb-8 flex items-center gap-2">
            <Image src="/wusla-mark.svg" alt="" width={32} height={18} />
            <span
              style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.04em', color: 'var(--student-text)', fontSize: '1.25rem', fontWeight: 700 }}
            >
              wusla
            </span>
          </div>

          <Image
            src="/student-refugee.png"
            alt=""
            width={80}
            height={80}
            unoptimized
            className="mb-6 rounded-full object-cover"
            style={{ width: 80, height: 80 }}
          />

          <h1
            style={{ color: 'var(--student-text)', letterSpacing: '-0.025em', lineHeight: 1.2 }}
            className="mb-4 text-3xl font-bold"
          >
            Turn your languages<br />into income.
          </h1>
          <p style={{ color: 'var(--student-text-muted)' }} className="mb-8 leading-relaxed">
            68% of German students already work a side job. Make yours count —
            3 million refugees in Germany need someone who speaks their language at the
            doctor. You have that skill. Wusla pays you to use it.
          </p>

          {/* Earnings highlight */}
          <div
            style={{ backgroundColor: 'var(--student-accent-light)', borderRadius: '12px', border: '1px solid #80C8C5' }}
            className="mb-8 p-5"
          >
            <div className="flex items-baseline gap-2">
              <span style={{ color: 'var(--student-accent)', letterSpacing: '-0.03em' }} className="text-4xl font-bold">€20</span>
              <span style={{ color: 'var(--student-text-muted)' }} className="text-sm">average per session</span>
            </div>
            <p style={{ color: 'var(--student-text-muted)' }} className="mt-1 text-xs">
              Paid directly to your bank account via Stripe after every visit.
            </p>
          </div>

          <ul className="mb-8 space-y-3">
            {[
              ['⏱️', 'Flexible — 2–3 hours per visit, whenever you want'],
              ['📍', 'Near your university — no long commutes'],
              ['🤝', 'Real impact, real connection, real pay'],
              ['📈', 'Builds your CV: intercultural competence & healthcare navigation'],
            ].map(([icon, text]) => (
              <li key={text} className="flex items-start gap-3">
                <span className="mt-0.5 text-lg leading-none">{icon}</span>
                <span style={{ color: 'var(--student-text)' }} className="text-sm leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
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
                    ? { backgroundColor: 'var(--student-primary)', color: '#fff' }
                    : { backgroundColor: '#fff', color: '#6B7280' }
                }
                className="rounded-full px-3 py-1 text-sm font-medium transition hover:opacity-80"
              >
                {l.label}
              </button>
            ))}
          </div>

          <div
            className="rounded-2xl bg-white p-8 shadow-sm"
            style={{ border: '1px solid var(--student-border)' }}
          >
            <h2 style={{ color: 'var(--student-text)' }} className="mb-6 text-xl font-bold">
              Create your account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{ borderRadius: '8px' }}
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
                  style={{ borderRadius: '8px' }}
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
                  style={{ borderRadius: '8px' }}
                  className="mt-1 w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Languages you speak</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.value}
                      type="button"
                      onClick={() => toggleLanguage(lang.value)}
                      style={
                        form.languages.includes(lang.value)
                          ? { backgroundColor: 'var(--student-primary)', color: '#fff', borderRadius: '999px' }
                          : { backgroundColor: '#E6F4F3', color: '#0B6E68', borderRadius: '999px' }
                      }
                      className="px-3 py-1 text-sm font-medium transition"
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">University</label>
                <input
                  type="text"
                  value={form.university}
                  onChange={(e) => setForm({ ...form, university: e.target.value })}
                  style={{ borderRadius: '8px' }}
                  className="mt-1 w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                  placeholder="e.g. TU Berlin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  value={form.locationLabel}
                  onChange={(e) => setForm({ ...form, locationLabel: e.target.value })}
                  style={{ borderRadius: '8px' }}
                  className="mt-1 w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
                  placeholder="e.g. Berlin"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: 'var(--student-primary)', borderRadius: '8px' }}
                className="w-full py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <div className="mt-5 space-y-2 text-center text-sm text-gray-500">
              <p>
                Already have an account?{' '}
                <Link href={`/${locale}/auth/signin`} style={{ color: 'var(--student-primary)' }} className="font-medium hover:underline">
                  Sign in
                </Link>
              </p>
              <p>
                Looking for a companion?{' '}
                <Link href={`/${locale}/auth/signup/refugee`} className="font-medium text-gray-700 hover:underline">
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
