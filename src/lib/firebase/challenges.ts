import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { db } from './config'
import { Challenge, Module, UserProgress } from '@/types'

// ============================================================================
// MODULES
// ============================================================================

export async function getModules(): Promise<Module[]> {
  const modulesRef = collection(db, 'modules')
  const snapshot = await getDocs(modulesRef)
  
  // Filter and sort in JavaScript to avoid index requirement
  const modules = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Module[]
  
  return modules
    .filter(m => m.isPublished !== false)
    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
}

export async function getModule(moduleId: string): Promise<Module | null> {
  const docRef = doc(db, 'modules', moduleId)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) return null
  
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Module
}

// ============================================================================
// CHALLENGES
// ============================================================================

export async function getChallenges(moduleId?: string): Promise<Challenge[]> {
  const challengesRef = collection(db, 'challenges')
  
  // Fetch all challenges (no compound query to avoid index requirement)
  const snapshot = await getDocs(challengesRef)
  
  // Filter and sort in JavaScript
  let challenges = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Challenge[]
  
  // Filter by moduleId if provided
  if (moduleId) {
    challenges = challenges.filter(c => c.moduleId === moduleId)
  }
  
  // Filter published only and sort by orderIndex
  challenges = challenges
    .filter(c => c.isPublished !== false) // Show if isPublished is true or undefined
    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
  
  return challenges
}

export async function getChallenge(challengeId: string): Promise<Challenge | null> {
  const docRef = doc(db, 'challenges', challengeId)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) return null
  
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Challenge
}

// ============================================================================
// USER PROGRESS
// ============================================================================

export async function getUserProgress(
  userId: string,
  challengeId?: string
): Promise<UserProgress[]> {
  const progressRef = collection(db, 'user_progress')
  
  let q = query(progressRef, where('userId', '==', userId))
  
  if (challengeId) {
    q = query(q, where('challengeId', '==', challengeId))
  }
  
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as UserProgress[]
}

export async function updateUserProgress(
  userId: string,
  challengeId: string,
  data: Partial<UserProgress>
): Promise<void> {
  const progressRef = collection(db, 'user_progress')
  const q = query(
    progressRef,
    where('userId', '==', userId),
    where('challengeId', '==', challengeId)
  )
  
  const snapshot = await getDocs(q)
  
  if (snapshot.empty) {
    await addDoc(progressRef, {
      userId,
      challengeId,
      status: 'in_progress',
      attempts: 0,
      hintsUsed: 0,
      solutionViewed: false,
      startedAt: Timestamp.now(),
      completedAt: null,
      timeSpentSeconds: 0,
      pointsEarned: 0,
      savedTerminalState: null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      ...data,
    })
  } else {
    const progressDoc = snapshot.docs[0]
    await updateDoc(doc(db, 'user_progress', progressDoc.id), {
      ...data,
      updatedAt: Timestamp.now(),
    })
  }
}

export async function markChallengeComplete(
  userId: string,
  challengeId: string,
  pointsEarned: number
): Promise<void> {
  await updateUserProgress(userId, challengeId, {
    status: 'completed',
    completedAt: Timestamp.now(),
    pointsEarned,
  })
}

export async function recordChallengeAttempt(
  userId: string,
  challengeId: string,
  submittedCommands: string[],
  testResults: Record<string, unknown>[],
  isCorrect: boolean
): Promise<void> {
  const attemptsRef = collection(db, 'challenge_attempts')
  
  await addDoc(attemptsRef, {
    userId,
    challengeId,
    submittedCommands,
    testResults,
    isCorrect,
    attemptedAt: Timestamp.now(),
  })
  
  const progressRef = collection(db, 'user_progress')
  const q = query(
    progressRef,
    where('userId', '==', userId),
    where('challengeId', '==', challengeId)
  )
  
  const snapshot = await getDocs(q)
  if (!snapshot.empty) {
    const progressDoc = snapshot.docs[0]
    const currentAttempts = progressDoc.data().attempts || 0
    await updateDoc(doc(db, 'user_progress', progressDoc.id), {
      attempts: currentAttempts + 1,
    })
  }
}