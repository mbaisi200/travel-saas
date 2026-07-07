import { useState, useCallback } from 'react'
import type { FlightOffer, Airport, FlightSearchParams } from '@/types/flights'
import { searchFlightsIgnav } from '@/services/ignav'
import { airports } from '@/services/flights-mock'

export function useFlightSearch() {
  const [offers, setOffers] = useState<FlightOffer[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchFlights = useCallback(async (params: FlightSearchParams) => {
    setLoading(true)
    setError(null)
    setSearched(false)

    try {
      const results = await searchFlightsIgnav({
        origin: params.origin,
        destination: params.destination,
        departDate: params.departDate,
        returnDate: params.returnDate,
        passengers: params.passengers,
        cabin: params.cabin || 'economy',
        minCheckedBags: params.minCheckedBags,
        maxStops: params.maxStops,
      })
      setOffers(results)
      setSearched(true)
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar voos. Tente novamente.')
      setOffers([])
    } finally {
      setLoading(false)
    }
  }, [])

  const searchAirports = useCallback((query: string): Airport[] => {
    if (!query || query.length < 2) return []
    const q = query.toLowerCase()
    return airports.filter(
      (a) =>
        a.iata.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q),
    ).slice(0, 8)
  }, [])

  return { offers, loading, searched, error, searchFlights, searchAirports }
}
