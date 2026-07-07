'use client'

import { useEffect, useState } from 'react'
import { onAuthChange, getUserClaims, type UserClaims } from '@/lib/auth'

export function useAuth() {
  const [claims, setClaims] = useState<UserClaims | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthChange(async (user) => {
      if (user) {
        const c = await getUserClaims()
        setClaims(c)
      } else {
        setClaims(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  return { claims, loading, isAuthenticated: !!claims }
}
