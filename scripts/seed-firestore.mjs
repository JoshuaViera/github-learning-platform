import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Corrected challenges data with proper solution format
const mockChallenges = [
  {
    moduleId: 'git-basics',
    title: 'Initialize Your First Repository',
    description: 'Learn how to create a new Git repository from scratch',
    difficulty: 'beginner',
    points: 10,
    orderIndex: 1,
    estimatedTimeMinutes: 5,
    isPublished: true,
    instructions: `Welcome to your first Git challenge! In this challenge, you'll learn how to initialize a new Git repository.

**Your Task:**
1. Initialize a new Git repository in the current directory
2. Create a file called "README.md"
3. Check the status of your repository

**Commands you'll need:**
- \`git init\` - Initialize a new Git repository
- \`touch <filename>\` - Create a new file
- \`git status\` - Check the status of your repository`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Start by using the git init command to create a new repository' },
      { id: 'hint-2', level: 2, text: 'Use the touch command to create a file: touch README.md' },
      { id: 'hint-3', level: 3, text: 'Check your progress with git status' },
    ],
    solution: {
      commands: ['git init', 'touch README.md', 'git status'],
      explanation: 'The git init command creates a new Git repository in the current directory. Then create a file and check the status to see your changes.',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: ['git init', 'touch README.md', 'git status'],
      checkGitState: true,
      expectedState: {
        initialized: true,
        files: ['README.md'],
      },
    },
    startingFiles: [],
    expectedCommands: ['git init', 'touch README.md', 'git status'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Repository is initialized',
        gitCheck: { type: 'status', value: 'initialized' },
      },
    ],
    tags: ['git', 'basics', 'init'],
    prerequisites: [],
    createdBy: 'system',
  },
  {
    moduleId: 'git-basics',
    title: 'Making Your First Commit',
    description: 'Learn how to stage and commit changes to your repository',
    difficulty: 'beginner',
    points: 15,
    orderIndex: 2,
    estimatedTimeMinutes: 10,
    isPublished: true,
    instructions: `Now that you have a repository, let's learn how to save your changes!

**Your Task:**
1. Initialize a new repository
2. Create a file called "hello.txt"
3. Add the file to the staging area
4. Commit the file with the message "Add hello.txt"

**Commands you'll need:**
- \`git init\` - Initialize repository
- \`touch <filename>\` - Create a file
- \`git add <filename>\` - Stage a file
- \`git commit -m "message"\` - Commit staged changes`,
    hints: [
      { id: 'hint-1', level: 1, text: 'First, initialize a repository with git init' },
      { id: 'hint-2', level: 2, text: 'Create the file: touch hello.txt' },
      { id: 'hint-3', level: 3, text: 'Stage the file: git add hello.txt' },
      { id: 'hint-4', level: 4, text: 'Commit with a message: git commit -m "Add hello.txt"' },
      { id: 'hint-5', level: 5, text: 'Remember to use quotes around your commit message!' },
    ],
    solution: {
      commands: ['git init', 'touch hello.txt', 'git add hello.txt', 'git commit -m "Add hello.txt"'],
      explanation: 'First initialize Git, create a file, stage it with git add, then commit it with a descriptive message. The staging area lets you choose which changes to include in your commit.',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: [
        'git init',
        'touch hello.txt',
        'git add hello.txt',
        'git commit -m "Add hello.txt"',
      ],
      checkGitState: true,
      expectedState: {
        initialized: true,
        files: ['hello.txt'],
        commits: 1,
        commitMessages: ['Add hello.txt'],
      },
    },
    startingFiles: [],
    expectedCommands: ['git init', 'touch hello.txt', 'git add hello.txt', 'git commit -m'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Repository is initialized',
        gitCheck: { type: 'status', value: 'initialized' },
      },
      {
        id: 'test-2',
        description: 'At least one commit was made',
        gitCheck: { type: 'commit', value: 'initial' },
      },
    ],
    tags: ['git', 'basics', 'commit', 'staging'],
    prerequisites: [],
    createdBy: 'system',
  },
  {
    moduleId: 'git-basics',
    title: 'Working with Branches',
    description: 'Learn how to create and switch between branches',
    difficulty: 'beginner',
    points: 20,
    orderIndex: 3,
    estimatedTimeMinutes: 8,
    isPublished: true,
    instructions: `Branches allow you to work on different features without affecting the main code. Let's practice!

**Your Task:**
1. Initialize a repository
2. Create a file and make an initial commit
3. Create a new branch called "feature"
4. Switch to the "feature" branch
5. Check which branch you're on

**Commands you'll need:**
- \`git init\` - Initialize repository
- \`git add\` and \`git commit\` - Save changes
- \`git branch <name>\` - Create a new branch
- \`git checkout <name>\` - Switch to a branch
- \`git branch\` - List all branches`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Start with git init and create your initial commit' },
      { id: 'hint-2', level: 2, text: 'Create a branch: git branch feature' },
      { id: 'hint-3', level: 3, text: 'Switch to it: git checkout feature' },
      { id: 'hint-4', level: 4, text: 'Use git branch to see all branches and which one you\'re on' },
      { id: 'hint-5', level: 5, text: 'The current branch will have an asterisk (*) next to it' },
    ],
    solution: {
      commands: [
        'git init',
        'touch main.txt',
        'git add main.txt',
        'git commit -m "Initial commit"',
        'git branch feature',
        'git checkout feature',
        'git branch'
      ],
      explanation: 'Initialize Git first, create and commit a file to establish a base. Then create a new branch called "feature" and switch to it. Branches let you work on features independently without affecting the main codebase.',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: [
        'git init',
        'git add',
        'git commit',
        'git branch feature',
        'git checkout feature',
      ],
      checkGitState: true,
      expectedState: {
        initialized: true,
        branches: ['main', 'feature'],
        currentBranch: 'feature',
        commits: 1,
      },
    },
    startingFiles: [],
    expectedCommands: ['git init', 'git branch feature', 'git checkout feature'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Git repository is initialized',
        gitCheck: { type: 'status', value: 'initialized' },
      },
      {
        id: 'test-2',
        description: 'Feature branch exists',
        gitCheck: { type: 'branch', value: 'feature' },
      },
    ],
    tags: ['git', 'branches', 'checkout'],
    prerequisites: [],
    createdBy: 'system',
  },
];

// Clear existing challenges and seed new ones
async function seedChallenges() {
  console.log('🌱 Seeding challenges to Firestore...\n');

  try {
    // Step 1: Clear existing challenges
    console.log('🗑️  Clearing existing challenges...');
    const existingChallenges = await getDocs(collection(db, 'challenges'));
    const deletePromises = existingChallenges.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log(`✅ Deleted ${existingChallenges.size} existing challenges\n`);

    // Step 2: Add new challenges
    console.log('📝 Adding new challenges...');
    for (const challenge of mockChallenges) {
      await addDoc(collection(db, 'challenges'), {
        ...challenge,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`✅ Added: ${challenge.title}`);
    }

    console.log('\n🎉 Successfully seeded all challenges!');
    console.log('Refresh your app - challenges should now work correctly.');
  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the seed function
seedChallenges();