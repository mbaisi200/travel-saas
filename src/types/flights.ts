export interface Airport {
  iata: string
  name: string
  city: string
  country: string
}

export interface FlightLeg {
  airline: string
  airlineCode: string
  flightNumber: string
  departure: { airport: string; city: string; time: string; date: string }
  arrival: { airport: string; city: string; time: string; date: string }
  duration: string
  stops: number
  stopAirports: string[]
  cabin?: string
  currency?: string
}

export interface FlightOffer {
  id: string
  airline: string
  airlineCode: string
  flightNumber: string
  departure: { airport: string; city: string; time: string; date: string }
  arrival: { airport: string; city: string; time: string; date: string }
  duration: string
  stops: number
  stopAirports: string[]
  cabin: 'economy' | 'business' | 'first'
  price: number
  currency: string
  seatsAvailable: number
  fareClass: string
  returnLeg?: FlightLeg
  checkedBags?: number
  cabinLabel?: string
}

export interface FlightSearchParams {
  origin: string
  destination: string
  departDate: string
  returnDate?: string
  passengers: number
  cabin?: 'economy' | 'premium_economy' | 'business' | 'first'
  minCheckedBags?: number
  maxStops?: number
}

export interface FlightSearchResult {
  id: string
  params: FlightSearchParams
  offers: FlightOffer[]
  totalTime: number
  cached: boolean
  createdAt: string
}
