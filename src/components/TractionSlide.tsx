'use client'

import Image from 'next/image'

const ORANGE = '#EA580C'
const TEAL   = '#0B6E68'

const WORKERS = [
  {
    logo: '/logo-caritas.png',
    org: 'Caritas',
    description: 'Germany\'s largest social welfare organisation — present in every city we plan to launch in.',
    color: ORANGE,
    surface: '#FFF7ED',
    border: '#FED7AA',
  },
  {
    logo: '/logo-bellevue.jpg',
    org: 'Bellevue di Monaco',
    description: 'Munich\'s most prominent refugee support house — known for hands-on, community-first care.',
    color: TEAL,
    surface: '#E6F4F3',
    border: '#80C8C5',
  },
  {
    logo: '/logo-care.svg',
    org: 'CARE Deutschland',
    description: 'International humanitarian organisation with direct reach into refugee communities across Germany.',
    color: '#1D4ED8',
    surface: '#EFF6FF',
    border: '#BFDBFE',
  },
]

export default function TractionSlide() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-8 pt-16 pb-0 sm:px-12 sm:pt-20">

        {/* Eyebrow */}
        <p className="mb-5 text-xs font-bold uppercase tracking-widest" style={{ color: ORANGE }}>
          Traction
        </p>

        {/* Headline + hero numbers */}
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">

          <div className="max-w-lg">
            <h2
              className="mb-4 text-2xl font-extrabold text-gray-900 sm:text-3xl"
              style={{ letterSpacing: '-0.03em' }}
            >
              We didn't wait for users.<br />We went straight to the gatekeepers.
            </h2>
            <p className="text-base leading-relaxed text-gray-500">
              Three of Germany's most trusted refugee support organisations have already come on board —
              organisations with direct access to the people Wusla is built for.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex shrink-0 gap-6 lg:gap-8">
            <div className="text-center">
              <p
                className="text-5xl font-black leading-none sm:text-6xl"
                style={{ color: ORANGE, letterSpacing: '-0.04em' }}
              >
                3
              </p>
              <p className="mt-1.5 text-sm font-semibold text-gray-700">organisations</p>
              <p className="text-xs text-gray-400">onboarded</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="text-center">
              <p
                className="text-5xl font-black leading-none sm:text-6xl"
                style={{ color: TEAL, letterSpacing: '-0.04em' }}
              >
                500+
              </p>
              <p className="mt-1.5 text-sm font-semibold text-gray-700">beneficiaries</p>
              <p className="text-xs text-gray-400">in their networks</p>
            </div>
          </div>
        </div>

        {/* Organisation cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {WORKERS.map((w, i) => (
            <div
              key={i}
              className="rounded-2xl p-5"
              style={{ backgroundColor: w.surface, border: `1.5px solid ${w.border}` }}
            >
              {/* Logo */}
              <div className="mb-4 flex h-12 items-center">
                <Image
                  src={w.logo}
                  alt={w.org}
                  width={120}
                  height={48}
                  unoptimized
                  className="h-10 w-auto object-contain"
                />
              </div>

              {/* Org name */}
              <p className="mb-2 text-base font-extrabold text-gray-900">{w.org}</p>

              {/* Description */}
              <p className="text-sm leading-relaxed text-gray-500">{w.description}</p>

              {/* Onboarded pill */}
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1"
                   style={{ backgroundColor: 'white', border: `1px solid ${w.border}` }}>
                <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#16A34A' }} />
                <span className="text-xs font-semibold text-gray-600">Social worker onboarded</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom bar */}
      <div className="mt-12 px-8 py-4 sm:px-12" style={{ backgroundColor: TEAL }}>
        <p className="mx-auto max-w-6xl text-sm text-white">
          <span className="font-semibold">0 paid ads. 0 cold outreach.</span>
          <span className="ml-2 opacity-80">
            Every partnership came through direct conversations within the refugee support network.
          </span>
        </p>
      </div>

    </section>
  )
}
