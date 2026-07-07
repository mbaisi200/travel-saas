import { useQuery } from '@tanstack/react-query'
import {
  getDocs,
  query,
  orderBy,
  where,
  type DocumentData,
} from 'firebase/firestore'
import { tenantCollectionRef } from '@/lib/firebase'
import { useTenant } from './useTenant'
import type { ChatSession } from '@/types'

function mapChatSession(id: string, data: DocumentData): ChatSession {
  return {
    id,
    tenantId: data.tenantId || '',
    customer_phone: data.customer_phone || '',
    customer_name: data.customer_name || '',
    status: data.status || 'open',
    messages: data.messages || [],
    context: data.context || { last_intent: '', qualified: false, travel_prefs: {} },
    assignedTo: data.assignedTo || '',
    createdAt: data.createdAt?.toDate?.()?.toISOString() || '',
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || '',
  }
}

export function useChatSessions(status?: 'open' | 'closed') {
  const { tenantId } = useTenant()

  return useQuery({
    queryKey: ['chat-sessions', tenantId, status],
    queryFn: async () => {
      if (!tenantId) return []
      const ref = tenantCollectionRef(tenantId, 'chat_history')
      const constraints: any[] = [orderBy('updatedAt', 'desc')]
      if (status) constraints.unshift(where('status', '==', status))
      const q = query(ref, ...constraints)
      const snap = await getDocs(q)
      return snap.docs.map((d) => mapChatSession(d.id, d.data()))
    },
    enabled: !!tenantId,
    staleTime: 30_000,
  })
}
