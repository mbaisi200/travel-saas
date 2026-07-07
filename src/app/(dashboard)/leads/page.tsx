'use client'

import { useState } from 'react'
import { Loader2, Plus } from 'lucide-react'
import { LeadKanban } from '@/components/LeadKanban'
import { useLeads, useUpdateLeadStage, useCreateLead } from '@/hooks/useLeads'
import type { Lead } from '@/types'

export default function LeadsPage() {
  const { data: leads, isLoading } = useLeads()
  const updateStage = useUpdateLeadStage()
  const [showNewLead, setShowNewLead] = useState(false)

  function handleStageChange(leadId: string, newStage: string) {
    updateStage.mutate({ leadId, stage: newStage })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-6 w-6 text-primary-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-screen">
      <LeadKanban
        leads={leads || []}
        onStageChange={handleStageChange}
        onLeadClick={(lead) => console.log('Lead:', lead)}
        onNewLead={() => setShowNewLead(true)}
      />

      {/* Modal simples de novo lead */}
      {showNewLead && (
        <NewLeadModal onClose={() => setShowNewLead(false)} />
      )}
    </div>
  )
}

function NewLeadModal({ onClose }: { onClose: () => void }) {
  const createLead = useCreateLead()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    await createLead.mutateAsync({
      name: data.get('name') as string,
      phone: data.get('phone') as string,
      email: data.get('email') as string,
      origin_city: data.get('origin') as string,
      destination_city: data.get('destination') as string,
      budget: Number(data.get('budget')) || 0,
      travel_date: data.get('travel_date') as string,
      notes: data.get('notes') as string,
      source: 'manual',
      score: 50,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 dark:text-white">Novo Lead</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input name="name" label="Nome" required />
            <Input name="phone" label="Telefone" type="tel" />
          </div>
          <Input name="email" label="E-mail" type="email" />
          <div className="grid grid-cols-2 gap-3">
            <Input name="origin" label="Origem" />
            <Input name="destination" label="Destino" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input name="budget" label="Orçamento" type="number" />
            <Input name="travel_date" label="Data da Viagem" type="date" />
          </div>
          <Input name="notes" label="Observações" />

          <button
            type="submit"
            disabled={createLead.isPending}
            className="w-full py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {createLead.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {createLead.isPending ? 'Criando...' : 'Criar Lead'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Input({ label, name, type = 'text', required }: {
  label: string; name: string; type?: string; required?: boolean
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/50"
      />
    </div>
  )
}
