import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import * as fs from 'fs'
import * as path from 'path'

function getServiceAccount() {
  const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
  if (saPath && fs.existsSync(path.resolve(saPath))) {
    return JSON.parse(fs.readFileSync(path.resolve(saPath), 'utf-8'))
  }
  return {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }
}

const apps = getApps()
const app = apps.length === 0
  ? initializeApp({ credential: cert(getServiceAccount()) })
  : apps[0]

export const adminAuth = getAuth(app)
export const adminDb = getFirestore(app)
