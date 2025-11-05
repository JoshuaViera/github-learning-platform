import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import { db } from './config'
import { UserProgress, Challenge } from '@/types'

export interface AdminUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  createdAt: Date
  lastLoginAt: Date
}

export async function getAllUsers(): Promise<AdminUser[]> {
  try {
    const usersRef = collection(db, 'users')
    const snapshot = await getDocs(usersRef)

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        uid: doc.id,
        email: data.email || null,
        displayName: data.displayName || null,
        photoURL: data.photoURL || null,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
      }
    })
  } catch (error) {
    console.error('Error fetching all users:', error)
    return []
  }
}

export async function getAllProgress(): Promise<UserProgress[]> {
  try {
    const progressRef = collection(db, 'user_progress')
    const snapshot = await getDocs(progressRef)

    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        userId: data.userId,
        challengeId: data.challengeId,
        status: data.status,
        startedAt: data.startedAt?.toDate(),
        completedAt: data.completedAt?.toDate(),
        attempts: data.attempts || 0,
        hintsUsed: data.hintsUsed || 0,
        commandsExecuted: data.commandsExecuted || [],
        timeSpentSeconds: data.timeSpentSeconds || 0,
        score: data.score || 0,
        solutionViewed: data.solutionViewed || false,
        pointsEarned: data.pointsEarned || 0,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as UserProgress
    })
  } catch (error) {
    console.error('Error fetching all progress:', error)
    return []
  }
}

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

export async function getUserStats(userId: string) {
  try {
    const progressRef = collection(db, 'user_progress')
    const q = query(progressRef, where('userId', '==', userId))
    const snapshot = await getDocs(q)

    const completed = snapshot.docs.filter((doc) => doc.data().status === 'completed').length
    const totalPoints = snapshot.docs.reduce((sum, doc) => sum + (doc.data().score || 0), 0)

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

export async function getChallengeStats(challengeId: string) {
  try {
    const progressRef = collection(db, 'user_progress')
    const q = query(progressRef, where('challengeId', '==', challengeId))
    const snapshot = await getDocs(q)

    const completions = snapshot.docs.filter((doc) => doc.data().status === 'completed').length
    const avgScore =
      snapshot.docs.reduce((sum, doc) => sum + (doc.data().score || 0), 0) / snapshot.size || 0

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