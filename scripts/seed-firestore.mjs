// scripts/seed-firestore.mjs

/* eslint-disable no-console */
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore'
import dotenv from 'dotenv'
import { allChallenges } from './challenges/index.js'

dotenv.config({ path: '.env.local' })

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function seedChallenges() {
  console.log('🌱 Starting seed process...\n')

  try {
    // Step 1: Clear existing challenges
    console.log('🗑️  Clearing existing challenges...')
    const existingChallenges = await getDocs(collection(db, 'challenges'))
    const deletePromises = existingChallenges.docs.map((doc) => deleteDoc(doc.ref))
    await Promise.all(deletePromises)
    console.log(`✅ Deleted ${existingChallenges.size} existing challenges\n`)

    // Step 2: Seed new challenges
    console.log('📝 Adding new challenges...')
    let successCount = 0
    
    for (const challenge of allChallenges) {
      await addDoc(collection(db, 'challenges'), {
        ...challenge,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      successCount++
      console.log(`  ✅ [${successCount}/${allChallenges.length}] ${challenge.title}`)
    }

    console.log(`\n🎉 Successfully seeded ${allChallenges.length} challenges!`)
    console.log('📊 Breakdown by module:')
    console.log('   - Git Basics: 7 challenges (105 pts)')
    console.log('   - Git Branching: 6 challenges (120 pts)')
    console.log('   - Git Merging: 3 challenges (90 pts)')
    console.log('   - Git Remotes: 5 challenges (105 pts)')
    console.log('   - Git Advanced: 2 challenges (45 pts)')
    console.log('   - Git Capstone: 1 challenge (40 pts)')
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('   📈 TOTAL: 24 challenges | 505 points\n')
  } catch (error) {
    console.error('❌ Error seeding challenges:', error)
    process.exit(1)
  }

  process.exit(0)
}

seedChallenges()