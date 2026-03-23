'use client'

import { signIn, getSession } from 'next-auth/react'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignInPage() {
  const { locale } = useParams<{ locale: string }>()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError('Invalid email or password')
    } else {
      const session = await getSession()
      const role = session?.user?.role
      if (role === 'refugee') {
        router.push(`/${locale}/refugee/dashboard`)
      } else if (role === 'student') {
        router.push(`/${locale}/student/dashboard`)
      } else {
        router.push(`/${locale}`)
      }
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Sign In</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal-700 py-2.5 font-semibold text-white transition hover:bg-teal-800 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href={`/${locale}/auth/signup/refugee`} className="text-teal-700 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}
