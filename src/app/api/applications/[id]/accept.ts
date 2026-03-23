/**
 * Shared accept/match logic used by:
 * - Manual accept (refugee_choice mode)
 * - first_come auto-accept
 * - auto-match mode
 *
 * Uses a MongoDB transaction to atomically:
 * 1. Accept the winning application
 * 2. Reject all other pending applications
 * 3. Create the Match document
 * 4. Update Request status → 'matched'
 */

import mongoose from 'mongoose'
import Application, { ApplicationDocument } from '@/models/Application'
import Match from '@/models/Match'
import Request, { RequestDocument } from '@/models/Request'
import { getSettings } from '@/models/Settings'
import { scoreMatch, AUTO_MATCH_THRESHOLD } from '@/lib/matching'
import User from '@/models/User'

export async function acceptApplication(
  applicationId: string
): Promise<{ matchId: string }> {
  const session = await mongoose.startSession()
  let matchId: string

  await session.withTransaction(async () => {
    const application = await Application.findById(applicationId).session(session)
    if (!application) throw new Error('Application not found')
    if (application.status !== 'pending') throw new Error('Application is not pending')

    const request = await Request.findById(application.requestId).session(session)
    if (!request) throw new Error('Request not found')
    if (request.status !== 'open') throw new Error('Request is no longer open')

    const settings = await getSettings()

    // Create Match
    const [match] = await Match.create(
      [
        {
          requestId: request._id,
          refugeeId: request.refugeeId,
          studentId: application.studentId,
          applicationId: application._id,
          agreedAmount: request.budget,
          platformFeePercent: settings.platformFeePercent,
        },
      ],
      { session }
    )

    matchId = match._id.toString()

    // Accept this application
    await Application.findByIdAndUpdate(
      applicationId,
      { status: 'accepted' },
      { session }
    )

    // Reject all other pending applications for this request
    await Application.updateMany(
      {
        requestId: request._id,
        _id: { $ne: application._id },
        status: 'pending',
      },
      { status: 'rejected' },
      { session }
    )

    // Update request status
    await Request.findByIdAndUpdate(
      request._id,
      { status: 'matched', matchId: match._id },
      { session }
    )
  })

  await session.endSession()
  return { matchId: matchId! }
}

/** Called after a new application in first_come or auto mode */
export async function runAutoMatch(
  applicationId: string,
  request: RequestDocument,
  studentId: string
): Promise<void> {
  if (request.matchingMode === 'first_come') {
    await acceptApplication(applicationId)
    return
  }

  if (request.matchingMode === 'auto') {
    // Score all pending applicants and accept the best one above threshold
    const applications = await Application.find({
      requestId: request._id,
      status: 'pending',
    })

    const scored: Array<{ appId: string; score: number }> = []

    for (const app of applications) {
      const student = await User.findById(app.studentId).lean()
      if (!student) continue

      const score = scoreMatch({
        languagesNeeded: request.languagesNeeded,
        addressCoords: request.addressCoords,
        student: {
          languages: student.languages || [],
          locationCoords: student.locationCoords,
          averageRating: student.averageRating,
        },
      })

      if (student.stripeOnboarded) {
        scored.push({ appId: app._id.toString(), score })
      }
    }

    scored.sort((a, b) => b.score - a.score)

    if (scored.length > 0 && scored[0].score >= AUTO_MATCH_THRESHOLD) {
      await acceptApplication(scored[0].appId)
    }
  }
}
