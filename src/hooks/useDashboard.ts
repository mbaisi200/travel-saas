import { useQuery } from '@tanstack/react-query'
import {
  getDocs,
  query,
  where,
  collection,
  getCountFromServer,
} from 'firebase/firestore'
import { getFirebaseDb, tenantCollectionRef } from '@/lib/firebase'
import { useTenant } from './useTenant'
import type { Lead } from '@/types'

export function useDashboard() {
  const { tenantId } = useTenant()

  return useQuery({
    queryKey: ['dashboard', tenantId],
    queryFn: async () => {
      if (!tenantId) {
        return { totalLeads: 0, qualifiedLeads: 0, closedLeads: 0, totalRevenue: 0 }
      }

      const db = getFirebaseDb()
      const leadsRef = tenantCollectionRef(tenantId, 'leads')
      const paymentsRef = tenantCollectionRef(tenantId, 'payments')

      const [leadsSnap, paymentsSnap] = await Promise.all([
        getDocs(leadsRef),
        getDocs(paymentsRef),
      ])

      const leads = leadsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Lead))
      const qualifiedLeads = leads.filter((l) => l.status !== 'new' && l.status !== 'lost')
      const closedLeads = leads.filter((l) => l.status === 'closed')
      const totalRevenue = paymentsSnap.docs
        .filter((d) => d.data().type === 'in' && d.data().status === 'paid')
        .reduce((acc, d) => acc + (d.data().amount || 0), 0)

      return {
        totalLeads: leads.length,
        qualifiedLeads: qualifiedLeads.length,
        closedLeads: closedLeads.length,
        totalRevenue,
      }
    },
    enabled: !!tenantId,
    staleTime: 30_000,
  })
}
