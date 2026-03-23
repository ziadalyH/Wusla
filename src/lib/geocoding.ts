import type { Coordinates } from '@/types'

/** Geocode an address string using Nominatim (OpenStreetMap). Free, no API key. */
export async function geocodeAddress(address: string): Promise<Coordinates | null> {
  try {
    const encoded = encodeURIComponent(address)
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'SocialOps/1.0 (socialops.app)',
        },
      }
    )

    if (!res.ok) return null

    const data = await res.json()
    if (!data.length) return null

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    }
  } catch {
    return null
  }
}
