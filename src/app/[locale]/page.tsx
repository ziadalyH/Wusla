'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import BusinessModelCards from '@/components/BusinessModelCards'
import CompetitionMatrix from '@/components/CompetitionMatrix'
import ProblemSlide from '@/components/ProblemSlide'
import MarketSlide from '@/components/MarketSlide'
import TractionSlide from '@/components/TractionSlide'

const LOCALES = [
  { value: 'ar', label: 'العربية' },
  { value: 'ku', label: 'کوردی' },
  { value: 'fa', label: 'فارسی' },
  { value: 'uk', label: 'Українська' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
]

export default function HomePage() {
  const locale = useLocale()
  const t = useTranslations('home')

  return (
    <div className="flex flex-col bg-white">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 sm:py-16 md:grid-cols-2 md:items-center md:gap-16 md:py-28">

        {/* Left: Content */}
        <div>
          {/* Eyebrow */}
          <p style={{ color: 'var(--refugee-primary)', letterSpacing: '0.1em' }}
             className="mb-4 text-xs font-semibold uppercase">
            {t('eyebrow')}
          </p>

          {/* Headline */}
          <h1 style={{ letterSpacing: '-0.03em', lineHeight: 1.1 }}
              className="mb-5 text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
            {t('headline')}
          </h1>

          {/* Sub-headline */}
          <p className="mb-8 text-base leading-relaxed text-gray-500 sm:text-lg">
            {t('subheadline')}
          </p>

          {/* Stat Callout */}
          <div style={{
            borderInlineStart: '3px solid var(--refugee-primary)',
            backgroundColor: 'var(--refugee-surface)',
            borderRadius: '10px',
          }} className="mb-8 px-4 py-4 sm:px-5">
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
              <span style={{ color: 'var(--refugee-primary)', letterSpacing: '-0.04em' }}
                    className="text-3xl font-black sm:text-4xl">
                {t('statNumber')}
              </span>
              <p className="text-sm text-gray-600">
                {t('statDesc')}
              </p>
            </div>
            <p className="mt-1 text-xs text-gray-400">{t('statSource')}</p>
          </div>

          {/* Language picker */}
          <div className="mb-8 flex flex-wrap gap-2">
            {LOCALES.map((l) => (
              <Link
                key={l.value}
                href="/"
                locale={l.value as 'en' | 'de' | 'ar' | 'ku' | 'fa' | 'uk'}
                style={locale === l.value
                  ? { backgroundColor: 'var(--refugee-primary)', color: '#fff' }
                  : { backgroundColor: '#F3F4F6', color: '#374151' }}
                className="rounded-full px-4 py-1.5 text-sm font-medium transition hover:opacity-80"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTAs */}
          {/* <div className="flex flex-wrap gap-3">
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
          </div> */}

          <p className="mt-4 text-xs text-gray-400">
            {t('cities')}
          </p>
        </div>

        {/* Right: Product preview cards */}
        <div className="relative">
          {/* Background split */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div style={{ backgroundColor: 'var(--refugee-surface)' }} className="absolute inset-x-0 top-0 h-1/2" />
            <div style={{ backgroundColor: 'var(--student-surface)' }} className="absolute inset-x-0 bottom-0 h-1/2" />
          </div>

          <div className="relative p-4 sm:p-8">
            {/* Card 1: Student sees a request */}
            <div className="mb-4 rounded-2xl bg-white p-4 shadow-lg sm:mb-[70px] sm:p-5" style={{ border: '1px solid #E5E7EB' }}>
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
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span style={{ backgroundColor: 'var(--student-surface)', color: 'var(--student-primary)', borderRadius: '4px' }}
                            className="px-2 py-0.5 text-xs font-semibold uppercase">
                        {t('demoCard1Language')}
                      </span>
                      <span className="text-xs text-gray-400">{t('demoCard1Origin')}</span>
                    </div>
                    <span className="text-xs text-gray-400">{t('demoCard1Type')}</span>
                  </div>
                </div>
                <span style={{ backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '4px' }}
                      className="px-2 py-0.5 text-xs font-semibold">
                  {t('demoCard1Urgent')}
                </span>
              </div>
              <p style={{ backgroundColor: '#F9FAFB', borderRadius: '8px', borderLeft: '3px solid var(--refugee-primary)' }}
                 className="mb-3 px-3 py-2 text-sm italic text-gray-600">
                "{t('demoCard1Message')}"
              </p>
              <p className="font-semibold text-gray-900">{t('demoCard1Location')}</p>
              <p className="mt-1 text-sm text-gray-500">{t('demoCard1Time')}</p>
              <p className="mt-0.5 text-sm text-gray-400">{t('demoCard1Distance')}</p>
              <div className="mt-3 flex items-center justify-between">
                <span style={{ color: 'var(--student-accent)' }} className="text-base font-bold">
                  {t('demoCard1Amount')} <span className="text-xs font-normal text-gray-400">{t('demoCard1Price')}</span>
                </span>
                <button
                  style={{ backgroundColor: 'var(--student-primary)', borderRadius: '6px' }}
                  className="px-4 py-1.5 text-sm font-semibold text-white"
                >
                  {t('demoCard1Apply')}
                </button>
              </div>
            </div>

            {/* Card 2: Refugee's match confirmed */}
            <div className="rounded-2xl bg-white p-4 shadow-lg sm:p-5" style={{ border: '1px solid #E5E7EB' }}>
              <div className="mb-3 flex items-center gap-2">
                <div style={{ backgroundColor: 'var(--student-accent)', width: 8, height: 8, borderRadius: '50%' }} />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('demoCard2Status')}</span>
              </div>
              <div className="flex items-center gap-3">
                <Image
                  src="/student-refugee.png"
                  alt="Ali K."
                  width={44}
                  height={44}
                  unoptimized
                  className="shrink-0 rounded-full object-cover"
                  style={{ width: 44, height: 44 }}
                />
                <div>
                  <p className="font-semibold text-gray-900">{t('demoCard2Name')}</p>
                  <p className="text-sm text-gray-500">{t('demoCard2Info')}</p>
                  <div className="mt-1 flex items-center gap-1">
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill={i <= 4 ? '#D97706' : '#E5E7EB'}>
                        <path d="M6 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6 9 2.5 10.5l.5-3.5L.5 4.5 4 4z"/>
                      </svg>
                    ))}
                    <span className="text-xs font-medium text-gray-500 ml-1">{t('demoCard2Rating')}</span>
                  </div>
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--refugee-surface)', borderRadius: '8px' }}
                   className="mt-3 flex items-center justify-between px-3 py-2">
                <span className="text-sm text-gray-600">{t('demoCard2Date')}</span>
                <span style={{ color: 'var(--refugee-primary)' }} className="text-sm font-semibold">{t('demoCard2View')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem ────────────────────────────────────────────────── */}
      <ProblemSlide />

      {/* ── Traction ───────────────────────────────────────────────── */}
      <TractionSlide />

      {/* ── Market Opportunity ─────────────────────────────────────── */}
      <MarketSlide />

      {/* ── Business Model ─────────────────────────────────────────── */}
      <BusinessModelCards />

      {/* ── Competition Matrix ─────────────────────────────────────── */}
      <CompetitionMatrix />

    </div>
  )
}
