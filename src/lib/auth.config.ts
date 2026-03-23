import type { NextAuthConfig } from 'next-auth'
import type { Role } from '@/types'

// Edge-compatible auth config — no Node.js imports (no bcrypt, no mongoose)
// Used by middleware only.
export const authConfig: NextAuthConfig = {
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as typeof user & { role: Role }).role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
      }
      return session
    },
  },
  pages: {
    signIn: '/en/auth/signin',
    error: '/en/auth/signin',
  },
  session: { strategy: 'jwt' },
}
