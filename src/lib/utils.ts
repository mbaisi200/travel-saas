import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeDate(date: string): string {
  const now = new Date()
  const target = new Date(date)
  const diff = now.getTime() - target.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Hoje'
  if (days === 1) return 'Ontem'
  if (days < 7) return `Há ${days} dias`
  if (days < 30) return `Há ${Math.floor(days / 7)} semanas`
  return formatDate(date)
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950'
  if (score >= 50) return 'text-amber-500 bg-amber-50 dark:bg-amber-950'
  return 'text-rose-500 bg-rose-50 dark:bg-rose-950'
}

export function getLeadStatusColor(status: string): string {
  const colors: Record<string, string> = {
    new: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    qualified: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    budget_sent: 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300',
    negotiation: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    closed: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300',
    lost: 'bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-300',
  }
  return colors[status] || colors.new
}

export function generateId(): string {
  return crypto.randomUUID?.() || Math.random().toString(36).slice(2, 15)
}
