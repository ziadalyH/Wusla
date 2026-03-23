import type { Language, Coordinates } from '@/types'

/** Haversine distance in km between two coordinate points */
function haversineKm(a: Coordinates, b: Coordinates): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180

  const hav =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2

  return R * 2 * Math.atan2(Math.sqrt(hav), Math.sqrt(1 - hav))
}

export interface ScoringInput {
  languagesNeeded: Language[]
  addressCoords?: Coordinates
  student: {
    languages: Language[]
    locationCoords?: Coordinates
    averageRating: number
  }
}

/** Returns a score 0–1. Higher is better. */
export function scoreMatch(input: ScoringInput): number {
  const { languagesNeeded, addressCoords, student } = input

  // Language overlap (50% weight)
  const overlap = languagesNeeded.filter((l) => student.languages.includes(l)).length
  const languageScore = languagesNeeded.length > 0 ? overlap / languagesNeeded.length : 0

  // Proximity (30% weight) — cap at 50 km
  let proximityScore = 0
  if (addressCoords && student.locationCoords) {
    const distKm = haversineKm(addressCoords, student.locationCoords)
    proximityScore = Math.max(0, 1 - distKm / 50)
  }

  // Rating (20% weight)
  const ratingScore = student.averageRating / 5

  return languageScore * 0.5 + proximityScore * 0.3 + ratingScore * 0.2
}

export const AUTO_MATCH_THRESHOLD = 0.4
