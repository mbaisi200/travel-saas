'use client'

import { Draggable } from '@hello-pangea/dnd'
import { Phone, Mail, MapPin, Calendar, DollarSign } from 'lucide-react'
import { cn, getScoreColor, formatCurrency, formatDate } from '@/lib/utils'
import type { Lead } from '@/types'

interface LeadCardProps {
  lead: Lead
  index: number
  onClick: (lead: Lead) => void
}

export function LeadCard({ lead, index, onClick }: LeadCardProps) {
  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(lead)}
          className={cn(
            'bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 space-y-2 cursor-pointer transition-shadow',
            snapshot.isDragging
              ? 'shadow-lg ring-2 ring-primary-500'
              : 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600',
          )}
        >
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
              {lead.name}
            </h4>
            <span
              className={cn(
                'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
                getScoreColor(lead.score),
              )}
            >
              {lead.score}%
            </span>
          </div>

          <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
            {lead.destination_city && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{lead.origin_city || '—'} → {lead.destination_city}</span>
              </div>
            )}
            {lead.budget > 0 && (
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-3 w-3 flex-shrink-0" />
                <span>{formatCurrency(lead.budget)}</span>
              </div>
            )}
            {lead.travel_date && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span>{formatDate(lead.travel_date)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            {lead.phone && <Phone className="h-3 w-3 text-slate-400" />}
            {lead.email && <Mail className="h-3 w-3 text-slate-400" />}
          </div>
        </div>
      )}
    </Draggable>
  )
}
