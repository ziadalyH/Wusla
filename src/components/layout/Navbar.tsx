'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useParams, usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()
  const { locale } = useParams<{ locale: string }>()
  const pathname = usePathname()
  const role = session?.user?.role

  const isRefugee = role === 'refugee'
  const isStudent = role === 'student'
  const isAdmin   = role === 'admin'

  const navBg    = isRefugee ? 'bg-refugee-primary' : isStudent ? 'bg-student-primary' : 'bg-white border-b border-gray-100'
  const textBase = isRefugee || isStudent ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-gray-900'
  const textActive = isRefugee || isStudent ? 'text-white' : 'text-gray-900'
  const logoColor  = isRefugee || isStudent ? 'text-white' : 'text-gray-900'

  const logoMark = isRefugee || isStudent ? '/wusla-mark-white.svg' : '/wusla-mark.svg'

  function isActive(seg: string) {
    return pathname.includes(seg)
  }

  return (
    <nav className={`sticky top-0 z-50 ${navBg}`}>
      <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-6">

        {/* Wordmark */}
        <Link href={`/${locale}`} className="flex items-center gap-2.5">
          <Image src={logoMark} alt="" width={32} height={18} style={{ height: 'auto' }} priority />
          <span className={`text-lg font-bold tracking-[-0.04em] ${logoColor}`}>
            wusla
          </span>
        </Link>

        {/* Logged-in navigation */}
        {session?.user ? (
          <div className="flex flex-wrap items-center gap-1">
            {isRefugee && (
              <>
                <NavLink href={`/${locale}/refugee/dashboard`}   active={isActive('dashboard')}  dark  label="My Requests" />
                <NavLink href={`/${locale}/refugee/requests/new`} active={isActive('requests/new')} dark label="New Request" />
              </>
            )}
            {isStudent && (
              <>
                <NavLink href={`/${locale}/student/dashboard`}    active={isActive('dashboard')}    dark label="Browse" />
                <NavLink href={`/${locale}/student/applications`} active={isActive('applications')} dark label="My Sessions" />
                <NavLink href={`/${locale}/student/earnings`}     active={isActive('earnings')}     dark label="Earnings" />
              </>
            )}
            {isAdmin && (
              <>
                <NavLink href={`/${locale}/admin/dashboard`} active={isActive('dashboard')} dark label="Overview" />
                <NavLink href={`/${locale}/admin/settings`}  active={isActive('settings')}  dark label="Settings" />
              </>
            )}

            {/* Sign out */}
            <button
              onClick={() => signOut({ callbackUrl: `/${locale}` })}
              className={`ml-3 text-sm font-medium transition ${textBase}`}
            >
              Sign out
            </button>
          </div>
        ) : (
          /* Public navigation */
          <div />
        )}
      </div>
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
