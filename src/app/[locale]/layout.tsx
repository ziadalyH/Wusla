import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import SessionProvider from '@/components/layout/SessionProvider'
import Navbar from '@/components/layout/Navbar'
import LocaleHtmlAttributes from '@/components/layout/LocaleHtmlAttributes'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Wusla — Companion for Doctor Visits',
  description: 'Connecting refugees with student companions for doctor visits in Germany.',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'en' | 'de' | 'ar' | 'ku')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <div className={`${inter.variable} min-h-screen bg-white antialiased`}>
      <LocaleHtmlAttributes locale={locale} />
      {/* Arabic/Kurdish: load Noto Sans Arabic */}
      {(locale === 'ar' || locale === 'ku') && (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </>
      )}
      <NextIntlClientProvider messages={messages}>
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
        </SessionProvider>
      </NextIntlClientProvider>
    </div>
  )
}
