import { auth } from '@/lib/auth'
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware(routing)

const protectedRoutes = {
  refugee: ['/refugee', '/chat', '/payment', '/review'],
  student: ['/student', '/chat', '/payment', '/review'],
  admin: ['/admin'],
}

export default auth(async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Strip locale prefix for route matching
  const pathnameWithoutLocale = pathname.replace(/^\/(en|de|ar|ku)/, '')

  // Check if this is a protected route
  const session = (req as NextRequest & { auth?: { user?: { role?: string } } }).auth

  const isRefugeeRoute = protectedRoutes.refugee.some((r) =>
    pathnameWithoutLocale.startsWith(r)
  )
  const isStudentRoute = protectedRoutes.student.some((r) =>
    pathnameWithoutLocale.startsWith(r)
  )
  const isAdminRoute = protectedRoutes.admin.some((r) =>
    pathnameWithoutLocale.startsWith(r)
  )

  if (isRefugeeRoute || isStudentRoute || isAdminRoute) {
    if (!session?.user) {
      const locale = pathname.split('/')[1] || 'en'
      return NextResponse.redirect(new URL(`/${locale}/auth/signin`, req.url))
    }

    const role = session.user.role

    if (isAdminRoute && role !== 'admin') {
      const locale = pathname.split('/')[1] || 'en'
      return NextResponse.redirect(new URL(`/${locale}`, req.url))
    }

    if (isRefugeeRoute && role !== 'refugee') {
      const locale = pathname.split('/')[1] || 'en'
      return NextResponse.redirect(new URL(`/${locale}`, req.url))
    }

    if (isStudentRoute && role !== 'student') {
      const locale = pathname.split('/')[1] || 'en'
      return NextResponse.redirect(new URL(`/${locale}`, req.url))
    }
  }

  return intlMiddleware(req)
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)',
  ],
}
