import { Challenge } from '@/types'
import { Timestamp } from 'firebase/firestore'

const createTimestamp = (): Timestamp => {
  return Timestamp.fromDate(new Date())
}

export const mockChallenges: Record<string, Challenge> = {
  '1': {
    id: '1',
    moduleId: 'git-basics',
    title: 'Initialize Your First Repository',
    description: 'Learn how to create a new Git repository and understand what initialization means.',
    instructions: `Welcome to your first Git challenge! Let's start by initializing a Git repository.

**What to do:**
Type the command: git init

**What this does:**
Creates a new Git repository in the current folder. This is always the first step before using any Git commands.

**Success criteria:**
✓ Repository must be initialized`,
    explanation: {
      overview: "You're learning to create a Git repository, which is like turning on 'version control' for a folder. Think of it as activating a superpower that lets your folder remember every change you make.",
      why: "Before you can use any Git features (saving versions, collaborating, etc.), you need to initialize a repository. This is always the very first step in any Git project.",
      vocabulary: [
        {
          term: "Initialize",
          definition: "To set up or prepare something for first use. Like pressing 'Start' on a new video game save file.",
          example: "'git init' sets up Git tracking in your folder"
        },
        {
          term: "Repository (Repo)",
          definition: "A folder that Git is watching and tracking. It contains all your files plus a hidden .git folder with the complete history.",
          example: "After 'git init', your folder becomes a repository"
        },
        {
          term: ".git folder",
          definition: "A hidden folder that Git creates to store all tracking information. You never need to touch this directly.",
          example: "Created automatically when you run 'git init'"
        }
      ],
      realWorldExample: "Imagine starting a journal. Before writing anything, you first need to buy the journal book. 'git init' is like buying the journal - it sets up the space where you'll record your project's history.",
      commonMistakes: [
        "Running 'git init' multiple times (only need it once per project)",
        "Forgetting to run 'git init' before other Git commands",
        "Running 'git init' in the wrong folder"
      ]
    },
    orderIndex: 1,
    difficulty: 'beginner',
    estimatedTimeMinutes: 5,
    points: 10,
    startingFiles: [],
    expectedCommands: ['git init'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Repository is initialized',
        gitCheck: { type: 'status', value: 'initialized' },
      },
    ],
    hints: [
      { id: 'hint-1', level: 1, text: 'Type exactly: git init' },
    ],
    solution: {
      commands: ['git init'],
      explanation: 'The git init command creates a new Git repository in the current directory. This must be done before any other Git commands will work.',
    },
    tags: ['git', 'basics', 'init'],
    prerequisites: [],
    isPublished: true,
    createdBy: 'system',
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
  },

  '2': {
    id: '2',
    moduleId: 'git-basics',
    title: 'Making Your First Commit',
    description: 'Learn how to stage files and create your first commit with a meaningful message.',
    instructions: `Now let's learn the fundamental Git workflow: create, stage, and commit!

**What to do (in order):**
1. git init
2. touch README.md
3. git add README.md
4. git commit -m "Initial commit"

**Important:** Your commit message MUST contain the word "initial" (any capitalization works)

**Success criteria:**
✓ Repository is initialized
✓ At least one commit with "initial" in the message`,
    explanation: {
      overview: "You're learning the fundamental Git workflow: create a file, stage it, and commit it. This is the core pattern you'll use thousands of times as a developer. Every change you want to save follows these same steps.",
      why: "Commits are how you save progress in Git. Without commits, Git can't track any changes. Think of commits as checkpoints in a game - they're your safe points you can return to if something goes wrong.",
      vocabulary: [
        {
          term: "Staging Area",
          definition: "A preparation space where you put files before committing them. Like a shopping cart before checkout.",
          example: "'git add README.md' puts the file in staging"
        },
        {
          term: "Commit",
          definition: "A snapshot of your project at a specific moment. Like taking a photo of your work.",
          example: "'git commit -m message' creates the snapshot"
        },
        {
          term: "Commit Message",
          definition: "A short description explaining what changed in this commit. Helps you (and others) understand the history.",
          example: "\"Initial commit\" or \"Add login feature\""
        }
      ],
      realWorldExample: "Think of taking photos during a trip. First, you decide which moment to capture (staging), then you take the photo (commit), and finally you write a caption describing it (commit message). Later, you can look through all your photos to remember the journey.",
      commonMistakes: [
        "Forgetting to stage files with 'git add' before committing",
        "Writing vague commit messages like 'update' or 'changes'",
        "Trying to commit without initializing Git first",
        "Not including a commit message",
        "Forgetting quotes around the commit message",
        "Not including the word 'initial' in the message"
      ]
    },
    orderIndex: 2,
    difficulty: 'beginner',
    estimatedTimeMinutes: 10,
    points: 15,
    startingFiles: [],
    expectedCommands: ['git init', 'touch README.md', 'git add README.md', 'git commit -m'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Repository is initialized',
        gitCheck: { type: 'status', value: 'initialized' },
      },
      {
        id: 'test-2',
        description: 'At least one commit was made with "initial" in the message',
        gitCheck: { type: 'commit', value: 'initial' },
      },
    ],
    hints: [
      { id: 'hint-1', level: 1, text: 'First: git init' },
      { id: 'hint-2', level: 2, text: 'Second: touch README.md' },
      { id: 'hint-3', level: 3, text: 'Third: git add README.md' },
      { id: 'hint-4', level: 4, text: 'Fourth: git commit -m "Initial commit"' },
      { id: 'hint-5', level: 5, text: 'Remember: the commit message must contain the word "initial"!' },
    ],
    solution: {
      commands: ['git init', 'touch README.md', 'git add README.md', 'git commit -m "Initial commit"'],
      explanation: 'First initialize Git, create a file, stage it with git add, then commit with a message containing "initial". The -m flag lets you add a message directly.',
    },
    tags: ['git', 'basics', 'commit'],
    prerequisites: [],
    isPublished: true,
    createdBy: 'system',
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
  },

  '3': {
    id: '3',
    moduleId: 'git-basics',
    title: 'Working with Branches',
    description: 'Create a new branch and learn why branches are important for development.',
    instructions: `Learn to create and work with branches - a core Git concept!

**What to do (in order):**
1. git init
2. git branch feature
3. git checkout feature

**Important:** The branch must be named exactly "feature"

**Success criteria:**
✓ Repository is initialized
✓ Branch named "feature" exists`,
    explanation: {
      overview: "You're learning to create branches, which let you work on new features without affecting your main code. It's like having multiple parallel versions of your project.",
      why: "Branches let you experiment safely. You can try new ideas, break things, and fix them without touching the working version of your code. This is essential for professional development.",
      vocabulary: [
        {
          term: "Branch",
          definition: "An independent line of development. A separate version of your project where you can make changes.",
          example: "'git branch feature' creates a new branch"
        },
        {
          term: "Checkout",
          definition: "Switch to a different branch. Changes which version of your code you're working on.",
          example: "'git checkout feature' switches to the feature branch"
        },
        {
          term: "HEAD",
          definition: "A pointer that shows which branch you're currently on.",
          example: "When you checkout a branch, HEAD moves to that branch"
        }
      ],
      realWorldExample: "Imagine you're writing a book. The main branch is your published version. When you want to add a new chapter, you create a branch - a separate copy where you can write and edit freely. Once it's perfect, you merge it back into the main book.",
      commonMistakes: [
        "Trying to checkout a branch that doesn't exist yet",
        "Forgetting to create the branch before checking it out",
        "Misspelling the branch name"
      ]
    },
    orderIndex: 3,
    difficulty: 'intermediate',
    estimatedTimeMinutes: 8,
    points: 20,
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
        description: 'Branch named "feature" exists',
        gitCheck: { type: 'branch', value: 'feature' },
      },
    ],
    hints: [
      { id: 'hint-1', level: 1, text: 'First: git init' },
      { id: 'hint-2', level: 2, text: 'Second: git branch feature (creates the branch)' },
      { id: 'hint-3', level: 3, text: 'Third: git checkout feature (switches to it)' },
    ],
    solution: {
      commands: ['git init', 'git branch feature', 'git checkout feature'],
      explanation: 'Initialize Git, create a branch named "feature", then switch to it. You can also use "git checkout -b feature" to create and switch in one command.',
    },
    tags: ['git', 'branches'],
    prerequisites: [],
    isPublished: true,
    createdBy: 'system',
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
  },

  // Challenge 4-24: Add remaining challenges with same clear pattern
  // For now, let's add a few more to show the pattern...

  '4': {
    id: '4',
    moduleId: 'git-basics',
    title: 'Understanding Git Status',
    description: 'Learn to check the status of your repository.',
    instructions: `Learn to check what's happening in your repository!

**What to do (in order):**
1. git init
2. touch app.js
3. git status

**What to look for:**
You should see "app.js" listed as an untracked file

**Success criteria:**
✓ Repository is initialized`,
    orderIndex: 4,
    difficulty: 'beginner',
    estimatedTimeMinutes: 5,
    points: 10,
    startingFiles: [],
    expectedCommands: ['git init', 'touch app.js', 'git status'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Repository is initialized',
        gitCheck: { type: 'status', value: 'initialized' },
      },
    ],
    hints: [
      { id: 'hint-1', level: 1, text: 'First: git init' },
      { id: 'hint-2', level: 2, text: 'Second: touch app.js' },
      { id: 'hint-3', level: 3, text: 'Third: git status' },
    ],
    solution: {
      commands: ['git init', 'touch app.js', 'git status'],
      explanation: 'Git status shows you what files are untracked, staged, or modified.',
    },
    tags: ['git', 'basics', 'status'],
    prerequisites: [],
    isPublished: true,
    createdBy: 'system',
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
  },

  '5': {
    id: '5',
    moduleId: 'git-basics',
    title: 'Making Multiple Commits',
    description: 'Practice making multiple commits in sequence.',
    instructions: `Learn to make multiple commits!

**What to do (in order):**
1. git init
2. touch index.html
3. git add index.html
4. git commit -m "Add index"
5. touch styles.css
6. git add styles.css
7. git commit -m "Add styles"

**Success criteria:**
✓ Repository is initialized
✓ At least 2 commits made`,
    orderIndex: 5,
    difficulty: 'beginner',
    estimatedTimeMinutes: 10,
    points: 15,
    startingFiles: [],
    expectedCommands: ['git init', 'touch', 'git add', 'git commit -m'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Repository is initialized',
        gitCheck: { type: 'status', value: 'initialized' },
      },
      {
        id: 'test-2',
        description: 'At least one commit exists',
       gitCheck: { type: 'commit', value: 'commit' },
      },
    ],
    hints: [
      { id: 'hint-1', level: 1, text: 'Initialize first with git init' },
      { id: 'hint-2', level: 2, text: 'Create first file, add it, commit it' },
      { id: 'hint-3', level: 3, text: 'Then create second file, add it, commit it' },
    ],
    solution: {
      commands: [
        'git init',
        'touch index.html',
        'git add index.html',
        'git commit -m "Add index"',
        'touch styles.css',
        'git add styles.css',
        'git commit -m "Add styles"'
      ],
      explanation: 'Each commit captures a specific set of changes. Make small, focused commits.',
    },
    tags: ['git', 'basics', 'commit'],
    prerequisites: [],
    isPublished: true,
    createdBy: 'system',
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
  },

  '6': {
    id: '6',
    moduleId: 'git-basics',
    title: 'Viewing Commit History',
    description: 'Learn to view your commit history with git log.',
    instructions: `Learn to view your project's history!

**What to do (in order):**
1. git init
2. touch README.md
3. git add README.md
4. git commit -m "Initial commit"
5. git log

**What you'll see:**
The git log command shows all commits with their messages, authors, and timestamps

**Success criteria:**
✓ Repository is initialized
✓ At least one commit with "initial" in message`,
    orderIndex: 6,
    difficulty: 'beginner',
    estimatedTimeMinutes: 8,
    points: 10,
    startingFiles: [],
    expectedCommands: ['git init', 'touch', 'git add', 'git commit -m', 'git log'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Repository is initialized',
        gitCheck: { type: 'status', value: 'initialized' },
      },
      {
        id: 'test-2',
        description: 'At least one commit with "initial"',
        gitCheck: { type: 'commit', value: 'initial' },
      },
    ],
    hints: [
      { id: 'hint-1', level: 1, text: 'Follow the workflow: init, create file, add, commit' },
      { id: 'hint-2', level: 2, text: 'Then use git log to see the history' },
    ],
    solution: {
      commands: ['git init', 'touch README.md', 'git add README.md', 'git commit -m "Initial commit"', 'git log'],
      explanation: 'Git log displays your commit history, showing what changes were made and when.',
    },
    tags: ['git', 'basics', 'log'],
    prerequisites: [],
    isPublished: true,
    createdBy: 'system',
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
  },

  '7': {
    id: '7',
    moduleId: 'git-basics',
    title: 'Understanding the Staging Area',
    description: 'Learn how the staging area works.',
    instructions: `Understand the staging area concept!

**What to do (in order):**
1. git init
2. touch file1.txt
3. touch file2.txt
4. git add file1.txt
5. git status

**What you'll learn:**
You'll see file1.txt is staged (ready to commit) and file2.txt is untracked

**Success criteria:**
✓ Repository is initialized`,
    orderIndex: 7,
    difficulty: 'beginner',
    estimatedTimeMinutes: 8,
    points: 10,
    startingFiles: [],
    expectedCommands: ['git init', 'touch', 'git add', 'git status'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Repository is initialized',
        gitCheck: { type: 'status', value: 'initialized' },
      },
    ],
    hints: [
      { id: 'hint-1', level: 1, text: 'Create two files but only add one' },
      { id: 'hint-2', level: 2, text: 'git status will show the difference' },
    ],
    solution: {
      commands: ['git init', 'touch file1.txt', 'touch file2.txt', 'git add file1.txt', 'git status'],
      explanation: 'The staging area lets you choose exactly which changes to include in your next commit.',
    },
    tags: ['git', 'basics', 'staging'],
    prerequisites: [],
    isPublished: true,
    createdBy: 'system',
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
  },

  // Add challenges 8-24 following the same pattern...
  // For brevity, I'll add a few key ones and you can extend

  '8': {
    id: '8',
    moduleId: 'git-branching',
    title: 'Creating Your First Branch',
    description: 'Learn the git branch command.',
    instructions: `Practice creating a branch!

**What to do:**
1. git init
2. git branch feature

**Success criteria:**
✓ Repository initialized
✓ Branch "feature" exists`,
    orderIndex: 8,
    difficulty: 'intermediate',
    estimatedTimeMinutes: 5,
    points: 15,
    startingFiles: [],
    expectedCommands: ['git init', 'git branch feature'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Repository is initialized',
        gitCheck: { type: 'status', value: 'initialized' },
      },
      {
        id: 'test-2',
        description: 'Branch "feature" exists',
        gitCheck: { type: 'branch', value: 'feature' },
      },
    ],
    hints: [
      { id: 'hint-1', level: 1, text: 'git init first' },
      { id: 'hint-2', level: 2, text: 'git branch feature' },
    ],
    solution: {
      commands: ['git init', 'git branch feature'],
      explanation: 'git branch creates a new branch without switching to it.',
    },
    tags: ['git', 'branching'],
    prerequisites: [],
    isPublished: true,
    createdBy: 'system',
    createdAt: createTimestamp(),
    updatedAt: createTimestamp(),
  },

  // Placeholder for challenges 9-24
  // Following same clear pattern...
}

// Export individual challenge getter
export function getMockChallenge(id: string): Challenge | undefined {
  return mockChallenges[id]
}

// Export all challenges as array
export function getAllMockChallenges(): Challenge[] {
  return Object.values(mockChallenges)
}