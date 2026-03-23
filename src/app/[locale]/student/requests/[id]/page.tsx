import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { connectDB } from '@/lib/db'
import Request from '@/models/Request'
import Application from '@/models/Application'
import ApplyButton from './ApplyButton'

type Props = { params: Promise<{ locale: string; id: string }> }

export default async function StudentRequestDetailPage({ params }: Props) {
  const { locale, id } = await params
  const session = await auth()
  if (!session?.user || session.user.role !== 'student') redirect(`/${locale}/auth/signin`)

  await connectDB()

  const request = await Request.findById(id).populate('refugeeId', 'name').lean()
  if (!request) notFound()

  const existingApplication = await Application.findOne({
    requestId: id,
    studentId: session.user.id,
  }).lean()

  const refugee = request.refugeeId as unknown as { name: string }

  const LANGUAGE_LABELS: Record<string, string> = {
    ar: 'Arabic', ku: 'Kurdish', en: 'English', de: 'German',
    tr: 'Turkish', fa: 'Farsi/Dari', so: 'Somali', fr: 'French',
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="rounded-2xl bg-white p-6 shadow">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{request.doctorType}</h1>
            <p className="mt-1 text-gray-500">Posted by {refugee.name}</p>
          </div>
          <span className="text-3xl font-bold text-indigo-600">€{request.budget}</span>
        </div>

        <div className="mt-4 space-y-3 border-t pt-4">
          <div className="flex gap-2">
            <span className="w-28 text-sm font-medium text-gray-500">Date & Time</span>
            <span className="text-sm text-gray-800">
              {new Date(request.appointmentDate).toLocaleDateString('de-DE', {
                weekday: 'long', day: 'numeric', month: 'long',
                hour: '2-digit', minute: '2-digit',
              })}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-28 text-sm font-medium text-gray-500">Address</span>
            <span className="text-sm text-gray-800">{request.appointmentAddress}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-28 text-sm font-medium text-gray-500">Languages</span>
            <div className="flex flex-wrap gap-1">
              {request.languagesNeeded.map((l: string) => (
                <span key={l} className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
                  {LANGUAGE_LABELS[l] || l}
                </span>
              ))}
            </div>
          </div>
          {request.notes && (
            <div className="flex gap-2">
              <span className="w-28 text-sm font-medium text-gray-500">Notes</span>
              <span className="text-sm text-gray-800">{request.notes}</span>
            </div>
          )}
        </div>

        <div className="mt-6">
          {request.status !== 'open' ? (
            <p className="rounded-lg bg-gray-50 p-3 text-center text-sm text-gray-500">
              This request is no longer accepting applications.
            </p>
          ) : existingApplication ? (
            <div className="rounded-lg bg-indigo-50 p-4 text-center">
              <p className="font-medium text-indigo-700">
                You have already applied — status:{' '}
                <span className="capitalize">{existingApplication.status}</span>
              </p>
            </div>
          ) : (
            <ApplyButton requestId={id} locale={locale} />
          )}
        </div>
      </div>
    </div>
  )
}
