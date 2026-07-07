import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { getFirebaseAuth, getFirebaseDb } from './firebase'

// ─── Helpers de Tenant ───

export function extractTenantId(uid: string): string | null {
  const parts = uid.split('|')
  return parts.length === 2 ? parts[0] : null
}

export function extractUserId(uid: string): string | null {
  const parts = uid.split('|')
  return parts.length === 2 ? parts[1] : null
}

export function buildUid(tenantId: string, userId: string): string {
  return `${tenantId}|${userId}`
}

// ─── Autenticação ───

export async function signIn(email: string, password: string) {
  const auth = getFirebaseAuth()
  const result = await signInWithEmailAndPassword(auth, email, password)
  const token = await result.user.getIdTokenResult()

  return {
    uid: result.user.uid,
    tenantId: token.claims.tenantId as string,
    role: token.claims.role as string,
    master: token.claims.master as boolean,
    user: result.user,
  }
}

export async function signUp(
  email: string,
  password: string,
  name: string,
  tenantId: string,
  role: string,
) {
  const auth = getFirebaseAuth()
  const uid = buildUid(tenantId, crypto.randomUUID())
  const result = await createUserWithEmailAndPassword(auth, email, password)

  const db = getFirebaseDb()
  await setDoc(doc(db, 'tenants', tenantId, 'users', result.user.uid), {
    name,
    email,
    role,
    tenantId,
    createdAt: serverTimestamp(),
  })

  return result.user
}

export async function signOut() {
  await firebaseSignOut(getFirebaseAuth())
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  const auth = getFirebaseAuth()
  return onAuthStateChanged(auth, callback)
}

// ─── Verificação de permissão (client-side) ───

export interface UserClaims {
  tenantId: string
  role: string
  master: boolean
}

export async function getUserClaims(): Promise<UserClaims | null> {
  const auth = getFirebaseAuth()
  const user = auth.currentUser
  if (!user) return null

  const token = await user.getIdTokenResult()
  return {
    tenantId: token.claims.tenantId as string,
    role: token.claims.role as string,
    master: token.claims.master as boolean,
  }
}

export async function getUserProfile(tenantId: string, userId: string) {
  const db = getFirebaseDb()
  const snap = await getDoc(doc(db, 'tenants', tenantId, 'users', userId))
  return snap.data()
}
