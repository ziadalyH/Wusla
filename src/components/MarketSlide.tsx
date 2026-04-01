'use client'

// ── Market Opportunity Slide ──────────────────────────────────────────────
// TAM / SAM / SOM
// Formula: Beneficiaries × 9.6 avg doctor visits/yr × €2 platform fee
//
// TAM  Germany-wide   ~9 M beneficiaries  → €172.8 M / yr
// SAM  Key regions    ~2.7 M              → €51.8 M / yr   (excl. Bavaria)
// SOM  Munich         ~200 K              → €3.84 M / yr

const TIERS = [
  {
    key: 'TAM',
    label: 'Total Addressable Market',
    geo: 'Germany — all regions',
    color: 'var(--refugee-primary)',
    surface: 'var(--refugee-surface)',
    border: 'var(--refugee-border)',
    beneficiaries: '~9 M',
    beneficiaryNote: 'Refugees (4 M) · Elderly at-risk (2.9 M) · Single mothers (0.6 M) · Youth (1.5 M)',
    formula: '9,000,000 × 9.6 × €2',
    result: '€172.8 M',
    resultShort: '€173M',
    size: 220,
  },
  {
    key: 'SAM',
    label: 'Serviceable Addressable Market',
    geo: 'Key launch states (excl. Bavaria)',
    color: 'var(--student-primary)',
    surface: 'var(--student-surface)',
    border: 'var(--student-border)',
    beneficiaries: '~2.7 M',
    beneficiaryNote: 'Berlin · Hamburg · NRW · Bremen · Brandenburg · Schleswig-Holstein',
    formula: '2,700,000 × 9.6 × €2',
    result: '€51.8 M',
    resultShort: '€52M',
    size: 155,
  },
  {
    key: 'SOM',
    label: 'Serviceable Obtainable Market',
    geo: 'Munich — initial launch city',
    color: '#0B6E68',
    surface: '#E6F4F3',
    border: '#80C8C5',
    beneficiaries: '~200 K',
    beneficiaryNote: 'Refugees (65K) · Elderly at-risk (67K) · Single mothers (46K) · Youth (16K)',
    formula: '200,000 × 9.6 × €2',
    result: '€3.84 M',
    resultShort: '€3.8M',
    size: 90,
  },
]

export default function MarketSlide() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">

      {/* ── Section header ─────────────────────────────────────────── */}
      <p
        style={{ color: 'var(--refugee-primary)', letterSpacing: '0.1em' }}
        className="mb-3 text-xs font-semibold uppercase"
      >
        Market Opportunity
      </p>
      <h2
        style={{ letterSpacing: '-0.03em' }}
        className="mb-2 text-2xl font-extrabold text-gray-900 sm:text-3xl"
      >
        A massive underserved market in Germany.
      </h2>
      <p className="mb-10 text-base text-gray-500">
        Based on{' '}
        <span className="font-semibold text-gray-700">9.6 doctor visits/person/year</span> (OECD 2023)
        {' '}×{' '}
        <span className="font-semibold text-gray-700">€2 platform fee per visit</span>.
      </p>

      {/* ── Funnel visual (nested circles) ─────────────────────────── */}
      <div className="mb-12 flex items-center justify-center">
        <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>

          {/* TAM — outermost ring */}
          <div
            className="absolute flex items-center justify-center rounded-full"
            style={{
              width: 260,
              height: 260,
              backgroundColor: 'var(--refugee-surface)',
              border: '2px solid var(--refugee-border)',
            }}
          >
            <span
              style={{ color: 'var(--refugee-primary)', top: 14, position: 'absolute' }}
              className="text-xs font-bold uppercase tracking-widest"
            >
              TAM
            </span>
            <span
              style={{ color: 'var(--refugee-primary)', bottom: 14, position: 'absolute' }}
              className="text-sm font-black"
            >
              €173M
            </span>
          </div>

          {/* SAM — middle ring */}
          <div
            className="absolute flex items-center justify-center rounded-full"
            style={{
              width: 175,
              height: 175,
              backgroundColor: 'var(--student-surface)',
              border: '2px solid var(--student-border)',
            }}
          >
            <span
              style={{ color: 'var(--student-primary)', top: 10, position: 'absolute' }}
              className="text-xs font-bold uppercase tracking-widest"
            >
              SAM
            </span>
            <span
              style={{ color: 'var(--student-primary)', bottom: 10, position: 'absolute' }}
              className="text-sm font-black"
            >
              €52M
            </span>
          </div>

          {/* SOM — innermost */}
          <div
            className="absolute flex flex-col items-center justify-center rounded-full"
            style={{
              width: 90,
              height: 90,
              backgroundColor: '#0B6E68',
            }}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-white/70">SOM</span>
            <span className="text-sm font-black text-white">€3.8M</span>
          </div>

        </div>
      </div>

      {/* ── Detail cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.key}
            className="rounded-2xl bg-white p-5 shadow-md"
            style={{ border: '1px solid #E5E7EB' }}
          >
            {/* Card header */}
            <div className="mb-4 flex items-center gap-2">
              <span
                style={{
                  backgroundColor: tier.surface,
                  color: tier.color,
                  borderRadius: '6px',
                }}
                className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wide"
              >
                {tier.key}
              </span>
              <span className="text-xs text-gray-400">{tier.geo}</span>
            </div>

            {/* Label */}
            <p className="mb-1 text-sm font-semibold text-gray-800">{tier.label}</p>

            {/* Beneficiary count */}
            <div
              className="mb-3 rounded-xl px-4 py-3"
              style={{ backgroundColor: tier.surface }}
            >
              <p className="mb-0.5 text-xs text-gray-500">Beneficiaries</p>
              <p
                className="text-2xl font-black"
                style={{ color: tier.color, letterSpacing: '-0.03em' }}
              >
                {tier.beneficiaries}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500">{tier.beneficiaryNote}</p>
            </div>

            {/* Formula */}
            <div
              className="mb-3 flex items-center gap-2 rounded-lg px-3 py-2"
              style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#9CA3AF" strokeWidth="1.5" />
                <path d="M5 8h6M8 5v6" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className="font-mono text-xs text-gray-500">{tier.formula}</p>
            </div>

            {/* Result */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Annual revenue opportunity</span>
              <span
                className="text-lg font-black"
                style={{ color: tier.color, letterSpacing: '-0.03em' }}
              >
                {tier.result}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Source footnote ────────────────────────────────────────── */}
      <p className="mt-6 text-center text-xs text-gray-400">
        Sources: OECD Health at a Glance 2023 · UNHCR Germany 2024 · Destatis · Robert Koch Institut (KiGGS) ·
        Paritätischer Armutsbericht 2024 · Eurostat · BAMF
      </p>

    </section>
  )
}
