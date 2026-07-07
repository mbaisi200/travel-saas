import type { FlightOffer, FlightSearchParams } from '@/types/flights'
import { airports } from './flights-mock'

interface IgnavSegment {
  marketing_carrier_code: string | null
  flight_number: string | null
  operating_carrier_name: string | null
  departure_airport: string
  departure_time_local: string
  arrival_airport: string
  arrival_time_local: string
  duration_minutes: number
  aircraft: string | null
}

interface IgnavItinerary {
  price: { amount: number; currency: string; status: string }
  outbound: {
    carrier?: string
    duration_minutes: number
    segments: IgnavSegment[]
  }
  inbound?: {
    carrier?: string
    duration_minutes: number
    segments: IgnavSegment[]
  }
  cabin_class: string
  ignav_id: string
  bags?: { carry_on?: number; checked?: number }
}

interface IgnavResponse {
  origin: string
  destination: string
  departure_date: string
  return_date?: string
  itineraries: IgnavItinerary[]
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
}

function formatDate(iso: string): string {
  return iso.split('T')[0]
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h${m.toString().padStart(2, '0')}`
}

function cityFromIata(iata: string): string {
  return airports.find((a) => a.iata === iata)?.city || iata
}

function cabinLabel(cabinClass: string): string {
  const labels: Record<string, string> = {
    economy: 'Econômica',
    premium_economy: 'Premium',
    business: 'Executiva',
    first: 'Primeira Classe',
  }
  return labels[cabinClass] || cabinClass
}

const cabinMap: Record<string, 'economy' | 'business' | 'first'> = {
  economy: 'economy',
  premium_economy: 'economy',
  business: 'business',
  first: 'first',
}

function mapSegmentsToLeg(segs: IgnavSegment[], legLabel: string) {
  const first = segs[0]
  const last = segs[segs.length - 1]
  const stops = segs.length - 1
  const stopAirports = segs.slice(1).map((s) => s.departure_airport)

  return {
    airline: first.operating_carrier_name || first.marketing_carrier_code || '',
    airlineCode: first.marketing_carrier_code || '',
    flightNumber: first.flight_number || '',
    departure: {
      airport: first.departure_airport,
      city: cityFromIata(first.departure_airport),
      time: formatTime(first.departure_time_local),
      date: formatDate(first.departure_time_local),
    },
    arrival: {
      airport: last.arrival_airport,
      city: cityFromIata(last.arrival_airport),
      time: formatTime(last.arrival_time_local),
      date: formatDate(last.arrival_time_local),
    },
    duration: formatDuration(segs.reduce((acc, s) => acc + s.duration_minutes, 0)),
    stops,
    stopAirports: [...new Set(stopAirports)],
  }
}

export interface FlightSearchRequest {
  origin: string
  destination: string
  departDate: string
  returnDate?: string
  passengers: number
  cabin: 'economy' | 'premium_economy' | 'business' | 'first'
  minCheckedBags?: number
  maxStops?: number
}

export async function searchFlightsIgnav(params: FlightSearchRequest): Promise<FlightOffer[]> {
  const response = await fetch('/api/flights/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      origin: params.origin,
      destination: params.destination,
      departure_date: params.departDate,
      return_date: params.returnDate || undefined,
      adults: params.passengers || 1,
      cabin_class: params.cabin || 'economy',
      max_stops: params.maxStops,
      min_checked_bags: params.minCheckedBags,
      round_trip: !!params.returnDate,
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error || `Erro ${response.status}`)
  }

  const data: IgnavResponse = await response.json()

  if (!data.itineraries || data.itineraries.length === 0) {
    return []
  }

  return data.itineraries.map((it, i) => {
    const outLeg = mapSegmentsToLeg(it.outbound.segments, 'ida')

    const result: FlightOffer = {
      ...outLeg,
      id: `ignav-${it.ignav_id || i}`,
      cabin: cabinMap[it.cabin_class] || 'economy',
      price: Math.round(it.price.amount),
      currency: it.price.currency || 'BRL',
      seatsAvailable: 9,
      fareClass: outLeg.stops === 0 ? 'Y' : 'M',
      returnLeg: it.inbound ? {
        ...mapSegmentsToLeg(it.inbound.segments, 'volta'),
        cabin: cabinMap[it.cabin_class] || 'economy',
        currency: it.price.currency || 'BRL',
      } : undefined,
      checkedBags: it.bags?.checked ?? 0,
      cabinLabel: cabinLabel(it.cabin_class),
    }

    return result
  }).sort((a, b) => a.price - b.price)
}
