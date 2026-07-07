'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import {
  Building2,
  Search,
  MapPin,
  Users,
  Star,
  Loader2,
  AlertCircle,
  Check,
  Sun,
  Moon,
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { useHotels } from '@/hooks/useHotels'
import type { RoomOffer } from '@/types/hotels'

const starOptions = [0, 3, 4, 5]
const starLabels: Record<number, string> = { 0: 'Qualquer', 3: '3★', 4: '4★', 5: '5★' }

export function HotelSearch({ className }: { className?: string }) {
  const { offers, loading, searched, error, searchHotels, searchCities } = useHotels()

  const [city, setCity] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [starsMin, setStarsMin] = useState(0)
  const [maxPrice, setMaxPrice] = useState(0)

  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'price' | 'stars' | 'rating'>('price')

  const cityRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleCityChange = useCallback((val: string) => {
    setCity(val)
    setSuggestions(searchCities(val))
    setShowSuggestions(true)
  }, [searchCities])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!city || !checkIn || !checkOut) return
    searchHotels({ city, checkIn, checkOut, guests, starsMin: starsMin || undefined, maxPrice: maxPrice || undefined })
  }

  function getStars(stars: number) {
    return Array.from({ length: 5 }, (_, i) => i < stars)
  }

  const sortedOffers = [...offers].sort((a, b) => {
    if (sortBy === 'price') return a.totalPrice - b.totalPrice
    if (sortBy === 'stars') return b.stars - a.stars
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  return (
    <div className={cn('space-y-6', className)}>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <Building2 className="h-4 w-4" />
          Buscar Hotéis
        </div>

        <div ref={cityRef} className="relative">
          <label className="text-xs font-medium text-slate-500 mb-1 block">Destino</label>
          <input
            type="text" value={city}
            onChange={(e) => handleCityChange(e.target.value)}
            placeholder="Bonito/MS, Rio de Janeiro, Salvador..."
            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/50"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {suggestions.map((c) => (
                <button key={c} type="button"
                  onClick={() => { setCity(c); setShowSuggestions(false) }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <MapPin className="h-3 w-3 text-slate-400" />
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Check-in</label>
            <input type="date" value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Check-out</label>
            <input type="date" value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Hóspedes</label>
            <select value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? 'hóspede' : 'hóspedes'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Até R$</label>
            <input type="number" value={maxPrice || ''}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              placeholder="Sem limite" min={0}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>
        </div>

        {/* Estrelas */}
        <div className="flex gap-1">
          {starOptions.map((s) => (
            <button key={s} type="button" onClick={() => setStarsMin(s)}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                starsMin === s
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200',
              )}
            >
              {s > 0 ? <><Star className="h-3 w-3 fill-current" /> {s}★</> : 'Qualquer'}
            </button>
          ))}
        </div>

        <button type="submit"
          disabled={!city || !checkIn || !checkOut || loading}
          className="w-full py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {loading ? 'Buscando...' : 'Buscar Hotéis'}
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 dark:bg-rose-950 text-rose-600 rounded-lg text-sm">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {searched && !loading && (
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-slate-500">{offers.length} hotéis encontrados</p>
          <div className="flex gap-1">
            {(['price', 'stars', 'rating'] as const).map((s) => (
              <button key={s} onClick={() => setSortBy(s)}
                className={cn(
                  'px-2.5 py-1 text-xs font-medium rounded-lg',
                  sortBy === s
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800',
                )}
              >
                {s === 'price' ? 'Menor Preço' : s === 'stars' ? 'Estrelas' : 'Avaliação'}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
          <p className="text-sm text-slate-400 mt-3">Buscando hotéis...</p>
        </div>
      ) : searched && offers.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <Building2 className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Nenhum hotel encontrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedOffers.map((hotel) => (
            <div
              key={hotel.id}
              className={cn(
                'bg-white dark:bg-slate-900 rounded-xl border p-4 transition-all',
                selectedHotel === hotel.id
                  ? 'border-primary-500 ring-2 ring-primary-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300',
              )}
            >
              <div className="flex gap-4">
                {/* Placeholder da imagem */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-8 w-8 text-primary-400" />
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{hotel.hotelName}</h3>
                    <div className="flex items-center gap-0.5">
                      {getStars(hotel.stars).map((filled, i) => (
                        <Star key={i} className={cn('h-3 w-3', filled ? 'fill-amber-400 text-amber-400' : 'text-slate-300')} />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                      {hotel.rating}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {hotel.city}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{hotel.roomType}</span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{hotel.boardType}</span>
                    <span>{hotel.nights} {hotel.nights === 1 ? 'noite' : 'noites'}</span>
                  </div>

                  <div className="flex gap-1 flex-wrap">
                    {hotel.amenities.slice(0, 4).map((a) => (
                      <span key={a} className="text-[10px] text-slate-400">{a}</span>
                    ))}
                  </div>

                  {hotel.cancellationPolicy && (
                    <p className="text-[10px] text-emerald-600">{hotel.cancellationPolicy}</p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">a partir de</p>
                    <p className="text-2xl font-bold text-primary-600">
                      {formatCurrency(hotel.totalPrice)}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {formatCurrency(hotel.pricePerNight)}/noite
                    </p>
                  </div>
                  <button onClick={() => setSelectedHotel(hotel.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                      selectedHotel === hotel.id
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-950 dark:text-primary-400',
                    )}
                  >
                    {selectedHotel === hotel.id ? <><Check className="h-3.5 w-3.5" /> Selecionado</> : 'Selecionar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!searched && !loading && (
        <div className="text-center py-16 text-slate-400">
          <Building2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-sm">Escolha um destino e datas para buscar hotéis</p>
        </div>
      )}

      <p className="text-[10px] text-center text-slate-400">
        {process.env.NEXT_PUBLIC_HOTELBEDS_API_KEY ? 'Dados reais via Hotelbeds API' : 'Dados simulados — cadastre-se em hotelbeds.com/partners para chave real'}
      </p>
    </div>
  )
}
