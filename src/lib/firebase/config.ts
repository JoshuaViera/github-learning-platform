// src/lib/firebase/config.ts
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence, indexedDBLocalPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Validate that all required config values are present
const requiredConfigKeys = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
] as const

for (const key of requiredConfigKeys) {
  if (!firebaseConfig[key]) {
    throw new Error(
      `Missing Firebase configuration: NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`
    )
  }
}

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Set persistence using indexedDB (more reliable than localStorage)
if (typeof window !== 'undefined') {
  setPersistence(auth, indexedDBLocalPersistence)
    .then(() => {
      console.log('✅ Auth persistence set to indexedDB')
    })
    .catch((error) => {
      console.error('❌ Failed to set persistence, trying localStorage:', error)
      // Fallback to localStorage if indexedDB fails
      setPersistence(auth, browserLocalPersistence).catch((err) => {
        console.error('❌ All persistence methods failed:', err)
      })
    })
}

// Export the app instance
export default app