'use client'

import { useEffect, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { useThemeStore } from '@/store'

const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useThemeStore()

  useEffect(() => {
    setTheme(theme)

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => setTheme('system')
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'text-sm',
          duration: 3000,
        }}
      />
    </QueryClientProvider>
  )
}
