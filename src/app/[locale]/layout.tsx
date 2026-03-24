import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import SessionProvider from '@/components/layout/SessionProvider'
import Navbar from '@/components/layout/Navbar'
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

  if (!routing.locales.includes(locale as 'en' | 'de' | 'ar' | 'ku' | 'fa' | 'uk')) {
    notFound()
  }

  const messages = await getMessages({ locale })
  const isRTL = locale === 'ar' || locale === 'ku' || locale === 'fa'

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        {/* Arabic/Kurdish/Farsi: load Noto Sans Arabic */}
        {isRTL && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
              href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap"
              rel="stylesheet"
            />
          </>
        )}
      </head>
      <body className={`${inter.variable} min-h-screen bg-white antialiased`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <SessionProvider>
            <Navbar />
            <main>{children}</main>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
