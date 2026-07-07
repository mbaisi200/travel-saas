/**
 * Script de seed — cria tenant + configura usuário existente como Master.
 *
 * Uso:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed.ts
 */

import * as admin from 'firebase-admin'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

async function seed() {
  const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
  if (!saPath) {
    console.error('ERRO: Defina FIREBASE_SERVICE_ACCOUNT_PATH no .env.local')
    process.exit(1)
  }

  admin.initializeApp({
    credential: admin.credential.cert(saPath),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  })

  const db = admin.firestore()
  const auth = admin.auth()

  const tenantId = 'agencia-demo'
  const masterEmail = 'baisimarcio@hotmail.com'

  // ─── 1. Criar Tenant ───
  const tenantRef = db.collection('tenants').doc(tenantId)
  const tenantSnap = await tenantRef.get()

  if (!tenantSnap.exists) {
    await tenantRef.set({
      name: 'Agência Demo Turismo',
      cnpj: '00.000.000/0001-00',
      phone: '(11) 3000-0000',
      email: 'contato@demo.turismo',
      logo_url: '',
      plan: 'premium',
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    console.log('✓ Tenant criado: agencia-demo')
  } else {
    console.log('→ Tenant já existe: agencia-demo')
  }

  // ─── 2. Configurar usuário existente como Master ───
  try {
    const user = await auth.getUserByEmail(masterEmail)

    const uid = user.uid

    await auth.setCustomUserClaims(uid, {
      tenantId,
      role: 'admin',
      master: true,
    })

    await db.collection('tenants').doc(tenantId).collection('users').doc(uid).set({
      name: user.displayName || 'Administrador',
      email: masterEmail,
      role: 'admin',
      tenantId,
      master: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true })

    console.log(`✓ Usuário configurado como Master: ${masterEmail}`)
    console.log(`  Claims: tenantId=${tenantId}, role=admin, master=true`)
    console.log(`  UID: ${uid}`)
  } catch (err: any) {
    if (err.code === 'auth/user-not-found') {
      console.error(`✗ Usuário ${masterEmail} não encontrado no Authentication.`)
      console.error('  Crie-o manualmente no Console Firebase > Authentication > Adicionar usuário')
      process.exit(1)
    }
    throw err
  }

  // ─── 3. Criar usuário agente de teste ───
  const agentEmail = 'agente@demo.turismo'
  const agentPassword = 'Agente@123'

  try {
    const agent = await auth.createUser({
      uid: `${tenantId}|agente-001`,
      email: agentEmail,
      password: agentPassword,
      displayName: 'Maria Agente',
    })

    await auth.setCustomUserClaims(agent.uid, {
      tenantId,
      role: 'agent',
      master: false,
    })

    await db.collection('tenants').doc(tenantId).collection('users').doc(agent.uid).set({
      name: 'Maria Agente',
      email: agentEmail,
      role: 'agent',
      tenantId,
      master: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    console.log(`✓ Agente criado: ${agentEmail} / ${agentPassword}`)
  } catch (err: any) {
    if (err.code === 'auth/email-already-exists') {
      console.log(`→ Agente já existe: ${agentEmail}`)
    } else {
      throw err
    }
  }

  console.log('\n✅ Seed concluído!')
  console.log(`   Master: ${masterEmail} (use sua senha atual)`)
  console.log(`   Agente: ${agentEmail} / ${agentPassword}`)
}

seed().catch(console.error)
