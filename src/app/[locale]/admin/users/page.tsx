import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/db'
import User from '@/models/User'

type Props = { params: Promise<{ locale: string }> }

export default async function AdminUsersPage({ params }: Props) {
  const { locale } = await params
  const session = await auth()
  if (!session?.user || session.user.role !== 'admin') redirect(`/${locale}/auth/signin`)

  await connectDB()

  const users = await User.find().sort({ createdAt: -1 }).limit(100).lean()

  const roleColors: Record<string, string> = {
    refugee: 'bg-orange-100 text-orange-700',
    student: 'bg-blue-100 text-blue-700',
    admin: 'bg-purple-100 text-purple-700',
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Users ({users.length})</h1>

      <div className="rounded-2xl bg-white shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Languages</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Stripe</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user._id.toString()} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                <td className="px-4 py-3 text-gray-500">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${roleColors[user.role]}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {user.languages?.join(', ') || '—'}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {user.role === 'student' ? `${user.averageRating.toFixed(1)} (${user.totalReviews})` : '—'}
                </td>
                <td className="px-4 py-3">
                  {user.role === 'student' ? (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.stripeOnboarded ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500'
                    }`}>
                      {user.stripeOnboarded ? 'Connected' : 'Not set up'}
                    </span>
                  ) : '—'}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString('de-DE')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
