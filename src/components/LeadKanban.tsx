'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react'
import { LeadCard } from './LeadCard'
import { cn } from '@/lib/utils'
import type { Lead, PipelineStage } from '@/types'

const defaultStages: PipelineStage[] = [
  { id: 'new', name: 'Novo', order: 0, color: 'bg-slate-400' },
  { id: 'qualified', name: 'Qualificado', order: 1, color: 'bg-blue-400' },
  { id: 'budget_sent', name: 'Orçamento Enviado', order: 2, color: 'bg-amber-400' },
  { id: 'negotiation', name: 'Negociação', order: 3, color: 'bg-purple-400' },
  { id: 'closed', name: 'Fechado', order: 4, color: 'bg-emerald-400' },
  { id: 'lost', name: 'Perdido', order: 5, color: 'bg-rose-400' },
]

const stageColors: Record<string, string> = {
  new: 'bg-slate-400',
  qualified: 'bg-blue-400',
  budget_sent: 'bg-amber-400',
  negotiation: 'bg-purple-400',
  closed: 'bg-emerald-400',
  lost: 'bg-rose-400',
}

interface LeadKanbanProps {
  leads: Lead[]
  stages?: PipelineStage[]
  onStageChange: (leadId: string, newStage: string) => void
  onLeadClick: (lead: Lead) => void
  onNewLead: () => void
}

export function LeadKanban({
  leads,
  stages = defaultStages,
  onStageChange,
  onLeadClick,
  onNewLead,
}: LeadKanbanProps) {
  const [selectedStage, setSelectedStage] = useState<string | null>(null)

  const groupedLeads = stages.reduce(
    (acc, stage) => {
      acc[stage.id] = leads.filter((l) => l.status === stage.id)
      return acc
    },
    {} as Record<string, Lead[]>,
  )

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return

    const { draggableId, destination } = result
    onStageChange(draggableId, destination.droppableId)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Pipeline de Vendas
        </h2>
        <button
          onClick={onNewLead}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Novo Lead
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto p-4">
          <div className="flex gap-4 h-full min-w-max">
            {stages
              .sort((a, b) => a.order - b.order)
              .map((stage) => (
                <div
                  key={stage.id}
                  className="flex flex-col w-72 flex-shrink-0"
                >
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full',
                        stageColors[stage.id] || 'bg-slate-400',
                      )}
                    />
                    <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                      {stage.name}
                    </span>
                    <span className="text-xs text-slate-400 font-medium ml-auto">
                      {groupedLeads[stage.id]?.length || 0}
                    </span>
                  </div>

                  <Droppable droppableId={stage.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                          'flex-1 p-2 rounded-lg space-y-2 min-h-[200px] overflow-y-auto transition-colors',
                          snapshot.isDraggingOver
                            ? 'bg-primary-50 dark:bg-primary-950/30'
                            : 'bg-slate-50 dark:bg-slate-800/50',
                        )}
                      >
                        {groupedLeads[stage.id]?.map((lead, index) => (
                          <LeadCard
                            key={lead.id}
                            lead={lead}
                            index={index}
                            onClick={onLeadClick}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
          </div>
        </div>
      </DragDropContext>
    </div>
  )
}
