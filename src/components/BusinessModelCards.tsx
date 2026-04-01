'use client'

import { useState } from 'react'

const TIERS = [
  { label: 'Volunteer',  pct: 0,   earn: 0,   tag: 'Give back' },
  { label: 'Support',    pct: 10,  earn: 2,   tag: '10%' },
  { label: 'Part-paid',  pct: 50,  earn: 10,  tag: '50%' },
  { label: 'Full rate',  pct: 100, earn: 20,  tag: '100%' },
]

const PLATFORM_FEE = 2        // €2 flat per visit (10% of avg €20 budget)
const BUDGET       = 20       // refugee's posted budget

export default function BusinessModelCards() {
  const [selectedTier, setSelectedTier] = useState(3) // default: Full rate (100%)

  const tier        = TIERS[selectedTier]
  const studentEarn = tier.earn
  const platformNet = PLATFORM_FEE
  const refugeePays = BUDGET + platformNet   // €22 total charged

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">

      {/* Section header */}
      <p style={{ color: 'var(--student-primary)', letterSpacing: '0.1em' }}
         className="mb-3 text-xs font-semibold uppercase">
        How It Works
      </p>
      <h2 style={{ letterSpacing: '-0.03em' }}
          className="mb-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
        Transparent pricing. Everyone chooses.
      </h2>
      <p className="mb-10 text-base text-gray-500">
        Refugees set the budget. Students name their rate. Wusla takes a small platform fee.
      </p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

        {/* ── Card 1: Refugee sets budget ─────────────────────────── */}
        <div className="rounded-2xl bg-white p-5 shadow-md" style={{ border: '1px solid #E5E7EB' }}>
          <div className="mb-4 flex items-center gap-2">
            <span style={{ backgroundColor: 'var(--refugee-surface)', color: 'var(--refugee-primary)', borderRadius: '6px' }}
                  className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wide">
              Refugee
            </span>
            <span className="text-xs text-gray-400">Posts the request</span>
          </div>

          <p className="text-sm font-semibold text-gray-900">Charité Berlin – Neurologie</p>
          <p className="mt-1 text-xs text-gray-500">Sat 28 Mar · 10:30 – 12:00 · ~1.5h</p>

          {/* Budget input mockup */}
          <div className="mt-4 rounded-xl p-4" style={{ backgroundColor: 'var(--refugee-surface)' }}>
            <p className="mb-1 text-xs text-gray-500">Your budget for this visit</p>
            <div className="flex items-baseline gap-1">
              <span style={{ color: 'var(--refugee-primary)' }} className="text-3xl font-black">
                €{BUDGET}
              </span>
              <span className="text-sm text-gray-400">for ~1.5h</span>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              Suggested: €{(BUDGET / 1.5).toFixed(0)}–€{BUDGET}/h · You decide
            </p>
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2"
               style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#9CA3AF" strokeWidth="1.5"/>
              <path d="M8 5v3.5l2 2" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p className="text-xs text-gray-500">
              +€{platformNet} platform fee added at checkout
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-gray-400">Total charged</span>
            <span className="text-sm font-bold text-gray-800">€{refugeePays}.00</span>
          </div>
        </div>

        {/* ── Card 2: Student picks tier ──────────────────────────── */}
        <div className="rounded-2xl bg-white p-5 shadow-md" style={{ border: '1px solid #E5E7EB' }}>
          <div className="mb-4 flex items-center gap-2">
            <span style={{ backgroundColor: 'var(--student-surface)', color: 'var(--student-primary)', borderRadius: '6px' }}
                  className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wide">
              Student
            </span>
            <span className="text-xs text-gray-400">Chooses their rate</span>
          </div>

          <p className="mb-3 text-sm font-semibold text-gray-900">What do you want to earn?</p>

          <div className="flex flex-col gap-2">
            {TIERS.map((t, i) => {
              const active = i === selectedTier
              return (
                <button
                  key={t.label}
                  onClick={() => setSelectedTier(i)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-left transition"
                  style={{
                    backgroundColor: active ? 'var(--student-surface)' : '#F9FAFB',
                    border: active ? '1.5px solid var(--student-primary)' : '1.5px solid transparent',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full"
                         style={{ border: active ? '2px solid var(--student-primary)' : '2px solid #D1D5DB' }}>
                      {active && (
                        <div className="h-2 w-2 rounded-full"
                             style={{ backgroundColor: 'var(--student-primary)' }} />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{t.label}</span>
                  </div>
                  <div className="text-right">
                    <span style={{ color: active ? 'var(--student-primary)' : '#9CA3AF' }}
                          className="text-sm font-bold">
                      {t.earn === 0 ? 'Free' : `€${t.earn}`}
                    </span>
                    <span className="ml-1 text-xs text-gray-400">({t.tag})</span>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-4 rounded-xl px-4 py-3"
               style={{ backgroundColor: 'var(--student-surface)' }}>
            <p className="text-xs text-gray-500">Your earnings this visit</p>
            <p style={{ color: 'var(--student-primary)' }} className="text-2xl font-black">
              {studentEarn === 0 ? 'Volunteer' : `€${studentEarn}.00`}
            </p>
          </div>
        </div>

        {/* ── Card 3: Wusla platform revenue ─────────────────────── */}
        <div className="rounded-2xl bg-white p-5 shadow-md" style={{ border: '1px solid #E5E7EB' }}>
          <div className="mb-4 flex items-center gap-2">
            <span style={{ backgroundColor: '#F0FDF4', color: '#15803D', borderRadius: '6px' }}
                  className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wide">
              Wusla
            </span>
            <span className="text-xs text-gray-400">Platform fee</span>
          </div>

          <p className="mb-4 text-sm font-semibold text-gray-900">Every visit, every time.</p>

          {/* Flow diagram */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between rounded-lg px-3 py-2"
                 style={{ backgroundColor: 'var(--refugee-surface)' }}>
              <span className="text-xs text-gray-600">Refugee pays</span>
              <span style={{ color: 'var(--refugee-primary)' }} className="text-sm font-bold">€{refugeePays}</span>
            </div>

            <div className="flex justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v12M3 9l5 5 5-5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className="flex items-center justify-between rounded-lg px-3 py-2"
                 style={{ backgroundColor: 'var(--student-surface)' }}>
              <span className="text-xs text-gray-600">Student earns</span>
              <span style={{ color: 'var(--student-primary)' }} className="text-sm font-bold">
                {studentEarn === 0 ? '€0 (volunteer)' : `€${studentEarn}`}
              </span>
            </div>

            <div className="flex justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v12M3 9l5 5 5-5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className="flex items-center justify-between rounded-lg px-3 py-2"
                 style={{ backgroundColor: '#F0FDF4', border: '1.5px solid #BBF7D0' }}>
              <span className="text-xs font-semibold text-gray-700">Wusla keeps</span>
              <span className="text-sm font-bold text-green-700">€{platformNet}</span>
            </div>
          </div>

          <div className="mt-4 rounded-xl p-3 text-center" style={{ backgroundColor: '#F9FAFB' }}>
            <p className="text-lg font-black text-gray-900">10%</p>
            <p className="text-xs text-gray-500">take rate</p>
          </div>
        </div>

      </div>
    </section>
  )
}
