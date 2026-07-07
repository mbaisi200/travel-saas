import type { ServiceAccount } from 'firebase-admin'

function getServiceAccount(): ServiceAccount | null {
  try {
    const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
    if (saPath) {
      const fs = require('fs') as typeof import('fs')
      const path = require('path') as typeof import('path')
      if (fs.existsSync(path.resolve(saPath))) {
        const data = JSON.parse(fs.readFileSync(path.resolve(saPath), 'utf-8'))
        return {
          projectId: data.project_id,
          clientEmail: data.client_email,
          privateKey: data.private_key,
        }
      }
    }

    const projectId = process.env.FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const privateKey = process.env.FIREBASE_PRIVATE_KEY

    if (projectId && clientEmail && privateKey) {
      return {
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }
    }

    return null
  } catch {
    return null
  }
}

let cachedAuth: any = null
let cachedDb: any = null

function getAdmin() {
  if (cachedAuth) return { adminAuth: cachedAuth, adminDb: cachedDb }

  const sa = getServiceAccount()
  if (!sa) {
    throw new Error(
      'Firebase Admin SDK não configurado. Defina FIREBASE_SERVICE_ACCOUNT_PATH ' +
      'ou as variáveis FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY.'
    )
  }

  const { initializeApp, getApps, cert } = require('firebase-admin/app') as typeof import('firebase-admin/app')
  const { getAuth } = require('firebase-admin/auth') as typeof import('firebase-admin/auth')
  const { getFirestore } = require('firebase-admin/firestore') as typeof import('firebase-admin/firestore')

  const apps = getApps()
  const app = apps.length === 0
    ? initializeApp({ credential: cert(sa) })
    : apps[0]

  cachedAuth = getAuth(app)
  cachedDb = getFirestore(app)
  return { adminAuth: cachedAuth, adminDb: cachedDb }
}

export { getAdmin }
