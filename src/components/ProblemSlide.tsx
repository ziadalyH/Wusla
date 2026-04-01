'use client'

const ORANGE = '#EA580C'
const TEAL   = '#0B6E68'

const barriers = [
  {
    title: 'Language is a medical risk',
    body: 'Doctors speak German. Refugees speak Arabic, Kurdish, Farsi, or Ukrainian. Without a real interpreter, diagnoses are missed, instructions go unheard — patients leave not knowing what is wrong with them.',
  },
  {
    title: 'No one to go with',
    body: '42% of refugees who needed care simply didn\'t go. Not from laziness — from having no one to navigate an unfamiliar system with them. Solo visits, in a foreign language, are too overwhelming to face alone.',
  },
  {
    title: 'No reimbursement for interpreters',
    body: 'German law gives no right to a medical interpreter. Statutory insurers reimburse €0 for interpretation. For the first 18 months, care is restricted to emergencies only under AsylbLG §4.',
  },
  {
    title: 'Social workers are stretched to breaking',
    body: 'The people holding this together — social workers, volunteers, NGO coordinators — are doing it on goodwill alone. There is no digital infrastructure. No matching system. No coordination layer.',
  },
]

const stats = [
  {
    n: '3.3M',
    label: 'recognized refugees & protected\npersons in Germany',
    source: 'BAMF 2024 — 4.1% of population',
    color: ORANGE,
  },
  {
    n: '82%',
    label: 'of refugees need help\naccessing medical care',
    source: 'DIW / InfoMigrants study',
    color: TEAL,
  },
  {
    n: '€0',
    label: 'reimbursed by insurers\nfor interpretation services',
    source: 'AIDA Country Report 2024',
    color: '#111827',
  },
]

export default function ProblemSlide() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-8 pb-0 pt-16 sm:px-12 sm:pt-20">

        {/* Eyebrow */}
        <p className="mb-5 text-xs font-bold uppercase tracking-widest" style={{ color: ORANGE }}>
          The Problem
        </p>

        {/* Two-column body */}
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-0">

          {/* ── Left: headline + bullets ─────────────────────── */}
          <div className="flex-1 lg:pr-12">
            <div className="mb-8">
              <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-400">Every day, this happens:</p>
              <div className="mt-3 space-y-1 text-base text-gray-500 leading-relaxed">
                <p>A refugee needs someone to accompany them to a doctor visit.</p>
                <p>They tell their social worker.</p>
                <p>The social worker opens WhatsApp. Calls around. Asks who is free.</p>
                <p className="font-semibold text-gray-800">Every time — manually. Every single time.</p>
              </div>
              <p className="mt-5 text-2xl font-bold text-gray-900 sm:text-3xl md:text-[2rem] leading-snug">
                There is no system that connects the need<br className="hidden sm:block" /> to the right person.
              </p>
            </div>

            <p className="mb-5 text-sm font-semibold" style={{ color: TEAL }}>
              The barriers are real and daily
            </p>

            <ul className="space-y-5">
              {barriers.map((b) => (
                <li key={b.title} className="flex gap-3">
                  {/* Orange dot */}
                  <span
                    className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: ORANGE }}
                  />
                  <div>
                    <p className="mb-0.5 text-sm font-semibold text-gray-900">{b.title}</p>
                    <p className="text-sm leading-relaxed text-gray-500">{b.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Divider ──────────────────────────────────────── */}
          <div className="hidden w-px bg-gray-200 lg:block" />

          {/* ── Right: stats ─────────────────────────────────── */}
          <div className="flex flex-row gap-8 lg:w-56 lg:flex-col lg:gap-0 lg:pl-12">
            {stats.map((s, i) => (
              <div
                key={s.n}
                className={`flex-1 lg:flex-none ${i < stats.length - 1 ? 'lg:mb-10' : ''}`}
              >
                <p className="text-5xl font-black leading-none sm:text-6xl" style={{ color: s.color }}>
                  {s.n}
                </p>
                <p className="mt-2 whitespace-pre-line text-sm leading-snug text-gray-700">
                  {s.label}
                </p>
                <p className="mt-1 text-xs italic text-gray-400">{s.source}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Full-width quote bar ──────────────────────────────── */}
      <div
        className="mt-12 px-8 py-4 sm:px-12"
        style={{ backgroundColor: TEAL }}
      >
        <p className="mx-auto max-w-6xl text-sm text-white">
          <span className="italic">
            "I answer messages at 11pm. Refugees reach out at all hours."
          </span>
          {' '}— Aboodi, Bellevue di Monaco
          <span className="ml-4 text-xs opacity-60">
            · Source: BAMF 2024 · DIW · AIDA 2024 · BMC Health Services Research 2024
          </span>
        </p>
      </div>

    </section>
  )
}
