// src/lib/firebase/admin.ts
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import { db } from './config'
import { Challenge } from '@/types'

// ============================================================================
// ADMIN USER TYPE
// ============================================================================

export interface AdminUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  createdAt: Date
  lastLoginAt: Date
}

// ============================================================================
// PROGRESS RECORD TYPE (matches /user_progress collection)
// ============================================================================

export interface UserProgressRecord {  // ✅ EXPORTED!
  userId: string
  challengeId: string
  status: 'not_started' | 'in_progress' | 'completed'
  attempts: number
  hintsUsed: number
  pointsEarned: number
  timeSpentSeconds: number
  solutionViewed: boolean
  startedAt: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// ADMIN FUNCTIONS
// ============================================================================

/**
 * Get all users from profiles collection
 */
export async function getAllUsers(): Promise<AdminUser[]> {
  try {
    const usersRef = collection(db, 'profiles')
    const snapshot = await getDocs(usersRef)
    
    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        uid: doc.id,
        email: data.email || null,
        displayName: data.displayName || data.fullName || null,
        photoURL: data.photoURL || data.avatarUrl || null,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLoginAt: data.lastLoginAt?.toDate() || data.updatedAt?.toDate() || new Date(),
      }
    })
  } catch (error) {
    console.error('Error fetching all users:', error)
    return []
  }
}

/**
 * Get all progress records from user_progress collection
 */
export async function getAllProgress(): Promise<UserProgressRecord[]> {
  try {
    const progressRef = collection(db, 'user_progress')
    const snapshot = await getDocs(progressRef)
    
    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        userId: data.userId,
        challengeId: data.challengeId,
        status: data.status,
        attempts: data.attempts || 0,
        hintsUsed: data.hintsUsed || 0,
        pointsEarned: data.pointsEarned || 0,
        timeSpentSeconds: data.timeSpentSeconds || 0,
        solutionViewed: data.solutionViewed || false,
        startedAt: data.startedAt?.toDate() || new Date(),
        completedAt: data.completedAt?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as UserProgressRecord
    })
  } catch (error) {
    console.error('Error fetching all progress:', error)
    return []
  }
}

/**
 * Get all challenges
 */
export async function getChallenges(): Promise<Challenge[]> {
  try {
    const challengesRef = collection(db, 'challenges')
    const q = query(challengesRef, where('isPublished', '==', true), orderBy('orderIndex'))
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Challenge[]
  } catch (error) {
    console.error('Error fetching challenges:', error)
    return []
  }
}

/**
 * Get stats for a specific user
 */
export async function getUserStats(userId: string) {
  try {
    const progressRef = collection(db, 'user_progress')
    const q = query(progressRef, where('userId', '==', userId))
    
    const snapshot = await getDocs(q)
    const completed = snapshot.docs.filter((doc) => doc.data().status === 'completed').length
    const totalPoints = snapshot.docs.reduce((sum, doc) => sum + (doc.data().pointsEarned || 0), 0)

    return {
      challengesCompleted: completed,
      totalPoints,
      totalAttempts: snapshot.size,
    }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return {
      challengesCompleted: 0,
      totalPoints: 0,
      totalAttempts: 0,
    }
  }
}

/**
 * Get stats for a specific challenge
 */
export async function getChallengeStats(challengeId: string) {
  try {
    const progressRef = collection(db, 'user_progress')
    const q = query(progressRef, where('challengeId', '==', challengeId))
    
    const snapshot = await getDocs(q)
    const completions = snapshot.docs.filter((doc) => doc.data().status === 'completed').length
    const avgScore =
      snapshot.docs.reduce((sum, doc) => sum + (doc.data().pointsEarned || 0), 0) / snapshot.size || 0

    return {
      attempts: snapshot.size,
      completions,
      completionRate: (completions / snapshot.size) * 100 || 0,
      averageScore: Math.round(avgScore),
    }
  } catch (error) {
    console.error('Error fetching challenge stats:', error)
    return {
      attempts: 0,
      completions: 0,
      completionRate: 0,
      averageScore: 0,
    }
  }
}