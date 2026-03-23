import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') {
    redirect(`/${locale}/auth/signin`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-2xl font-bold text-gray-800">Admin Dashboard</h1>

        {/* Stats */}
        <StatsCards />

        {/* Quick links */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Link
            href={`/${locale}/admin/settings`}
            className="rounded-2xl bg-white p-6 shadow transition hover:shadow-md"
          >
            <div className="text-2xl mb-2">⚙️</div>
            <h3 className="font-semibold text-gray-800">Settings</h3>
            <p className="text-sm text-gray-500">Matching mode, fees, maintenance</p>
          </Link>
          <Link
            href={`/${locale}/admin/users`}
            className="rounded-2xl bg-white p-6 shadow transition hover:shadow-md"
          >
            <div className="text-2xl mb-2">👥</div>
            <h3 className="font-semibold text-gray-800">Users</h3>
            <p className="text-sm text-gray-500">Manage refugees and students</p>
          </Link>
          <Link
            href={`/${locale}/admin/requests`}
            className="rounded-2xl bg-white p-6 shadow transition hover:shadow-md"
          >
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold text-gray-800">Requests</h3>
            <p className="text-sm text-gray-500">View all doctor visit requests</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

async function StatsCards() {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/stats`,
      { cache: 'no-store' }
    )
    const data = await res.json()

    const stats = [
      { label: 'Total Users', value: data.totalUsers },
      { label: 'Refugees', value: data.totalRefugees },
      { label: 'Students', value: data.totalStudents },
      { label: 'Requests', value: data.totalRequests },
      { label: 'Matches', value: data.totalMatches },
      { label: 'Revenue', value: `€${data.revenue}` },
    ]

    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-5 shadow">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="mt-1 text-3xl font-bold text-teal-700">{s.value}</p>
          </div>
        ))}
      </div>
    )
  } catch {
    return null
  }
}
