'use client'

import { useState } from 'react'
import { Save, Sun, Moon, Monitor, Users, Shield, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/store'

const planFeatures = {
  basic: ['3 usuários', '100 leads/mês', 'Chat básico'],
  premium: ['10 usuários', '500 leads/mês', 'Chat com IA', 'Kanban', 'Financeiro'],
  unlimited: ['Usuários ilimitados', 'Leads ilimitados', 'Chat com IA', 'Kanban', 'Financeiro', 'API Whitelabel'],
}

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore()
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl space-y-8">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Configurações
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Preferências da agência
        </p>
      </div>

      {/* Tema */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <Sun className="h-4 w-4" /> Aparência
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'light', label: 'Claro', icon: Sun },
            { value: 'dark', label: 'Escuro', icon: Moon },
            { value: 'system', label: 'Sistema', icon: Monitor },
          ].map((opt) => {
            const Icon = opt.icon
            const isActive = theme === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value as typeof theme)}
                className={cn(
                  'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-sm font-medium transition-all',
                  isActive
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300',
                )}
              >
                <Icon className="h-5 w-5" />
                {opt.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* Equipe */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <Users className="h-4 w-4" /> Equipe
        </h2>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
          {[
            { name: 'Administrador', email: 'baisimarcio@hotmail.com', role: 'Admin' },
            { name: 'Maria Agente', email: 'agente@demo.turismo', role: 'Agente' },
          ].map((member) => (
            <div key={member.email} className="flex items-center gap-3 px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                  {member.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{member.name}</p>
                <p className="text-xs text-slate-500">{member.email}</p>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Plano */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <Shield className="h-4 w-4" /> Plano Atual
        </h2>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-lg text-slate-900 dark:text-white">Premium</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
              Ativo
            </span>
          </div>
          <ul className="space-y-1.5">
            {planFeatures.premium.map((f) => (
              <li key={f} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Salvar */}
      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
      >
        <Save className="h-4 w-4" />
        {saved ? 'Salvo!' : 'Salvar alterações'}
      </button>
    </div>
  )
}
