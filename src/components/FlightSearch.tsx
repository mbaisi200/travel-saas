'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import {
  Plane,
  Search,
  Clock,
  Users,
  MapPin,
  Briefcase,
  Luggage,
  Loader2,
  AlertCircle,
  Check,
  ArrowRight,
  ArrowLeftRight,
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { useFlightSearch } from '@/hooks/useFlights'
import type { FlightOffer, Airport } from '@/types/flights'

const cabinOptions = [
  { value: 'economy', label: 'Econômica' },
  { value: 'premium_economy', label: 'Premium' },
  { value: 'business', label: 'Executiva' },
]

const baggageOptions = [
  { value: 0, label: 'Qualquer' },
  { value: 1, label: 'Com bagagem' },
]

const maxStopsOptions = [
  { value: undefined, label: 'Qualquer' },
  { value: 0, label: 'Direto' },
  { value: 1, label: 'Máx 1 parada' },
]

interface FlightSearchProps {
  onSelectFlight?: (flight: FlightOffer) => void
  className?: string
}

export function FlightSearch({ onSelectFlight, className }: FlightSearchProps) {
  const { offers, loading, searched, error, searchFlights, searchAirports } = useFlightSearch()

  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [departDate, setDepartDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [passengers, setPassengers] = useState(1)
  const [cabin, setCabin] = useState<string>('economy')
  const [minCheckedBags, setMinCheckedBags] = useState(0)
  const [maxStops, setMaxStops] = useState<number | undefined>(undefined)

  const [originSuggestions, setOriginSuggestions] = useState<Airport[]>([])
  const [destSuggestions, setDestSuggestions] = useState<Airport[]>([])
  const [showOrigin, setShowOrigin] = useState(false)
  const [showDest, setShowDest] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'stops'>('price')

  const originRef = useRef<HTMLDivElement>(null)
  const destRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (originRef.current && !originRef.current.contains(e.target as Node)) setShowOrigin(false)
      if (destRef.current && !destRef.current.contains(e.target as Node)) setShowDest(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleOriginChange = useCallback((val: string) => {
    setOrigin(val.toUpperCase())
    setOriginSuggestions(searchAirports(val))
    setShowOrigin(true)
  }, [searchAirports])

  const handleDestChange = useCallback((val: string) => {
    setDestination(val.toUpperCase())
    setDestSuggestions(searchAirports(val))
    setShowDest(true)
  }, [searchAirports])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!origin || !destination || !departDate) return
    if (tripType === 'round-trip' && !returnDate) return

    searchFlights({
      origin,
      destination,
      departDate,
      returnDate: tripType === 'round-trip' ? returnDate : undefined,
      passengers,
      cabin: cabin as FlightOffer['cabin'],
      minCheckedBags: minCheckedBags || undefined,
      maxStops,
    })
  }

  function handleSelectFlight(offer: FlightOffer) {
    setSelectedFlight(offer.id)
    onSelectFlight?.(offer)
  }

  function parseDuration(d: string): number {
    const match = d.match(/(\d+)h(\d+)?/)
    if (!match) return 0
    return parseInt(match[1]) * 60 + (parseInt(match[2]) || 0)
  }

  const sortedOffers = [...offers].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price
    if (sortBy === 'duration') return parseDuration(a.duration) - parseDuration(b.duration)
    if (sortBy === 'stops') return a.stops - b.stops
    return 0
  })

  const FilterPill = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap',
        active
          ? 'bg-primary-600 text-white shadow-sm'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700',
      )}
    >
      {children}
    </button>
  )

  return (
    <div className={cn('space-y-6', className)}>
      {/* Formulário */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-4">
        {/* Tipo de viagem */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 w-fit">
          {(['one-way', 'round-trip'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTripType(t)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                tripType === t
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400',
              )}
            >
              {t === 'one-way' ? 'Só Ida' : 'Ida e Volta'}
            </button>
          ))}
        </div>

        {/* Origem / Destino */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div ref={originRef} className="relative">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Origem</label>
            <input
              type="text" value={origin}
              onChange={(e) => handleOriginChange(e.target.value)}
              placeholder="GRU, CGH, São Paulo..."
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/50"
            />
            {showOrigin && originSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {originSuggestions.map((a) => (
                  <button key={a.iata} type="button"
                    onClick={() => { setOrigin(a.iata); setShowOrigin(false) }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <MapPin className="h-3 w-3 text-slate-400 flex-shrink-0" />
                    <span className="font-medium">{a.iata}</span>
                    <span className="text-slate-500">{a.city}</span>
                    <span className="ml-auto text-[10px] text-slate-400">{a.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div ref={destRef} className="relative">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Destino</label>
            <input
              type="text" value={destination}
              onChange={(e) => handleDestChange(e.target.value)}
              placeholder="GIG, BSB, Rio..."
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/50"
            />
            {showDest && destSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {destSuggestions.map((a) => (
                  <button key={a.iata} type="button"
                    onClick={() => { setDestination(a.iata); setShowDest(false) }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                  >
                    <MapPin className="h-3 w-3 text-slate-400 flex-shrink-0" />
                    <span className="font-medium">{a.iata}</span>
                    <span className="text-slate-500">{a.city}</span>
                    <span className="ml-auto text-[10px] text-slate-400">{a.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Datas */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Ida</label>
            <input type="date" value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              {tripType === 'round-trip' ? 'Volta' : 'Volta (opcional)'}
            </label>
            <input type="date" value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              disabled={tripType === 'one-way'}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-40"
            />
          </div>
        </div>

        {/* Passageiros */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Passageiros</label>
            <select value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? 'passageiro' : 'passageiros'}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtros em pills */}
        <div className="flex flex-wrap gap-2">
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Cabine</label>
            <div className="flex gap-1 flex-wrap">
              {cabinOptions.map((opt) => (
                <FilterPill
                  key={opt.value}
                  active={cabin === opt.value}
                  onClick={() => setCabin(opt.value)}
                >{opt.label}</FilterPill>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Bagagem</label>
            <div className="flex gap-1 flex-wrap">
              {baggageOptions.map((opt) => (
                <FilterPill
                  key={opt.value}
                  active={minCheckedBags === opt.value}
                  onClick={() => setMinCheckedBags(opt.value)}
                >{opt.label}</FilterPill>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Paradas</label>
            <div className="flex gap-1 flex-wrap">
              {maxStopsOptions.map((opt) => (
                <FilterPill
                  key={String(opt.value)}
                  active={maxStops === opt.value}
                  onClick={() => setMaxStops(opt.value)}
                >{opt.label}</FilterPill>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!origin || !destination || !departDate || loading}
          className="w-full py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {loading ? 'Buscando...' : 'Buscar Voos'}
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-lg text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Resultados header */}
      {searched && !loading && (
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-slate-500">
            {offers.length} {offers.length === 1 ? 'voo encontrado' : 'voos encontrados'}
          </p>
          <div className="flex gap-1">
            {(['price', 'duration', 'stops'] as const).map((s) => (
              <button key={s} onClick={() => setSortBy(s)}
                className={cn(
                  'px-2.5 py-1 text-xs font-medium rounded-lg transition-colors',
                  sortBy === s
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800',
                )}
              >
                {s === 'price' ? 'Menor Preço' : s === 'duration' ? 'Duração' : 'Paradas'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
            <p className="text-sm text-slate-400">Buscando melhores opções...</p>
          </div>
        </div>
      ) : searched && offers.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Plane className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Nenhum voo encontrado para esta busca</p>
          <p className="text-xs mt-1">Tente alterar datas, destino ou filtros</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedOffers.map((offer) => (
            <div
              key={offer.id}
              className={cn(
                'bg-white dark:bg-slate-900 rounded-xl border p-4 transition-all',
                selectedFlight === offer.id
                  ? 'border-primary-500 ring-2 ring-primary-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-3">
                  {/* Cia + Nº Voo + Cabine + Bagagem */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {offer.airline}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                      {offer.flightNumber}
                    </span>
                    {offer.cabinLabel && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                        {offer.cabinLabel}
                      </span>
                    )}
                    {offer.checkedBags !== undefined && offer.checkedBags > 0 && (
                      <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                        <Luggage className="h-3 w-3" /> {offer.checkedBags} bag.
                      </span>
                    )}
                  </div>

                  {/* Trecho de Ida */}
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-medium mb-1">Ida</p>
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{offer.departure.time}</p>
                        <p className="text-xs text-slate-500">{offer.departure.airport}</p>
                        <p className="text-[10px] text-slate-400">{offer.departure.city}</p>
                      </div>
                      <div className="flex-1 flex flex-col items-center px-2">
                        <span className="text-[10px] text-slate-400 font-medium">{offer.duration}</span>
                        <div className="w-full h-px bg-slate-200 dark:bg-slate-700 relative my-1">
                          <Plane className="absolute -top-2 right-0 h-3 w-3 text-primary-500" />
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {offer.stops === 0 ? 'Direto' : `${offer.stops} parada${offer.stops > 1 ? 's' : ''}`}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-slate-900 dark:text-white">{offer.arrival.time}</p>
                        <p className="text-xs text-slate-500">{offer.arrival.airport}</p>
                        <p className="text-[10px] text-slate-400">{offer.arrival.city}</p>
                      </div>
                    </div>
                  </div>

                  {/* Trecho de Volta */}
                  {offer.returnLeg && (
                    <div className="border-t border-dashed border-slate-200 dark:border-slate-700 pt-2">
                      <p className="text-[10px] text-slate-400 uppercase font-medium mb-1">Volta</p>
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <p className="text-base font-bold text-slate-900 dark:text-white">{offer.returnLeg.departure.time}</p>
                          <p className="text-xs text-slate-500">{offer.returnLeg.departure.airport}</p>
                        </div>
                        <div className="flex-1 flex flex-col items-center px-2">
                          <span className="text-[10px] text-slate-400 font-medium">{offer.returnLeg.duration}</span>
                          <div className="w-full h-px bg-slate-200 dark:bg-slate-700 relative my-1">
                            <Plane className="absolute -top-2 right-0 h-3 w-3 text-primary-500" />
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {offer.returnLeg.stops === 0 ? 'Direto' : `${offer.returnLeg.stops} parada${offer.returnLeg.stops > 1 ? 's' : ''}`}
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="text-base font-bold text-slate-900 dark:text-white">{offer.returnLeg.arrival.time}</p>
                          <p className="text-xs text-slate-500">{offer.returnLeg.arrival.airport}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Preço */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {formatCurrency(offer.price)}
                    </p>
                    <p className="text-[10px] text-slate-400">{passengers > 1 ? `para ${passengers} passageiros` : ''}</p>
                  </div>
                  <button
                    onClick={() => handleSelectFlight(offer)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                      selectedFlight === offer.id
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                        : 'bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-950 dark:text-primary-400',
                    )}
                  >
                    {selectedFlight === offer.id ? <><Check className="h-3.5 w-3.5" /> Selecionado</> : <><Check className="h-3.5 w-3.5" /> Selecionar</>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!searched && !loading && (
        <div className="text-center py-16 text-slate-400">
          <Plane className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-sm">Preencha origem, destino e data para buscar voos</p>
        </div>
      )}

      <p className="text-[10px] text-center text-slate-400">Dados reais via Ignav API</p>
    </div>
  )
}
