'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'

export default function Navbar() {
  const t = useTranslations('nav')
  const { data: session } = useSession()
  const { locale } = useParams<{ locale: string }>()
  const pathname = usePathname()
  const role = session?.user?.role
  const [mobileOpen, setMobileOpen] = useState(false)

  const isRefugee = role === 'refugee'
  const isStudent = role === 'student'
  const isAdmin   = role === 'admin'
  const isColored = isRefugee || isStudent

  const navBg    = isRefugee ? 'bg-refugee-primary' : isStudent ? 'bg-student-primary' : 'bg-white border-b border-gray-100'
  const textMuted = isColored ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-gray-900'
  const logoColor = isColored ? 'text-white' : 'text-gray-900'
  const logoMark  = isColored ? '/wusla-mark-white.svg' : '/wusla-mark.svg'
  const iconColor = isColored ? 'text-white' : 'text-gray-700'
  const dividerColor = isColored ? 'border-white/10' : 'border-gray-100'

  function isActive(seg: string) {
    return pathname.includes(seg)
  }

  return (
    <nav className={`sticky top-0 z-50 ${navBg}`}>
      <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-4 sm:px-6">

        {/* Wordmark */}
        <Link href={`/${locale}`} className="flex items-center gap-2.5">
          <Image src="/Logo.png" alt="" width={32} height={32} style={{ height: 32, width: 'auto' }} priority />
          <span className={`text-lg font-bold tracking-[-0.04em] ${logoColor}`}>wusla</span>
        </Link>

        {session?.user ? (
          <>
            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {isRefugee && (
                <>
                  <NavLink href={`/${locale}/refugee/dashboard`}    active={isActive('dashboard')}   dark={isColored} label={t('myRequests')} />
                  <NavLink href={`/${locale}/refugee/requests/new`} active={isActive('requests/new')} dark={isColored} label={t('newRequest')} />
                </>
              )}
              {isStudent && (
                <>
                  <NavLink href={`/${locale}/student/dashboard`}    active={isActive('dashboard')}    dark={isColored} label={t('browse')} />
                  <NavLink href={`/${locale}/student/applications`} active={isActive('applications')} dark={isColored} label={t('mySessions')} />
                  <NavLink href={`/${locale}/student/earnings`}     active={isActive('earnings')}     dark={isColored} label={t('earnings')} />
                </>
              )}
              {isAdmin && (
                <>
                  <NavLink href={`/${locale}/admin/dashboard`} active={isActive('dashboard')} dark label={t('overview')} />
                  <NavLink href={`/${locale}/admin/settings`}  active={isActive('settings')}  dark label={t('settings')} />
                </>
              )}
              <button
                onClick={() => signOut({ callbackUrl: `/${locale}` })}
                className={`ml-3 text-sm font-medium transition ${textMuted}`}
              >
                {t('signOut')}
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden rounded-md p-2 transition hover:opacity-70"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className={`h-5 w-5 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className={`h-5 w-5 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </>
        ) : (
          <div />
        )}
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && session?.user && (
        <div className={`md:hidden ${navBg} border-t ${dividerColor} px-4 pb-4 pt-2 flex flex-col gap-1`}>
          {isRefugee && (
            <>
              <MobileNavLink href={`/${locale}/refugee/dashboard`}    active={isActive('dashboard')}    dark={isColored} label={t('myRequests')} onClick={() => setMobileOpen(false)} />
              <MobileNavLink href={`/${locale}/refugee/requests/new`} active={isActive('requests/new')} dark={isColored} label={t('newRequest')} onClick={() => setMobileOpen(false)} />
            </>
          )}
          {isStudent && (
            <>
              <MobileNavLink href={`/${locale}/student/dashboard`}    active={isActive('dashboard')}    dark={isColored} label={t('browse')}     onClick={() => setMobileOpen(false)} />
              <MobileNavLink href={`/${locale}/student/applications`} active={isActive('applications')} dark={isColored} label={t('mySessions')} onClick={() => setMobileOpen(false)} />
              <MobileNavLink href={`/${locale}/student/earnings`}     active={isActive('earnings')}     dark={isColored} label={t('earnings')}   onClick={() => setMobileOpen(false)} />
            </>
          )}
          {isAdmin && (
            <>
              <MobileNavLink href={`/${locale}/admin/dashboard`} active={isActive('dashboard')} dark label={t('overview')} onClick={() => setMobileOpen(false)} />
              <MobileNavLink href={`/${locale}/admin/settings`}  active={isActive('settings')}  dark label={t('settings')} onClick={() => setMobileOpen(false)} />
            </>
          )}
          <button
            onClick={() => { setMobileOpen(false); signOut({ callbackUrl: `/${locale}` }) }}
            className={`mt-1 w-full rounded-md px-3 py-2 text-start text-sm font-medium transition ${textMuted}`}
          >
            {t('signOut')}
          </button>
        </div>
      )}
    </nav>
  )
}

function NavLink({ href, label, active, dark }: { href: string; label: string; active: boolean; dark?: boolean }) {
  if (dark) {
    return (
      <Link
        href={href}
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
          active ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`}
      >
        {label}
      </Link>
    )
  }
  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
        active ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'
      }`}
    >
      {label}
    </Link>
  )
}

function MobileNavLink({ href, label, active, dark, onClick }: { href: string; label: string; active: boolean; dark?: boolean; onClick: () => void }) {
  if (dark) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`w-full rounded-md px-3 py-2 text-sm font-medium transition ${
          active ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`}
      >
        {label}
      </Link>
    )
  }
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`w-full rounded-md px-3 py-2 text-sm font-medium transition ${
        active ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'
      }`}
    >
      {label}
    </Link>
  )
}
