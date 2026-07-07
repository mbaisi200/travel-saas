'use client'

import { useState } from 'react'
import { Search, Circle, Plus, Loader2 } from 'lucide-react'
import { ChatWidget } from '@/components/ChatWidget'
import { cn, formatRelativeDate } from '@/lib/utils'
import { useChatSessions } from '@/hooks/useChatSessions'
import { useTenant } from '@/hooks/useTenant'

export default function ChatPage() {
  const { data: sessions, isLoading } = useChatSessions()
  const { tenantId } = useTenant()
  const [activeSession, setActiveSession] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = (sessions || []).filter((s) =>
    s.customer_name?.toLowerCase().includes(search.toLowerCase()),
  )

  const activeData = sessions?.find((s) => s.id === activeSession)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-6 w-6 text-primary-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] lg:h-screen">
      <div className={cn(
        'w-full lg:w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col',
        activeSession && 'hidden lg:flex',
      )}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">Conversas</h2>
            <button className="p-1.5 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950 rounded-lg transition-colors">
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar conversas..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.length > 0 ? (
            filtered.map((session) => {
              const lastMsg = session.messages?.[session.messages.length - 1]
              return (
                <button
                  key={session.id}
                  onClick={() => setActiveSession(session.id)}
                  className={cn(
                    'w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors',
                    activeSession === session.id && 'bg-primary-50 dark:bg-primary-950',
                  )}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                        {session.customer_name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <Circle className={cn(
                      'absolute -bottom-0.5 -right-0.5 h-3 w-3',
                      session.status === 'open'
                        ? 'text-emerald-500 fill-emerald-500'
                        : 'text-slate-400 fill-slate-400',
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {session.customer_name || 'Cliente'}
                      </span>
                      <span className="text-xs text-slate-400 flex-shrink-0">
                        {session.updatedAt ? formatRelativeDate(session.updatedAt) : ''}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {lastMsg?.content || 'Nenhuma mensagem'}
                    </p>
                  </div>
                </button>
              )
            })
          ) : (
            <div className="px-4 py-8 text-center text-sm text-slate-400">
              Nenhuma conversa encontrada
            </div>
          )}
        </div>
      </div>

      <div className={cn(
        'flex-1',
        !activeSession && 'hidden lg:flex lg:items-center lg:justify-center',
      )}>
        {activeData ? (
          <ChatWidget
            sessionId={activeData.id}
            customerName={activeData.customer_name}
            customerPhone={activeData.customer_phone}
            onSendMessage={async () => {}}
            onGenerateAIResponse={async (msg) => {
              await new Promise((r) => setTimeout(r, 1000))
              return `Mensagem recebida. Em breve um agente responderá.`
            }}
          />
        ) : (
          <div className="text-center text-slate-400 dark:text-slate-600">
            <p className="text-sm">Selecione uma conversa para começar</p>
          </div>
        )}
      </div>
    </div>
  )
}
