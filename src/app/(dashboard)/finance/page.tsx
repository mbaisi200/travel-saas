'use client'

import { useState } from 'react'
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  FileText,
  Loader2,
  CircleDot,
} from 'lucide-react'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { usePayments } from '@/hooks/usePayments'
import { useLeads } from '@/hooks/useLeads'

export default function FinancePage() {
  const { data: payments, isLoading } = usePayments()
  const [filter, setFilter] = useState<'all' | 'in' | 'out'>('all')

  const filtered = (payments || []).filter(
    (t) => filter === 'all' || t.type === filter,
  )

  const totalReceber = (payments || [])
    .filter((p) => p.type === 'in' && p.status !== 'paid')
    .reduce((acc, p) => acc + p.amount, 0)

  const totalPagar = (payments || [])
    .filter((p) => p.type === 'out' && p.status !== 'paid')
    .reduce((acc, p) => acc + p.amount, 0)

  const comissoesPendentes = (payments || [])
    .filter((p) => p.type === 'in' && p.status === 'pending')
    .reduce((acc, p) => acc + p.amount, 0)

  const lucroLiquido = totalReceber - totalPagar

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-6 w-6 text-primary-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Financeiro</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Controle de comissões e contas
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 dark:bg-primary-950 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Exportar</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'A Receber', value: formatCurrency(totalReceber), color: 'text-emerald-600' },
          { label: 'A Pagar', value: formatCurrency(totalPagar), color: 'text-rose-600' },
          { label: 'Comissões Pendentes', value: formatCurrency(comissoesPendentes), color: 'text-amber-600' },
          { label: 'Lucro Líquido', value: formatCurrency(Math.max(lucroLiquido, 0)), color: 'text-emerald-600' },
        ].map((card) => (
          <div key={card.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">{card.label}</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-semibold text-sm text-slate-900 dark:text-white">Transações</h2>
          <div className="flex gap-1">
            {(['all', 'in', 'out'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-2.5 py-1 text-xs font-medium rounded-lg transition-colors',
                  filter === f
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800',
                )}
              >
                {f === 'all' ? 'Todas' : f === 'in' ? 'Receitas' : 'Despesas'}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.length > 0 ? (
            filtered.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                  tx.type === 'in'
                    ? 'bg-emerald-100 dark:bg-emerald-900'
                    : 'bg-rose-100 dark:bg-rose-900',
                )}>
                  {tx.type === 'in'
                    ? <ArrowUpRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    : <ArrowDownRight className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {tx.description || tx.category}
                  </p>
                  <p className="text-xs text-slate-500">
                    Vence {tx.due_date ? formatDate(tx.due_date) : '—'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(tx.amount)}
                  </p>
                  <span className={cn(
                    'text-[10px] font-medium px-1.5 py-0.5 rounded-full',
                    tx.status === 'paid'
                      ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950'
                      : tx.status === 'pending'
                        ? 'text-amber-600 bg-amber-50 dark:bg-amber-950'
                        : 'text-rose-600 bg-rose-50 dark:bg-rose-950',
                  )}>
                    {tx.status === 'paid' ? 'Pago' : tx.status === 'pending' ? 'Pendente' : 'Atrasado'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-sm text-slate-400">
              Nenhuma transação encontrada
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
