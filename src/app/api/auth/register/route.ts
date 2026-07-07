import { NextResponse } from 'next/server'
import { getAdmin } from '@/lib/firebase-admin'
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
  try {
    const { email, password, name, agencyName } = await req.json()

    if (!email || !password || !name || !agencyName) {
      return NextResponse.json({ error: 'Campos obrigatórios: email, password, name, agencyName' }, { status: 400 })
    }

    // Inicializa Admin SDK sob demanda (não falha se não configurado em build time)
    let adminAuth: any, adminDb: any
    try {
      const admin = getAdmin()
      adminAuth = admin.adminAuth
      adminDb = admin.adminDb
    } catch {
      return NextResponse.json({ error: 'Cadastro temporariamente indisponível. Admin SDK não configurado.' }, { status: 500 })
    }

    const tenantId = agencyName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30)

    const user = await adminAuth.createUser({
      email,
      password,
      uid: `${tenantId}|${randomUUID()}`,
      displayName: name,
    })

    await adminAuth.setCustomUserClaims(user.uid, {
      tenantId,
      role: 'admin',
      master: false,
    })

    await adminDb.doc(`tenants/${tenantId}`).set({
      name: agencyName,
      slug: tenantId,
      createdAt: new Date().toISOString(),
      createdBy: user.uid,
      settings: {
        currency: 'BRL',
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
      },
    })

    await adminDb.doc(`tenants/${tenantId}/users/${user.uid}`).set({
      name,
      email,
      role: 'admin',
      tenantId,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      tenantId,
      uid: user.uid,
      message: 'Conta criada com sucesso! Faça login.',
    })
  } catch (err: any) {
    const message = err.code === 'auth/email-already-exists'
      ? 'E-mail já cadastrado.'
      : err.message || 'Erro ao criar conta.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
