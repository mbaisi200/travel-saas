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

// Hotelbeds API — https://developers.hotelbeds.com
const HOTELBEDS_API = 'https://api.test.hotelbeds.com/hotel-api/1.0'
const HOTELBEDS_API_PROD = 'https://api.hotelbeds.com/hotel-api/1.0'

export async function searchHotelsHotelbeds(params: HotelSearchRequest): Promise<RoomOffer[]> {
  const apiKey = process.env.NEXT_PUBLIC_HOTELBEDS_API_KEY
  const secret = process.env.NEXT_PUBLIC_HOTELBEDS_SECRET

  // Sem chave — usa dados mock
  if (!apiKey || !secret) {
    await new Promise((r) => setTimeout(r, 500))
    const results = generateMockHotels(params.destination, params.checkIn, params.checkOut, params.guests)

    return results.filter((h) => {
      if (params.starsMin && h.stars < params.starsMin) return false
      if (params.maxPrice && h.totalPrice > params.maxPrice) return false
      return true
    })
  }

  // Com chave — consulta API real
  try {
    const isTest = process.env.NEXT_PUBLIC_HOTELBEDS_ENV !== 'production'
    const baseUrl = isTest ? HOTELBEDS_API : HOTELBEDS_API_PROD

    const response = await fetch(`${baseUrl}/hotels`, {
      method: 'POST',
      headers: {
        'Api-Key': apiKey,
        'X-Signature': secret, // Hotelbeds usa X-Signature em test ou assinatura SHA256
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
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
          code: params.destination, // Código Hotelbeds da cidade
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
