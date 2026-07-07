import { useQuery } from '@tanstack/react-query'
import { getDocs, query, orderBy, type DocumentData } from 'firebase/firestore'
import { tenantCollectionRef } from '@/lib/firebase'
import { useTenant } from './useTenant'
import type { Payment } from '@/types'

function mapPayment(id: string, data: DocumentData): Payment {
  return {
    id,
    tenantId: data.tenantId || '',
    type: data.type || 'in',
    category: data.category || 'commission',
    amount: data.amount || 0,
    due_date: data.due_date || '',
    paid_date: data.paid_date || '',
    status: data.status || 'pending',
    supplier_id: data.supplier_id || '',
    booking_id: data.booking_id || '',
    description: data.description || '',
    createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
  }
}

export function usePayments() {
  const { tenantId } = useTenant()

  return useQuery({
    queryKey: ['payments', tenantId],
    queryFn: async () => {
      if (!tenantId) return []
      const ref = tenantCollectionRef(tenantId, 'payments')
      const q = query(ref, orderBy('due_date', 'desc'))
      const snap = await getDocs(q)
      return snap.docs.map((d) => mapPayment(d.id, d.data()))
    },
    enabled: !!tenantId,
    staleTime: 30_000,
  })
}
