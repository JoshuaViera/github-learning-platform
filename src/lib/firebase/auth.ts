// src/lib/firebase/auth.ts
import { browserLocalPersistence, setPersistence } from 'firebase/auth'
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './config'

// Allowed email domain for Pursuit students
const ALLOWED_DOMAIN = process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN || 'pursuit.org'

/**
 * Sign in with Google OAuth
 * Only allows emails from the specified domain (@pursuit.org)
 */
export async function signInWithGoogle(): Promise<User> {
  console.log('🔵 Starting Google sign in...')
  console.log('🔵 Environment:', {
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
    allowedDomain: ALLOWED_DOMAIN,
  })

  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({
    prompt: 'select_account', // Always show account selection
  })

  try {
    console.log('🔵 Opening popup...')
    const result = await signInWithPopup(auth, provider)
    console.log('🟢 Popup succeeded!', result.user.email)

    const user = result.user

    // Verify email domain
    if (!user.email?.endsWith(`@${ALLOWED_DOMAIN}`)) {
      console.log('🔴 Email domain rejected:', user.email)
      // Sign out the user immediately
      await firebaseSignOut(auth)
      throw new Error(
        `Access denied. Only @${ALLOWED_DOMAIN} emails are allowed. Please sign in with your Pursuit email.`
      )
    }

    console.log('🟢 Email domain accepted:', user.email)

    // Create or update user profile in Firestore
    await createOrUpdateUserProfile(user)

    console.log('🟢 Sign in complete!')
    return user
  } catch (error: unknown) {
    console.log('🔴 Sign in error:', error)
    // Handle specific error cases
    const err = error as { code?: string; message?: string }
    if (err.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in cancelled. Please try again.')
    }
    if (err.code === 'auth/popup-blocked') {
      throw new Error('Pop-up blocked. Please allow pop-ups for this site.')
    }
    throw error
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth)
  } catch (error) {
    console.error('Error signing out:', error)
    throw new Error('Failed to sign out. Please try again.')
  }
}

/**
 * Create or update user profile in Firestore
 * FIXED: Now uses 'profiles' collection (matches your database)
 */
async function createOrUpdateUserProfile(user: User): Promise<void> {
  const userRef = doc(db, 'profiles', user.uid)  // ✅ CHANGED FROM 'users' TO 'profiles'

  try {
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      // New user - create profile
      await setDoc(userRef, {
        email: user.email,
        fullName: user.displayName || '',
        avatarUrl: user.photoURL || '',
        role: 'student',
        pursuitCohort: '', // Can be filled in later
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } else {
      // Existing user - update profile
      await setDoc(
        userRef,
        {
          email: user.email,
          fullName: user.displayName || userDoc.data().fullName,
          avatarUrl: user.photoURL || userDoc.data().avatarUrl,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
    }
  } catch (error) {
    console.error('Error creating/updating user profile:', error)
    // Don't throw error - allow user to sign in even if profile creation fails
  }
}

/**
 * Subscribe to authentication state changes
 * Returns an unsubscribe function
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}

/**
 * Get the current user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser
}