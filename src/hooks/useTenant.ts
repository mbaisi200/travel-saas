'use client'

import { useAuth } from './useAuth'

export function useTenant() {
  const { claims } = useAuth()

  return {
    tenantId: claims?.tenantId ?? null,
    role: claims?.role ?? null,
    isMaster: claims?.master ?? false,
    isAdmin: claims?.role === 'admin',
    isManager: claims?.role === 'manager' || claims?.role === 'admin',
  }
}
