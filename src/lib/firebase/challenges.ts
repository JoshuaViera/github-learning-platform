// src/lib/firebase/challenges.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  limit,
  Timestamp,
} from 'firebase/firestore'
import { db } from './config'
import { Challenge } from '@/types'

interface UserProgressRecord {
  userId: string
  challengeId: string
  status: 'not_started' | 'in_progress' | 'completed'
  attempts: number
  hintsUsed: number
  pointsEarned: number
  timeSpentSeconds: number
  solutionViewed: boolean
  savedTerminalState: any | null
  startedAt: Timestamp
  completedAt?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

export async function getChallenge(challengeId: string): Promise<Challenge | null> {
  try {
    if (!challengeId || typeof challengeId !== 'string') {
      console.warn('⚠️ Invalid challengeId:', challengeId)
      return null
    }

    console.log('🔍 Fetching challenge:', challengeId)
    
    const challengeRef = doc(db, 'challenges', challengeId)
    const challengeSnap = await getDoc(challengeRef)

    if (!challengeSnap.exists()) {
      console.log('❌ Challenge not found in Firestore:', challengeId)
      return null
    }

    const data = challengeSnap.data() as Challenge
    console.log('✅ Challenge loaded from Firestore:', data.title)
    return data
  } catch (error) {
    console.error('❌ Error fetching challenge:', error)
    return null
  }
}

export async function getAllChallenges(): Promise<Challenge[]> {
  try {
    console.log('🔍 getAllChallenges: Starting fetch...')
    console.log('🔍 Database instance:', db ? 'Connected' : 'NOT CONNECTED')
    
    const challengesRef = collection(db, 'challenges')
    console.log('🔍 Collection reference created:', challengesRef)
    
    // SIMPLIFIED QUERY - No composite index needed!
    const q = query(challengesRef, where('isPublished', '==', true))
    console.log('🔍 Query created (simplified - no orderBy)')
    
    const querySnapshot = await getDocs(q)
    console.log('🔍 Query executed. Found documents:', querySnapshot.size)
    
    const challenges: Challenge[] = []
    
    querySnapshot.forEach((doc) => {
      console.log('🔍 Processing document:', doc.id, doc.data())
      challenges.push({ id: doc.id, ...doc.data() } as Challenge)
    })
    
    // SORT IN JAVASCRIPT INSTEAD OF FIRESTORE
    challenges.sort((a, b) => a.orderIndex - b.orderIndex)
    
    console.log('✅ Total challenges loaded:', challenges.length)
    console.log('✅ Challenges:', challenges.map(c => ({ id: c.id, title: c.title })))
    
    return challenges
  } catch (error) {
    console.error('❌ Error fetching challenges:', error)
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown',
      code: (error as any)?.code,
      stack: error instanceof Error ? error.stack : 'No stack'
    })
    return []
  }
}

export async function getChallengesByModule(moduleId: string): Promise<Challenge[]> {
  try {
    const challengesRef = collection(db, 'challenges')
    const q = query(
      challengesRef,
      where('moduleId', '==', moduleId),
      where('isPublished', '==', true)
    )
    
    const querySnapshot = await getDocs(q)
    const challenges: Challenge[] = []
    
    querySnapshot.forEach((doc) => {
      challenges.push({ id: doc.id, ...doc.data() } as Challenge)
    })
    
    // Sort in JavaScript
    challenges.sort((a, b) => a.orderIndex - b.orderIndex)
    
    return challenges
  } catch (error) {
    console.error('Error fetching challenges by module:', error)
    return []
  }
}

export async function getUserProgress(userId: string): Promise<UserProgressRecord[]> {
  try {
    if (!userId || typeof userId !== 'string') {
      console.warn('⚠️ Invalid userId:', userId)
      return []
    }

    const progressRef = collection(db, 'user_progress')
    const q = query(progressRef, where('userId', '==', userId))
    const snapshot = await getDocs(q)

    const records: UserProgressRecord[] = []
    snapshot.forEach((doc) => {
      records.push(doc.data() as UserProgressRecord)
    })

    return records
  } catch (error) {
    console.error('❌ Error fetching user progress:', error)
    return []
  }
}

export async function getChallengeProgress(
  userId: string,
  challengeId: string
): Promise<UserProgressRecord | null> {
  try {
    const progressRef = collection(db, 'user_progress')
    const q = query(
      progressRef,
      where('userId', '==', userId),
      where('challengeId', '==', challengeId),
      limit(1)
    )
    
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) {
      return null
    }

    return snapshot.docs[0].data() as UserProgressRecord
  } catch (error) {
    console.error('❌ Error fetching challenge progress:', error)
    return null
  }
}

export async function updateUserProgress(
  userId: string,
  challengeId: string,
  updates: Partial<{
    hintsUsed: number
    attempts: number
    status: 'not_started' | 'in_progress' | 'completed'
  }>
): Promise<void> {
  try {
    if (!userId || !challengeId) {
      console.warn('⚠️ Invalid userId or challengeId')
      return
    }

    const progressRef = collection(db, 'user_progress')
    const q = query(
      progressRef,
      where('userId', '==', userId),
      where('challengeId', '==', challengeId),
      limit(1)
    )
    
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      await addDoc(progressRef, {
        userId,
        challengeId,
        status: updates.status || 'in_progress',
        attempts: updates.attempts || 0,
        hintsUsed: updates.hintsUsed || 0,
        pointsEarned: 0,
        timeSpentSeconds: 0,
        solutionViewed: false,
        savedTerminalState: null,
        startedAt: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
    } else {
      const docRef = snapshot.docs[0].ref
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      })
    }

    console.log('✅ User progress updated')
  } catch (error) {
    console.error('❌ Error updating user progress:', error)
  }
}

export async function markChallengeComplete(
  userId: string,
  challengeId: string,
  points: number
): Promise<void> {
  try {
    if (!userId || !challengeId) {
      console.warn('⚠️ Invalid userId or challengeId')
      return
    }

    const progressRef = collection(db, 'user_progress')
    const q = query(
      progressRef,
      where('userId', '==', userId),
      where('challengeId', '==', challengeId),
      limit(1)
    )
    
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      await addDoc(progressRef, {
        userId,
        challengeId,
        status: 'completed',
        attempts: 1,
        hintsUsed: 0,
        pointsEarned: points,
        timeSpentSeconds: 0,
        solutionViewed: false,
        savedTerminalState: null,
        startedAt: Timestamp.now(),
        completedAt: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      console.log('✅ Challenge marked complete (new record)')
    } else {
      const docRef = snapshot.docs[0].ref
      const currentData = snapshot.docs[0].data()
      
      if (currentData.status === 'completed') {
        console.log('ℹ️ Challenge already completed')
        return
      }

      await updateDoc(docRef, {
        status: 'completed',
        completedAt: Timestamp.now(),
        pointsEarned: points,
        updatedAt: Timestamp.now(),
      })
      console.log('✅ Challenge marked complete:', challengeId)
    }
  } catch (error) {
    console.error('❌ Error marking challenge complete:', error)
  }
}

export async function getLeaderboard(limitCount: number = 10) {
  try {
    console.warn('⚠️ Leaderboard requires aggregation - implement separately')
    return []
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }
}

export async function saveChallenge(challenge: Challenge): Promise<void> {
  try {
    const challengeRef = doc(db, 'challenges', challenge.id)
    await setDoc(challengeRef, {
      ...challenge,
      updatedAt: Timestamp.now(),
    })
    console.log('✅ Challenge saved:', challenge.id)
  } catch (error) {
    console.error('❌ Error saving challenge:', error)
    throw error
  }
}