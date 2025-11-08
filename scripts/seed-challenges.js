//  / scripts/seed-challenges.js

/* eslint-disable @typescript-eslint/no-require-imports */
const admin = require('firebase-admin')
const { mockChallenges } = require('../src/data/mockChallenges')


const admin = require('firebase-admin')
const { mockChallenges } = require('../src/data/mockChallenges')

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

async function seedChallenges() {
  console.log('🌱 Starting to seed challenges...')
  
  const challengesRef = db.collection('challenges')
  
  let count = 0
  for (const [id, challenge] of Object.entries(mockChallenges)) {
    try {
      await challengesRef.doc(id).set(challenge)
      console.log(`✅ Seeded challenge ${id}: ${challenge.title}`)
      count++
    } catch (error) {
      console.error(`❌ Error seeding challenge ${id}:`, error)
    }
  }
  
  console.log(`\n🎉 Successfully seeded ${count} challenges!`)
  process.exit(0)
}

seedChallenges()