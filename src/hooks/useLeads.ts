import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  type DocumentData,
} from 'firebase/firestore'
import { tenantCollectionRef, tenantDocRef, getFirebaseDb } from '@/lib/firebase'
import { useTenant } from './useTenant'
import type { Lead } from '@/types'

function mapLead(id: string, data: DocumentData): Lead {
  return {
    id,
    tenantId: data.tenantId || '',
    name: data.name || '',
    phone: data.phone || '',
    email: data.email || '',
    source: data.source || 'manual',
    status: data.status || 'new',
    score: data.score || 0,
    assignedTo: data.assignedTo || '',
    origin_city: data.origin_city || '',
    destination_city: data.destination_city || '',
    travel_date: data.travel_date || '',
    budget: data.budget || 0,
    notes: data.notes || '',
    lastContact: data.lastContact || '',
    createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || '',
  }
}

export function useLeads() {
  const { tenantId } = useTenant()

  return useQuery({
    queryKey: ['leads', tenantId],
    queryFn: async () => {
      if (!tenantId) return []
      const ref = tenantCollectionRef(tenantId, 'leads')
      const q = query(ref, orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      return snap.docs.map((d) => mapLead(d.id, d.data()))
    },
    enabled: !!tenantId,
    staleTime: 30_000,
  })
}

export function useCreateLead() {
  const { tenantId } = useTenant()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<Lead>) => {
      if (!tenantId) throw new Error('Sem tenant')
      const ref = tenantCollectionRef(tenantId, 'leads')
      const docRef = await addDoc(ref, {
        ...data,
        tenantId,
        status: data.status || 'new',
        score: data.score || 50,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return docRef.id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads', tenantId] })
    },
  })
}

export function useUpdateLeadStage() {
  const { tenantId } = useTenant()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ leadId, stage }: { leadId: string; stage: string }) => {
      if (!tenantId) throw new Error('Sem tenant')
      const ref = tenantDocRef(tenantId, 'leads', leadId)
      await updateDoc(ref, {
        status: stage,
        updatedAt: serverTimestamp(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads', tenantId] })
    },
  })
}
