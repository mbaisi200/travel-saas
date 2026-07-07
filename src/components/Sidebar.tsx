'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Wallet,
  Plane,
  Settings,
  LogOut,
  Building2,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from '@/lib/auth'
import { useTenant } from '@/hooks/useTenant'

interface NavSection {
  label: string
  items: { label: string; href: string; icon: LucideIcon }[]
}

const navSections: NavSection[] = [
  {
    label: 'Principal',
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard },
      { label: 'Voos', href: '/flights', icon: Plane },
      { label: 'Hotéis', href: '/hotels', icon: Building2 },
      { label: 'Leads', href: '/leads', icon: Users },
      { label: 'Chat', href: '/chat', icon: MessageSquare },
      { label: 'Financeiro', href: '/finance', icon: Wallet },
    ],
  },
  {
    label: 'Administração',
    items: [
      { label: 'Configurações', href: '/settings', icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isMaster } = useTenant()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 px-6 h-16 border-b border-slate-200 dark:border-slate-800">
        <Building2 className="h-6 w-6 text-primary-600" />
        <span className="font-bold text-lg text-slate-900 dark:text-white">
          TravelAdmin
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}

        {isMaster && (
          <div>
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-amber-500 mb-2">
              Master
            </p>
            <Link
              href="/master"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950"
            >
              <Building2 className="h-4 w-4" />
              Painel Master
            </Link>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={async () => {
            await signOut()
            router.push('/login')
          }}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}
