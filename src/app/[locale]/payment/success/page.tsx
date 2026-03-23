import Link from 'next/link'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ matchId?: string }> }

export default async function PaymentSuccessPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { matchId } = await searchParams

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="max-w-md rounded-2xl bg-white p-10 text-center shadow-lg">
        <div className="mb-4 text-6xl">🎉</div>
        <h1 className="mb-2 text-2xl font-bold text-gray-800">Payment Successful!</h1>
        <p className="mb-6 text-gray-500">
          Thank you! Your companion has been paid. Please leave a review to help others.
        </p>
        <div className="flex flex-col gap-3">
          {matchId && (
            <Link
              href={`/${locale}/review/${matchId}`}
              className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-white hover:bg-yellow-600"
            >
              ⭐ Leave a Review
            </Link>
          )}
          <Link
            href={`/${locale}/refugee/dashboard`}
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-600 hover:bg-gray-50"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
