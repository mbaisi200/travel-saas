'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Eye, EyeOff, Loader2, UserPlus, LogIn } from 'lucide-react'
import { signIn } from '@/lib/auth'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()

  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [agencyName, setAgencyName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/')
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (isRegister) {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, agencyName }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Erro ao cadastrar.')
        } else {
          setSuccess('Conta criada com sucesso! Faça login.')
          setIsRegister(false)
        }
      } catch (err: any) {
        setError('Erro de conexão. Tente novamente.')
      } finally {
        setLoading(false)
      }
    } else {
      try {
        const { tenantId } = await signIn(email, password)
        if (tenantId) {
          router.push('/')
        } else {
          setError('Usuário sem agência vinculada.')
        }
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
          setError('E-mail ou senha inválidos.')
        } else if (err.code === 'auth/too-many-requests') {
          setError('Muitas tentativas. Aguarde e tente novamente.')
        } else {
          setError('Erro ao fazer login. Verifique suas credenciais.')
        }
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-primary-950">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            TravelAdmin
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isRegister ? 'Crie sua conta' : 'Faça login para acessar o sistema'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nome
                </label>
                <input
                  type="text" value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nome da Agência
                </label>
                <input
                  type="text" value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  placeholder="Ex: Minha Agência"
                  required
                  className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              E-mail
            </label>
            <input
              type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoComplete="email"
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegister ? 'Crie uma senha' : 'Sua senha'}
                required
                minLength={6}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                className="w-full px-4 py-2.5 pr-10 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-rose-500 bg-rose-50 dark:bg-rose-950 px-3 py-2 rounded-lg">{error}</p>
          )}
          {success && (
            <p className="text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-2 rounded-lg">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isRegister ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            {loading ? (isRegister ? 'Cadastrando...' : 'Entrando...') : isRegister ? 'Cadastrar' : 'Entrar'}
          </button>

          <p className="text-center text-sm text-slate-500">
            {isRegister ? 'Já tem conta?' : 'Ainda não tem conta?'}{' '}
            <button type="button" onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess('') }}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {isRegister ? 'Fazer login' : 'Cadastre-se'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
