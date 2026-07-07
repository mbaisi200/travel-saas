'use client'

import {
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { useDashboard } from '@/hooks/useDashboard'
import { useLeads } from '@/hooks/useLeads'

export default function DashboardPage() {
  const { data: metrics, isLoading } = useDashboard()
  const { data: leads } = useLeads()

  const stats = [
    {
      label: 'Leads no Mês',
      value: String(metrics?.totalLeads || 0),
      change: '+0%',
      trend: 'up' as const,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: 'Em Negociação',
      value: String(metrics?.qualifiedLeads || 0),
      change: '+0%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'bg-emerald-500',
    },
    {
      label: 'Faturamento',
      value: formatCurrency(metrics?.totalRevenue || 0),
      change: '+0%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'bg-primary-500',
    },
    {
      label: 'Vendas Fechadas',
      value: String(metrics?.closedLeads || 0),
      change: '+0%',
      trend: 'up' as const,
      icon: CheckCircle2,
      color: 'bg-amber-500',
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-6 w-6 text-primary-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Resumo da sua agência
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', stat.color)}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className={cn(
                  'flex items-center gap-0.5 text-xs font-medium',
                  stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600',
                )}>
                  {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-semibold text-sm text-slate-900 dark:text-white">
            Leads Recentes
          </h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {leads && leads.length > 0 ? (
            leads.slice(0, 5).map((lead) => (
              <div
                key={lead.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                    {lead.name?.charAt(0) || '?'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {lead.name || 'Sem nome'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {lead.destination_city || 'Sem destino'}
                    {lead.travel_date ? ` • ${lead.travel_date}` : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {lead.budget ? formatCurrency(lead.budget) : '—'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-sm text-slate-400">
              Nenhum lead ainda. Crie o primeiro lead na página de Leads.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
