import type { RoomOffer } from '@/types/hotels'
import { generateMockHotels } from './hotels-mock'

export interface HotelSearchRequest {
  destination: string
  checkIn: string
  checkOut: string
  guests: number
  starsMin?: number
  maxPrice?: number
}

const HOTELBEDS_API = 'https://api.test.hotelbeds.com/hotel-api/1.0'
const HOTELBEDS_API_PROD = 'https://api.hotelbeds.com/hotel-api/1.0'

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function buildHeaders(apiKey: string, secret: string) {
  const timestamp = Math.floor(Date.now() / 1000)
  const signature = await sha256Hex(`${apiKey}${secret}${timestamp}`)
  return {
    'Api-Key': apiKey,
    'X-Signature': signature,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
}

export async function searchHotelsHotelbeds(params: HotelSearchRequest): Promise<RoomOffer[]> {
  const apiKey = process.env.NEXT_PUBLIC_HOTELBEDS_API_KEY
  const secret = process.env.NEXT_PUBLIC_HOTELBEDS_SECRET

  if (!apiKey || !secret) {
    await new Promise((r) => setTimeout(r, 500))
    const results = generateMockHotels(params.destination, params.checkIn, params.checkOut, params.guests)

    return results.filter((h) => {
      if (params.starsMin && h.stars < params.starsMin) return false
      if (params.maxPrice && h.totalPrice > params.maxPrice) return false
      return true
    })
  }

  try {
    const isTest = process.env.NEXT_PUBLIC_HOTELBEDS_ENV !== 'production'
    const baseUrl = isTest ? HOTELBEDS_API : HOTELBEDS_API_PROD
    const headers = await buildHeaders(apiKey, secret)

    const response = await fetch(`${baseUrl}/hotels`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        stay: {
          checkIn: params.checkIn,
          checkOut: params.checkOut,
        },
        occupancies: [{
          rooms: 1,
          adults: params.guests,
          children: 0,
        }],
        destination: {
          type: 'CITY',
          code: params.destination,
        },
        filter: {
          minRate: '1',
          maxRate: params.maxPrice ? String(params.maxPrice) : undefined,
          minCategory: params.starsMin ? String(params.starsMin) : undefined,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Hotelbeds error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.hotels?.hotels) {
      return []
    }

    return data.hotels.hotels.flatMap((hotel: any) =>
      hotel.rooms?.map((room: any) => ({
        id: `hb-${hotel.code}-${room.code}`,
        hotelId: String(hotel.code),
        hotelName: hotel.name?.content || hotel.name,
        city: params.destination,
        stars: hotel.categoryCode ? parseInt(hotel.categoryCode) : 3,
        rating: hotel.rating || parseFloat(hotel.categoryGroupCode || '3'),
        image: hotel.images?.[0]?.path || '',
        roomType: room.name || 'Standard',
        boardType: room.board?.code || 'RO',
        pricePerNight: Math.round(room.net / room.nights),
        totalPrice: Math.round(room.net),
        currency: 'BRL',
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        nights: room.nights || 1,
        guests: params.guests,
        amenities: [],
        cancellationPolicy: room.cancellationPolicy || 'Consulte',
      })) || [],
    ).sort((a: RoomOffer, b: RoomOffer) => a.totalPrice - b.totalPrice)
  } catch (err) {
    console.error('Hotelbeds API error, usando mock:', err)
    await new Promise((r) => setTimeout(r, 500))
    return generateMockHotels(params.destination, params.checkIn, params.checkOut, params.guests)
  }
}
