'use client'

import { FlightSearch } from '@/components/FlightSearch'
import type { FlightOffer } from '@/types/flights'

export default function FlightsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Consultar Passagens
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Busque preços de passagens aéreas em tempo real
        </p>
      </div>

      <FlightSearch
        onSelectFlight={(flight) => {
          console.log('Voo selecionado:', flight)
        }}
      />
    </div>
  )
}
