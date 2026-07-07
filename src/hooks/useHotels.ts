import { useState, useCallback } from 'react'
import type { RoomOffer, HotelSearchParams } from '@/types/hotels'
import { searchHotelsHotelbeds } from '@/services/hotelbeds'
import { hotelCities } from '@/services/hotels-mock'

export function useHotels() {
  const [offers, setOffers] = useState<RoomOffer[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchHotels = useCallback(async (params: HotelSearchParams) => {
    setLoading(true)
    setError(null)
    setSearched(false)

    try {
      const results = await searchHotelsHotelbeds({
        destination: params.city,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        guests: params.guests,
        starsMin: params.starsMin,
        maxPrice: params.maxPrice,
      })
      setOffers(results)
      setSearched(true)
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar hotéis')
      setOffers([])
    } finally {
      setLoading(false)
    }
  }, [])

  const searchCities = useCallback((query: string): string[] => {
    if (!query || query.length < 2) return []
    const q = query.toLowerCase()
    return hotelCities.filter((c) => c.toLowerCase().includes(q)).slice(0, 8)
  }, [])

  return { offers, loading, searched, error, searchHotels, searchCities }
}
