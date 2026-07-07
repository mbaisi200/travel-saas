'use client'

import { useState } from 'react'
import { Building2, Users, CreditCard, DollarSign, Search, MoreVertical, Lock, Unlock } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'

const mockTenants = [
  {
    id: 'agencia-demo',
    name: 'Agência Demo Turismo',
    plan: 'premium',
    status: 'active',
    users: 2,
    leads: 48,
    revenue: 84750,
    createdAt: '07/2026',
  },
  {
    id: 'agencia-b',
    name: 'Agência B Viagens',
    plan: 'basic',
    status: 'active',
    users: 1,
    leads: 12,
    revenue: 12300,
    createdAt: '07/2026',
  },
  {
    id: 'agencia-c',
    name: 'C Turismo Ltda',
    plan: 'basic',
    status: 'blocked',
    users: 0,
    leads: 0,
    revenue: 0,
    createdAt: '06/2026',
  },
]

const plans = [
  { id: 'basic', name: 'Básico', price: 197, maxUsers: 3, maxLeads: 100, color: 'bg-slate-400' },
  { id: 'premium', name: 'Premium', price: 497, maxUsers: 10, maxLeads: 500, color: 'bg-primary-500' },
  { id: 'unlimited', name: 'Ilimitado', price: 997, maxUsers: -1, maxLeads: -1, color: 'bg-amber-500' },
]

export default function MasterPage() {
  const [search, setSearch] = useState('')
  const [tenants] = useState(mockTenants)

  const filtered = tenants.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  )

  const totalMRR = tenants
    .filter((t) => t.status === 'active')
    .reduce((acc, t) => {
      const plan = plans.find((p) => p.id === t.plan)
      return acc + (plan?.price || 0)
    }, 0)

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
          <Building2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Painel Master
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Administração de todas as agências
          </p>
        </div>
      </div>

      {/* Métricas Master */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Agências Ativas', value: '2', icon: Building2, color: 'bg-emerald-500' },
          { label: 'Total de Usuários', value: '3', icon: Users, color: 'bg-blue-500' },
          { label: 'MRR (Receita Recorrente)', value: formatCurrency(totalMRR), icon: DollarSign, color: 'bg-primary-500' },
          { label: 'Planos Vendidos', value: '2/3 ativos', icon: CreditCard, color: 'bg-amber-500' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', stat.color)}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Planos */}
      <div>
        <h2 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-3">Planos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2">
              <div className={cn('w-2 h-2 rounded-full', plan.color)} />
              <p className="font-bold text-slate-900 dark:text-white">{plan.name}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(plan.price)}
                <span className="text-sm font-normal text-slate-400">/mês</span>
              </p>
              <ul className="space-y-1 text-xs text-slate-500">
                <li>• {plan.maxUsers === -1 ? 'Usuários ilimitados' : `Até ${plan.maxUsers} usuários`}</li>
                <li>• {plan.maxLeads === -1 ? 'Leads ilimitados' : `Até ${plan.maxLeads} leads/mês`}</li>
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de Agências */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar agência..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm outline-none"
            />
          </div>
          <button className="px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
            + Nova Agência
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.map((tenant) => (
            <div key={tenant.id} className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-slate-500">{tenant.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{tenant.name}</p>
                  <span className={cn(
                    'text-[10px] font-medium px-1.5 py-0.5 rounded-full',
                    tenant.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
                  )}>
                    {tenant.status === 'active' ? 'Ativo' : 'Bloqueado'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {tenant.users} usuários · {tenant.leads} leads · Plano {tenant.plan}
                </p>
              </div>
              <div className="text-right text-sm font-medium text-slate-900 dark:text-white">
                {tenant.revenue > 0 ? formatCurrency(tenant.revenue) : '—'}
              </div>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                {tenant.status === 'active' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              </button>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
