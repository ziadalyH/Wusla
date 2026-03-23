'use client'

import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

const LOCALES = [
  { value: 'ar', label: 'العربية' },
  { value: 'ku', label: 'کوردی' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
]

export default function HomePage() {
  const locale = useLocale()
  const router = useRouter()

  return (
    <div className="flex flex-col bg-white">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:gap-16 md:py-28">

        {/* Left: Content */}
        <div>
          {/* Eyebrow */}
          <p style={{ color: 'var(--refugee-primary)', letterSpacing: '0.1em' }}
             className="mb-4 text-xs font-semibold uppercase">
            Wusla · Germany
          </p>

          {/* Headline */}
          <h1 style={{ letterSpacing: '-0.03em', lineHeight: 1.1 }}
              className="mb-5 text-4xl font-extrabold text-gray-900 md:text-5xl">
            Medical visits shouldn&rsquo;t require a translator you don&rsquo;t have.
          </h1>

          {/* Sub-headline */}
          <p className="mb-8 text-lg leading-relaxed text-gray-500">
            Wusla connects refugees in Germany with bilingual student companions
            for doctor visits, specialist appointments, and hospital stays.
          </p>

          {/* 1.4% Stat Callout */}
          <div style={{
            borderLeft: '3px solid var(--refugee-primary)',
            backgroundColor: 'var(--refugee-surface)',
            borderRadius: '10px',
          }} className="mb-8 px-5 py-4">
            <div className="flex items-baseline gap-3">
              <span style={{ color: 'var(--refugee-primary)', letterSpacing: '-0.04em' }}
                    className="text-4xl font-black">
                1.4%
              </span>
              <p className="text-sm text-gray-600">
                of doctors in Germany speak Arabic or Kurdish
              </p>
            </div>
            <p className="mt-1 text-xs text-gray-400">BMC Primary Care, 2022</p>
          </div>

          {/* Language picker */}
          <div className="mb-8 flex flex-wrap gap-2">
            {LOCALES.map((l) => (
              <button
                key={l.value}
                onClick={() => router.push(`/${l.value}`)}
                style={locale === l.value
                  ? { backgroundColor: 'var(--refugee-primary)', color: '#fff' }
                  : { backgroundColor: '#F3F4F6', color: '#374151' }}
                className="rounded-full px-4 py-1.5 text-sm font-medium transition hover:opacity-80"
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/auth/signup/refugee`}
              style={{ backgroundColor: 'var(--refugee-primary)', borderRadius: '14px' }}
              className="px-7 py-3.5 text-base font-semibold text-white transition hover:opacity-90"
            >
              I need a companion
            </Link>
            <Link
              href={`/${locale}/auth/signup/student`}
              style={{ backgroundColor: 'var(--student-primary)', borderRadius: '8px' }}
              className="px-7 py-3.5 text-base font-semibold text-white transition hover:opacity-90"
            >
              I want to help & earn
            </Link>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Available in Berlin · Hamburg · Munich · Expanding 2026
          </p>
        </div>

        {/* Right: Product preview cards */}
        <div className="relative hidden md:block">
          {/* Background split */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div style={{ backgroundColor: 'var(--refugee-surface)' }} className="absolute inset-x-0 top-0 h-1/2" />
            <div style={{ backgroundColor: 'var(--student-surface)' }} className="absolute inset-x-0 bottom-0 h-1/2" />
          </div>

          <div className="relative p-8">
            {/* Card 1: Student sees a request */}
            <div className="mb-4 rounded-2xl bg-white p-5 shadow-lg" style={{ border: '1px solid #E5E7EB' }}>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    src="/persona-refugee.png"
                    alt=""
                    width={44}
                    height={44}
                    unoptimized
                    className="rounded-full object-cover"
                    style={{ width: 44, height: 44 }}
                  />
                  <span style={{ backgroundColor: '#E6F4F3', color: '#0B6E68', borderRadius: '4px' }}
                        className="px-2 py-0.5 text-xs font-semibold uppercase">
                    Arabic
                  </span>
                  <span className="text-xs text-gray-400">Specialist visit</span>
                </div>
                <span style={{ backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '4px' }}
                      className="px-2 py-0.5 text-xs font-semibold">
                  Urgent
                </span>
              </div>
              <p className="font-semibold text-gray-900">Charité Berlin – Neurologie</p>
              <p className="mt-1 text-sm text-gray-500">Sat 28 Mar · 10:30 – 12:00</p>
              <p className="mt-0.5 text-sm text-gray-400">Mitte · ~3.2 km from you</p>
              <div className="mt-3 flex items-center justify-between">
                <span style={{ color: 'var(--student-accent)' }} className="text-base font-bold">
                  €22.50 <span className="text-xs font-normal text-gray-400">for ~1.5h</span>
                </span>
                <button
                  style={{ backgroundColor: 'var(--student-primary)', borderRadius: '6px' }}
                  className="px-4 py-1.5 text-sm font-semibold text-white"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Card 2: Refugee's match confirmed */}
            <div className="rounded-2xl bg-white p-5 shadow-lg" style={{ border: '1px solid #E5E7EB' }}>
              <div className="mb-3 flex items-center gap-2">
                <div style={{ backgroundColor: 'var(--student-accent)', width: 8, height: 8, borderRadius: '50%' }} />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Companion confirmed</span>
              </div>
              <div className="flex items-center gap-3">
                <Image
                  src="/student-refugee.png"
                  alt="Ali K."
                  width={44}
                  height={44}
                  unoptimized
                  className="flex-shrink-0 rounded-full object-cover"
                  style={{ width: 44, height: 44 }}
                />
                <div>
                  <p className="font-semibold text-gray-900">Ali K.</p>
                  <p className="text-sm text-gray-500">FU Berlin · Medicine · 3rd year</p>
                  <div className="mt-1 flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill={i <= 4 ? '#D97706' : '#E5E7EB'}>
                        <path d="M6 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6 9 2.5 10.5l.5-3.5L.5 4.5 4 4z"/>
                      </svg>
                    ))}
                    <span className="text-xs font-medium text-gray-500 ml-1">4.9</span>
                  </div>
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--refugee-surface)', borderRadius: '8px' }}
                   className="mt-3 flex items-center justify-between px-3 py-2">
                <span className="text-sm text-gray-600">28 Mar · Charité Mitte</span>
                <span style={{ color: 'var(--refugee-primary)' }} className="text-sm font-semibold">View →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
