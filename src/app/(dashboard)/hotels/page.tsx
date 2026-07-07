import { Metadata } from 'next'
import { HotelSearch } from '@/components/HotelSearch'

export const metadata: Metadata = {
  title: 'Hotéis',
  description: 'Busca e reserva de hotéis',
}

export default function HotelsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hotéis</h1>
        <p className="text-sm text-slate-500 mt-1">Busque e reserve hotéis no Brasil e no mundo</p>
      </div>
      <HotelSearch />
    </div>
  )
}
