'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Send,
  Bot,
  User,
  Phone,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Message } from '@/types'

interface ChatWidgetProps {
  sessionId?: string
  customerName?: string
  customerPhone?: string
  onSendMessage: (content: string) => Promise<void>
  onGenerateAIResponse: (content: string) => Promise<string>
  className?: string
}

export function ChatWidget({
  sessionId,
  customerName = 'Cliente',
  customerPhone,
  onSendMessage,
  onGenerateAIResponse,
  className,
}: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: `Olá! Você está conversando com ${customerName}. Como posso ajudar a qualificar este lead?`,
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'agent',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const aiResponse = await onGenerateAIResponse(userMessage.content)
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'ai',
        content: 'Desculpe, não consegui processar sua solicitação. Tente novamente.',
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  function handleQuickAction(action: string) {
    setInput(action)
  }

  const quickActions = [
    'Qualificar este lead',
    'Sugerir roteiro',
    'Resumo da conversa',
    'Enviar orçamento',
  ]

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-white dark:bg-slate-900',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
          <MessageSquare className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
            {customerName}
          </h3>
          {customerPhone && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Phone className="h-3 w-3" />
              <span>{customerPhone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex gap-2 max-w-[85%]',
              msg.role === 'agent' ? 'ml-auto flex-row-reverse' : '',
            )}
          >
            <div
              className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1',
                msg.role === 'ai'
                  ? 'bg-primary-100 dark:bg-primary-900'
                  : msg.role === 'agent'
                    ? 'bg-emerald-100 dark:bg-emerald-900'
                    : 'bg-slate-100 dark:bg-slate-800',
              )}
            >
              {msg.role === 'ai' ? (
                <Sparkles className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
              ) : msg.role === 'agent' ? (
                <User className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Bot className="h-3.5 w-3.5 text-slate-500" />
              )}
            </div>

            <div
              className={cn(
                'px-3 py-2 rounded-2xl text-sm leading-relaxed',
                msg.role === 'agent'
                  ? 'bg-primary-600 text-white rounded-tr-sm'
                  : msg.role === 'ai'
                    ? 'bg-primary-50 dark:bg-primary-950 text-slate-900 dark:text-slate-100 rounded-tl-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-sm',
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 max-w-[85%]">
            <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-3.5 w-3.5 text-primary-600" />
            </div>
            <div className="px-3 py-2 rounded-2xl bg-primary-50 dark:bg-primary-950 rounded-tl-sm">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto">
        {quickActions.map((action) => (
          <button
            key={action}
            onClick={() => handleQuickAction(action)}
            disabled={loading}
            className="flex-shrink-0 px-3 py-1 text-xs font-medium text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-950 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua mensagem..."
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
