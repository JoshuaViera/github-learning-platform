// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
// import dotenv from 'dotenv';

// // Load environment variables
// dotenv.config({ path: '.env.local' });

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // Corrected challenges data with proper solution format
// const mockChallenges = [
//   {
//     moduleId: 'git-basics',
//     title: 'Initialize Your First Repository',
//     description: 'Learn how to create a new Git repository from scratch',
//     difficulty: 'beginner',
//     points: 10,
//     orderIndex: 1,
//     estimatedTimeMinutes: 5,
//     isPublished: true,
//     instructions: `Welcome to your first Git challenge! In this challenge, you'll learn how to initialize a new Git repository.

// **Your Task:**
// 1. Initialize a new Git repository in the current directory
// 2. Create a file called "README.md"
// 3. Check the status of your repository

// **Commands you'll need:**
// - \`git init\` - Initialize a new Git repository
// - \`touch <filename>\` - Create a new file
// - \`git status\` - Check the status of your repository`,
//     hints: [
//       { id: 'hint-1', level: 1, text: 'Start by using the git init command to create a new repository' },
//       { id: 'hint-2', level: 2, text: 'Use the touch command to create a file: touch README.md' },
//       { id: 'hint-3', level: 3, text: 'Check your progress with git status' },
//     ],
//     solution: {
//       commands: ['git init', 'touch README.md', 'git status'],
//       explanation: 'The git init command creates a new Git repository in the current directory. Then create a file and check the status to see your changes.',
//     },
//     validation: {
//       type: 'command-sequence',
//       requiredCommands: ['git init', 'touch README.md', 'git status'],
//       checkGitState: true,
//       expectedState: {
//         initialized: true,
//         files: ['README.md'],
//       },
//     },
//     startingFiles: [],
//     expectedCommands: ['git init', 'touch README.md', 'git status'],
//     validationTests: [
//       {
//         id: 'test-1',
//         description: 'Repository is initialized',
//         gitCheck: { type: 'status', value: 'initialized' },
//       },
//     ],
//     tags: ['git', 'basics', 'init'],
//     prerequisites: [],
//     createdBy: 'system',
//   },
//   {
//     moduleId: 'git-basics',
//     title: 'Making Your First Commit',
//     description: 'Learn how to stage and commit changes to your repository',
//     difficulty: 'beginner',
//     points: 15,
//     orderIndex: 2,
//     estimatedTimeMinutes: 10,
//     isPublished: true,
//     instructions: `Now that you have a repository, let's learn how to save your changes!

// **Your Task:**
// 1. Initialize a new repository
// 2. Create a file called "hello.txt"
// 3. Add the file to the staging area
// 4. Commit the file with the message "Add hello.txt"

// **Commands you'll need:**
// - \`git init\` - Initialize repository
// - \`touch <filename>\` - Create a file
// - \`git add <filename>\` - Stage a file
// - \`git commit -m "message"\` - Commit staged changes`,
//     hints: [
//       { id: 'hint-1', level: 1, text: 'First, initialize a repository with git init' },
//       { id: 'hint-2', level: 2, text: 'Create the file: touch hello.txt' },
//       { id: 'hint-3', level: 3, text: 'Stage the file: git add hello.txt' },
//       { id: 'hint-4', level: 4, text: 'Commit with a message: git commit -m "Add hello.txt"' },
//       { id: 'hint-5', level: 5, text: 'Remember to use quotes around your commit message!' },
//     ],
//     solution: {
//       commands: ['git init', 'touch hello.txt', 'git add hello.txt', 'git commit -m "Add hello.txt"'],
//       explanation: 'First initialize Git, create a file, stage it with git add, then commit it with a descriptive message. The staging area lets you choose which changes to include in your commit.',
//     },
//     validation: {
//       type: 'command-sequence',
//       requiredCommands: [
//         'git init',
//         'touch hello.txt',
//         'git add hello.txt',
//         'git commit -m "Add hello.txt"',
//       ],
//       checkGitState: true,
//       expectedState: {
//         initialized: true,
//         files: ['hello.txt'],
//         commits: 1,
//         commitMessages: ['Add hello.txt'],
//       },
//     },
//     startingFiles: [],
//     expectedCommands: ['git init', 'touch hello.txt', 'git add hello.txt', 'git commit -m'],
//     validationTests: [
//       {
//         id: 'test-1',
//         description: 'Repository is initialized',
//         gitCheck: { type: 'status', value: 'initialized' },
//       },
//       {
//         id: 'test-2',
//         description: 'At least one commit was made',
//         gitCheck: { type: 'commit', value: 'initial' },
//       },
//     ],
//     tags: ['git', 'basics', 'commit', 'staging'],
//     prerequisites: [],
//     createdBy: 'system',
//   },
//   {
//     moduleId: 'git-basics',
//     title: 'Working with Branches',
//     description: 'Learn how to create and switch between branches',
//     difficulty: 'beginner',
//     points: 20,
//     orderIndex: 3,
//     estimatedTimeMinutes: 8,
//     isPublished: true,
//     instructions: `Branches allow you to work on different features without affecting the main code. Let's practice!

// **Your Task:**
// 1. Initialize a repository
// 2. Create a file and make an initial commit
// 3. Create a new branch called "feature"
// 4. Switch to the "feature" branch
// 5. Check which branch you're on

// **Commands you'll need:**
// - \`git init\` - Initialize repository
// - \`git add\` and \`git commit\` - Save changes
// - \`git branch <name>\` - Create a new branch
// - \`git checkout <name>\` - Switch to a branch
// - \`git branch\` - List all branches`,
//     hints: [
//       { id: 'hint-1', level: 1, text: 'Start with git init and create your initial commit' },
//       { id: 'hint-2', level: 2, text: 'Create a branch: git branch feature' },
//       { id: 'hint-3', level: 3, text: 'Switch to it: git checkout feature' },
//       { id: 'hint-4', level: 4, text: 'Use git branch to see all branches and which one you\'re on' },
//       { id: 'hint-5', level: 5, text: 'The current branch will have an asterisk (*) next to it' },
//     ],
//     solution: {
//       commands: [
//         'git init',
//         'touch main.txt',
//         'git add main.txt',
//         'git commit -m "Initial commit"',
//         'git branch feature',
//         'git checkout feature',
//         'git branch'
//       ],
//       explanation: 'Initialize Git first, create and commit a file to establish a base. Then create a new branch called "feature" and switch to it. Branches let you work on features independently without affecting the main codebase.',
//     },
//     validation: {
//       type: 'command-sequence',
//       requiredCommands: [
//         'git init',
//         'git add',
//         'git commit',
//         'git branch feature',
//         'git checkout feature',
//       ],
//       checkGitState: true,
//       expectedState: {
//         initialized: true,
//         branches: ['main', 'feature'],
//         currentBranch: 'feature',
//         commits: 1,
//       },
//     },
//     startingFiles: [],
//     expectedCommands: ['git init', 'git branch feature', 'git checkout feature'],
//     validationTests: [
//       {
//         id: 'test-1',
//         description: 'Git repository is initialized',
//         gitCheck: { type: 'status', value: 'initialized' },
//       },
//       {
//         id: 'test-2',
//         description: 'Feature branch exists',
//         gitCheck: { type: 'branch', value: 'feature' },
//       },
//     ],
//     tags: ['git', 'branches', 'checkout'],
//     prerequisites: [],
//     createdBy: 'system',
//   },
//   // 10 NEW CHALLENGES TO ADD TO YOUR SEED SCRIPT
// // Copy these into the mockChallenges array in scripts/seed-firestore.mjs

// // CHALLENGE 4: Understanding the Staging Area
// {
//   moduleId: 'git-basics',
//   title: 'Understanding the Staging Area',
//   description: 'Learn the difference between working directory, staging area, and repository',
//   difficulty: 'beginner',
//   points: 15,
//   orderIndex: 4,
//   estimatedTimeMinutes: 10,
//   isPublished: true,
//   instructions: `The staging area is like a preparation zone before committing. Let's practice!

// **Your Task:**
// 1. Initialize a repository
// 2. Create two files: "file1.txt" and "file2.txt"
// 3. Add ONLY "file1.txt" to the staging area
// 4. Check the status to see the difference
// 5. Commit only the staged file

// **Commands you'll need:**
// - \`git init\` - Initialize repository
// - \`touch <filename>\` - Create files
// - \`git add <filename>\` - Stage specific file
// - \`git status\` - Check what's staged vs unstaged
// - \`git commit -m "message"\` - Commit staged changes`,
//   hints: [
//     { id: 'hint-1', level: 1, text: 'Start with git init' },
//     { id: 'hint-2', level: 2, text: 'Create both files: touch file1.txt file2.txt' },
//     { id: 'hint-3', level: 3, text: 'Only stage file1.txt: git add file1.txt' },
//     { id: 'hint-4', level: 4, text: 'Use git status to see file1.txt is staged and file2.txt is untracked' },
//     { id: 'hint-5', level: 5, text: 'Commit with: git commit -m "Add file1"' },
//   ],
//   solution: {
//     commands: [
//       'git init',
//       'touch file1.txt file2.txt',
//       'git add file1.txt',
//       'git status',
//       'git commit -m "Add file1"'
//     ],
//     explanation: 'The staging area lets you control exactly what goes into each commit. You can work on multiple files but commit them separately for better organization.',
//   },
//   validation: {
//     type: 'command-sequence',
//     requiredCommands: ['git init', 'touch', 'git add file1.txt', 'git commit'],
//     checkGitState: true,
//     expectedState: {
//       initialized: true,
//       commits: 1,
//       stagedFiles: [],
//       untrackedFiles: ['file2.txt'],
//     },
//   },
//   startingFiles: [],
//   expectedCommands: ['git init', 'touch', 'git add', 'git status', 'git commit'],
//   validationTests: [
//     {
//       id: 'test-1',
//       description: 'Repository initialized and one file committed',
//       gitCheck: { type: 'commit', value: 'file1' },
//     },
//   ],
//   tags: ['git', 'staging', 'basics'],
//   prerequisites: [],
//   createdBy: 'system',
// },

// // CHALLENGE 5: Writing Good Commit Messages
// {
//   moduleId: 'git-basics',
//   title: 'Writing Good Commit Messages',
//   description: 'Learn how to write clear, descriptive commit messages',
//   difficulty: 'beginner',
//   points: 10,
//   orderIndex: 5,
//   estimatedTimeMinutes: 8,
//   isPublished: true,
//   instructions: `Good commit messages are essential for team collaboration. Practice writing them!

// **Your Task:**
// 1. Initialize a repository
// 2. Create a file called "index.html"
// 3. Stage and commit it with message: "Add homepage structure"
// 4. Create another file "styles.css"
// 5. Stage and commit it with message: "Add stylesheet for homepage"

// **Good commit message format:**
// - Start with a verb (Add, Fix, Update, Remove)
// - Be specific and concise
// - Describe WHAT and WHY, not HOW`,
//   hints: [
//     { id: 'hint-1', level: 1, text: 'Initialize with git init' },
//     { id: 'hint-2', level: 2, text: 'Create and commit index.html first' },
//     { id: 'hint-3', level: 3, text: 'Use exact message: git commit -m "Add homepage structure"' },
//     { id: 'hint-4', level: 4, text: 'Then create and commit styles.css' },
//     { id: 'hint-5', level: 5, text: 'Second commit: git commit -m "Add stylesheet for homepage"' },
//   ],
//   solution: {
//     commands: [
//       'git init',
//       'touch index.html',
//       'git add index.html',
//       'git commit -m "Add homepage structure"',
//       'touch styles.css',
//       'git add styles.css',
//       'git commit -m "Add stylesheet for homepage"'
//     ],
//     explanation: 'Clear commit messages help your team understand the project history. Start with action verbs and be specific about what changed.',
//   },
//   validation: {
//     type: 'command-sequence',
//     requiredCommands: ['git init', 'git commit'],
//     checkGitState: true,
//     expectedState: {
//       initialized: true,
//       commits: 2,
//     },
//   },
//   startingFiles: [],
//   expectedCommands: ['git init', 'touch', 'git add', 'git commit'],
//   validationTests: [
//     {
//       id: 'test-1',
//       description: 'Two commits with descriptive messages',
//       gitCheck: { type: 'commit', value: 'Add' },
//     },
//   ],
//   tags: ['git', 'commit-messages', 'best-practices'],
//   prerequisites: [],
//   createdBy: 'system',
// },

// // CHALLENGE 6: Viewing Commit History
// {
//   moduleId: 'git-basics',
//   title: 'Viewing Commit History',
//   description: 'Learn how to view and navigate your project history',
//   difficulty: 'beginner',
//   points: 15,
//   orderIndex: 6,
//   estimatedTimeMinutes: 10,
//   isPublished: true,
//   instructions: `Git log shows you the history of your project. Let's explore it!

// **Your Task:**
// 1. Initialize a repository
// 2. Create and commit "README.md"
// 3. Create and commit "app.js"
// 4. Create and commit "test.js"
// 5. Use git log to view the history
// 6. Use git log --oneline for a compact view

// **Commands you'll need:**
// - \`git log\` - View full commit history
// - \`git log --oneline\` - View condensed history
// - \`git log -n <number>\` - View last N commits`,
//   hints: [
//     { id: 'hint-1', level: 1, text: 'Make three separate commits for three different files' },
//     { id: 'hint-2', level: 2, text: 'First: touch README.md, git add README.md, git commit -m "Add README"' },
//     { id: 'hint-3', level: 3, text: 'Repeat for app.js and test.js with appropriate messages' },
//     { id: 'hint-4', level: 4, text: 'View full history: git log' },
//     { id: 'hint-5', level: 5, text: 'View compact history: git log --oneline' },
//   ],
//   solution: {
//     commands: [
//       'git init',
//       'touch README.md',
//       'git add README.md',
//       'git commit -m "Add README"',
//       'touch app.js',
//       'git add app.js',
//       'git commit -m "Add main application"',
//       'touch test.js',
//       'git add test.js',
//       'git commit -m "Add tests"',
//       'git log',
//       'git log --oneline'
//     ],
//     explanation: 'Git log is your time machine! It shows who made changes, when, and why. The --oneline flag is great for quick overviews.',
//   },
//   validation: {
//     type: 'command-sequence',
//     requiredCommands: ['git init', 'git commit', 'git log'],
//     checkGitState: true,
//     expectedState: {
//       initialized: true,
//       commits: 3,
//     },
//   },
//   startingFiles: [],
//   expectedCommands: ['git init', 'touch', 'git add', 'git commit', 'git log'],
//   validationTests: [
//     {
//       id: 'test-1',
//       description: 'Three commits made and history viewed',
//       gitCheck: { type: 'commits', value: 3 },
//     },
//   ],
//   tags: ['git', 'log', 'history'],
//   prerequisites: [],
//   createdBy: 'system',
// },

// // CHALLENGE 7: Creating Feature Branches
// {
//   moduleId: 'git-branching',
//   title: 'Creating Feature Branches',
//   description: 'Learn to create branches with meaningful names for new features',
//   difficulty: 'intermediate',
//   points: 20,
//   orderIndex: 7,
//   estimatedTimeMinutes: 12,
//   isPublished: true,
//   instructions: `Branch naming conventions help teams stay organized. Practice creating well-named branches!

// **Your Task:**
// 1. Initialize a repository and make an initial commit
// 2. Create a branch called "feature/user-authentication"
// 3. Switch to that branch
// 4. Create a branch called "bugfix/login-error"
// 5. List all branches to see them

// **Branch naming conventions:**
// - feature/ - for new features
// - bugfix/ - for bug fixes
// - hotfix/ - for urgent production fixes
// - Use hyphens, not spaces`,
//   hints: [
//     { id: 'hint-1', level: 1, text: 'Start with git init and make a commit on main branch' },
//     { id: 'hint-2', level: 2, text: 'Create feature branch: git branch feature/user-authentication' },
//     { id: 'hint-3', level: 3, text: 'Switch to it: git checkout feature/user-authentication' },
//     { id: 'hint-4', level: 4, text: 'Create bugfix branch: git branch bugfix/login-error' },
//     { id: 'hint-5', level: 5, text: 'List branches: git branch' },
//   ],
//   solution: {
//     commands: [
//       'git init',
//       'touch main.txt',
//       'git add main.txt',
//       'git commit -m "Initial commit"',
//       'git branch feature/user-authentication',
//       'git checkout feature/user-authentication',
//       'git branch bugfix/login-error',
//       'git branch'
//     ],
//     explanation: 'Organized branch names make it easy for teams to understand what work is being done. The prefix (feature/, bugfix/) categorizes the work.',
//   },
//   validation: {
//     type: 'command-sequence',
//     requiredCommands: ['git init', 'git branch', 'git checkout'],
//     checkGitState: true,
//     expectedState: {
//       initialized: true,
//       branches: ['main', 'feature/user-authentication', 'bugfix/login-error'],
//     },
//   },
//   startingFiles: [],
//   expectedCommands: ['git init', 'git branch', 'git checkout'],
//   validationTests: [
//     {
//       id: 'test-1',
//       description: 'Multiple branches with proper naming',
//       gitCheck: { type: 'branch', value: 'feature' },
//     },
//   ],
//   tags: ['git', 'branches', 'workflow'],
//   prerequisites: [],
//   createdBy: 'system',
// },

// // CHALLENGE 8: Switching Between Branches
// {
//   moduleId: 'git-branching',
//   title: 'Switching Between Branches',
//   description: 'Practice moving between branches and understanding branch isolation',
//   difficulty: 'intermediate',
//   points: 25,
//   orderIndex: 8,
//   estimatedTimeMinutes: 15,
//   isPublished: true,
//   instructions: `Each branch is an isolated workspace. Let's practice switching between them!

// **Your Task:**
// 1. Initialize a repo and make initial commit
// 2. Create a branch "feature/navbar"
// 3. Switch to it and create "navbar.js"
// 4. Commit on the feature branch
// 5. Switch back to main
// 6. Create "footer.js" and commit on main
// 7. Switch between branches and use git log to see different histories

// **Key Concept:** Each branch has its own commit history!`,
//   hints: [
//     { id: 'hint-1', level: 1, text: 'Initialize and make a commit on main first' },
//     { id: 'hint-2', level: 2, text: 'Create and switch: git checkout -b feature/navbar (shortcut!)' },
//     { id: 'hint-3', level: 3, text: 'Make a commit on feature branch with navbar.js' },
//     { id: 'hint-4', level: 4, text: 'Switch back: git checkout main' },
//     { id: 'hint-5', level: 5, text: 'Make a different commit on main with footer.js' },
//   ],
//   solution: {
//     commands: [
//       'git init',
//       'touch index.html',
//       'git add index.html',
//       'git commit -m "Initial commit"',
//       'git checkout -b feature/navbar',
//       'touch navbar.js',
//       'git add navbar.js',
//       'git commit -m "Add navbar component"',
//       'git checkout main',
//       'touch footer.js',
//       'git add footer.js',
//       'git commit -m "Add footer"',
//       'git log --oneline'
//     ],
//     explanation: 'Branches let you work on multiple features simultaneously. Each branch maintains its own history until you merge them together.',
//   },
//   validation: {
//     type: 'command-sequence',
//     requiredCommands: ['git init', 'git checkout', 'git commit'],
//     checkGitState: true,
//     expectedState: {
//       initialized: true,
//       branches: ['main', 'feature/navbar'],
//       commits: 2,
//     },
//   },
//   startingFiles: [],
//   expectedCommands: ['git init', 'git checkout', 'git add', 'git commit'],
//   validationTests: [
//     {
//       id: 'test-1',
//       description: 'Commits on different branches',
//       gitCheck: { type: 'branches', value: 2 },
//     },
//   ],
//   tags: ['git', 'branches', 'checkout'],
//   prerequisites: [],
//   createdBy: 'system',
// },

// // CHALLENGE 9: Branch Visualization
// {
//   moduleId: 'git-branching',
//   title: 'Visualizing Branch History',
//   description: 'Learn to visualize and understand branch structures',
//   difficulty: 'intermediate',
//   points: 20,
//   orderIndex: 9,
//   estimatedTimeMinutes: 12,
//   isPublished: true,
//   instructions: `Understanding branch structure is crucial for collaboration. Let's visualize it!

// **Your Task:**
// 1. Initialize repo with initial commit
// 2. Create two branches: "develop" and "feature/api"
// 3. Make commits on each branch
// 4. Use git log --all --graph --oneline to see the branch structure
// 5. Use git branch -v to see last commit on each branch

// **Visualization commands:**
// - \`git log --graph --oneline --all\` - ASCII graph of branches
// - \`git branch -v\` - Branches with last commit
// - \`git log --oneline --graph\` - Current branch graph`,
//   hints: [
//     { id: 'hint-1', level: 1, text: 'Start with an initial commit on main' },
//     { id: 'hint-2', level: 2, text: 'Create branches: git branch develop, git branch feature/api' },
//     { id: 'hint-3', level: 3, text: 'Switch to each and make a commit' },
//     { id: 'hint-4', level: 4, text: 'Visualize: git log --all --graph --oneline' },
//     { id: 'hint-5', level: 5, text: 'Check branches: git branch -v' },
//   ],
//   solution: {
//     commands: [
//       'git init',
//       'touch README.md',
//       'git add README.md',
//       'git commit -m "Initial commit"',
//       'git branch develop',
//       'git branch feature/api',
//       'git checkout develop',
//       'touch dev.txt',
//       'git add dev.txt',
//       'git commit -m "Dev changes"',
//       'git checkout feature/api',
//       'touch api.js',
//       'git add api.js',
//       'git commit -m "Add API"',
//       'git log --all --graph --oneline',
//       'git branch -v'
//     ],
//     explanation: 'Visualization tools help you understand complex branch structures. The --graph flag shows branches as a tree, making relationships clear.',
//   },
//   validation: {
//     type: 'command-sequence',
//     requiredCommands: ['git init', 'git branch', 'git log'],
//     checkGitState: true,
//     expectedState: {
//       initialized: true,
//       branches: 3,
//     },
//   },
//   startingFiles: [],
//   expectedCommands: ['git init', 'git branch', 'git checkout', 'git log'],
//   validationTests: [
//     {
//       id: 'test-1',
//       description: 'Multiple branches visualized',
//       gitCheck: { type: 'visualization', value: true },
//     },
//   ],
//   tags: ['git', 'visualization', 'branches'],
//   prerequisites: [],
//   createdBy: 'system',
// },

// // CHALLENGE 10: Deleting Branches
// {
//   moduleId: 'git-branching',
//   title: 'Cleaning Up Branches',
//   description: 'Learn how to delete branches safely after completing work',
//   difficulty: 'intermediate',
//   points: 15,
//   orderIndex: 10,
//   estimatedTimeMinutes: 10,
//   isPublished: true,
//   instructions: `Keep your repository clean by deleting branches after merging. Let's practice!

// **Your Task:**
// 1. Initialize repo and make initial commit
// 2. Create a branch "feature/temp"
// 3. Create another branch "feature/old"
// 4. Delete "feature/temp" using git branch -d
// 5. Try to delete main (it should fail - you can't delete current branch!)
// 6. List remaining branches

// **Branch deletion:**
// - \`git branch -d <name>\` - Safe delete (only if merged)
// - \`git branch -D <name>\` - Force delete (even if unmerged)
// - Can't delete current branch`,
//   hints: [
//     { id: 'hint-1', level: 1, text: 'Initialize and make a commit' },
//     { id: 'hint-2', level: 2, text: 'Create both branches: git branch feature/temp, git branch feature/old' },
//     { id: 'hint-3', level: 3, text: 'Delete feature/temp: git branch -d feature/temp' },
//     { id: 'hint-4', level: 4, text: 'Make sure you are NOT on the branch you want to delete' },
//     { id: 'hint-5', level: 5, text: 'List branches: git branch' },
//   ],
//   solution: {
//     commands: [
//       'git init',
//       'touch file.txt',
//       'git add file.txt',
//       'git commit -m "Initial commit"',
//       'git branch feature/temp',
//       'git branch feature/old',
//       'git branch -d feature/temp',
//       'git branch'
//     ],
//     explanation: 'Deleting merged branches keeps your repository organized. Use -d for safe deletion (prevents data loss) or -D to force delete.',
//   },
//   validation: {
//     type: 'command-sequence',
//     requiredCommands: ['git init', 'git branch', 'git branch -d'],
//     checkGitState: true,
//     expectedState: {
//       initialized: true,
//       branches: ['main', 'feature/old'],
//     },
//   },
//   startingFiles: [],
//   expectedCommands: ['git init', 'git branch', 'git branch -d'],
//   validationTests: [
//     {
//       id: 'test-1',
//       description: 'Branch deleted successfully',
//       gitCheck: { type: 'branch-deleted', value: 'feature/temp' },
//     },
//   ],
//   tags: ['git', 'branches', 'cleanup'],
//   prerequisites: [],
//   createdBy: 'system',
// },

// // CHALLENGE 11: Git Status Deep Dive
// {
//   moduleId: 'git-basics',
//   title: 'Mastering Git Status',
//   description: 'Learn to read and understand git status output',
//   difficulty: 'beginner',
//   points: 15,
//   orderIndex: 11,
//   estimatedTimeMinutes: 12,
//   isPublished: true,
//   instructions: `Git status shows three states: untracked, modified, and staged. Master them all!

// **Your Task:**
// 1. Initialize a repository
// 2. Create three files: "tracked.txt", "modified.txt", "new.txt"
// 3. Add and commit "tracked.txt" and "modified.txt"
// 4. Modify "modified.txt" (by adding content or touching it again)
// 5. Run git status to see all three states:
//    - tracked.txt: committed (won't show)
//    - modified.txt: modified (red)
//    - new.txt: untracked (red)
// 6. Add "modified.txt" to staging (green)
// 7. Check status again

// **File states:**
// - Untracked: Git doesn't know about it
// - Modified: Changed since last commit
// - Staged: Ready to commit`,
//   hints: [
//     { id: 'hint-1', level: 1, text: 'Create all three files first with touch' },
//     { id: 'hint-2', level: 2, text: 'Add and commit tracked.txt and modified.txt together' },
//     { id: 'hint-3', level: 3, text: 'Modify modified.txt: touch modified.txt (updates timestamp)' },
//     { id: 'hint-4', level: 4, text: 'Run git status to see the different states' },
//     { id: 'hint-5', level: 5, text: 'Stage modified.txt: git add modified.txt, then check status again' },
//   ],
//   solution: {
//     commands: [
//       'git init',
//       'touch tracked.txt modified.txt new.txt',
//       'git add tracked.txt modified.txt',
//       'git commit -m "Initial files"',
//       'touch modified.txt',
//       'git status',
//       'git add modified.txt',
//       'git status'
//     ],
//     explanation: 'Git status is your most-used command! It shows exactly what state your files are in and what actions you can take next.',
//   },
//   validation: {
//     type: 'command-sequence',
//     requiredCommands: ['git init', 'git status', 'git add', 'git commit'],
//     checkGitState: true,
//     expectedState: {
//       initialized: true,
//       stagedFiles: ['modified.txt'],
//       untrackedFiles: ['new.txt'],
//     },
//   },
//   startingFiles: [],
//   expectedCommands: ['git init', 'touch', 'git add', 'git commit', 'git status'],
//   validationTests: [
//     {
//       id: 'test-1',
//       description: 'Files in different states',
//       gitCheck: { type: 'status', value: 'mixed-states' },
//     },
//   ],
//   tags: ['git', 'status', 'staging'],
//   prerequisites: [],
//   createdBy: 'system',
// },

// // CHALLENGE 12: Undoing Changes in Working Directory
// {
//   moduleId: 'git-basics',
//   title: 'Discarding Local Changes',
//   description: 'Learn how to undo changes before committing',
//   difficulty: 'intermediate',
//   points: 20,
//   orderIndex: 12,
//   estimatedTimeMinutes: 15,
//   isPublished: true,
//   instructions: `Made a mistake? Learn to undo changes safely before committing!

// **Your Task:**
// 1. Initialize repo and create "code.js"
// 2. Commit the file
// 3. Modify "code.js" (simulate making a mistake)
// 4. Use git status to see it's modified
// 5. Discard changes with git restore code.js (or git checkout -- code.js)
// 6. Verify with git status that changes were discarded

// **Undo commands:**
// - \`git restore <file>\` - Discard changes (Git 2.23+)
// - \`git checkout -- <file>\` - Discard changes (older Git)
// - \`git restore --staged <file>\` - Unstage file
// - ⚠️ This permanently deletes local changes!`,
//   hints: [
//     { id: 'hint-1', level: 1, text: 'Create and commit code.js first' },
//     { id: 'hint-2', level: 2, text: 'Modify it: touch code.js or echo "error" >> code.js' },
//     { id: 'hint-3', level: 3, text: 'Check status: git status' },
//     { id: 'hint-4', level: 4, text: 'Restore: git restore code.js' },
//     { id: 'hint-5', level: 5, text: 'Verify: git status (should be clean)' },
//   ],
//   solution: {
//     commands: [
//       'git init',
//       'touch code.js',
//       'git add code.js',
//       'git commit -m "Add code file"',
//       'touch code.js',
//       'git status',
//       'git restore code.js',
//       'git status'
//     ],
//     explanation: 'Git restore lets you undo local changes before committing. Use it carefully - discarded changes cannot be recovered!',
//   },
//   validation: {
//     type: 'command-sequence',
//     requiredCommands: ['git init', 'git commit', 'git restore'],
//     checkGitState: true,
//     expectedState: {
//       initialized: true,
//       modifiedFiles: [],
//       stagedFiles: [],
//     },
//   },
//   startingFiles: [],
//   expectedCommands: ['git init', 'touch', 'git add', 'git commit', 'git restore'],
//   validationTests: [
//     {
//       id: 'test-1',
//       description: 'Changes discarded successfully',
//       gitCheck: { type: 'clean', value: true },
//     },
//   ],
//   tags: ['git', 'undo', 'restore'],
//   prerequisites: [],
//   createdBy: 'system',
// },

// // CHALLENGE 13: Unstaging Files
// {
//   moduleId: 'git-basics',
//   title: 'Removing Files from Staging Area',
//   description: 'Learn to unstage files without losing changes',
//   difficulty: 'intermediate',
//   points: 15,
//   orderIndex: 13,
//   estimatedTimeMinutes: 10,
//   isPublished: true,
//   instructions: `Staged the wrong file? Learn to unstage it while keeping your changes!

// **Your Task:**
// 1. Initialize repo
// 2. Create "important.js" and "accidental.js"
// 3. Stage BOTH files with git add .
// 4. Realize you only want to commit "important.js"
// 5. Unstage "accidental.js" using git restore --staged accidental.js
// 6. Commit only "important.js"
// 7. Verify "accidental.js" is still there but untracked

// **Key Difference:**
// - \`git restore <file>\` - Discards changes (deletes!)
// - \`git restore --staged <file>\` - Unstages only (keeps changes)`,
//   hints: [
//     { id: 'hint-1', level: 1, text: 'Create both files: touch important.js accidental.js' },
//     { id: 'hint-2', level: 2, text: 'Stage both: git add .' },
//     { id: 'hint-3', level: 3, text: 'Unstage accidental: git restore --staged accidental.js' },
//     { id: 'hint-4', level: 4, text: 'Commit important: git commit -m "Add important file"' },
//     { id: 'hint-5', level: 5, text: 'Check status: accidental.js should still exist but be untracked' },
//   ],
//   solution: {
//     commands: [
//       'git init',
//       'touch important.js accidental.js',
//       'git add .',
//       'git restore --staged accidental.js',
//       'git commit -m "Add important file"',
//       'git status'
//     ],
//     explanation: 'Unstaging lets you control what goes into each commit without losing your work. This is safer than discarding changes.',
//   },
//   validation: {
//     type: 'command-sequence',
//     requiredCommands: ['git init', 'git add', 'git restore --staged', 'git commit'],
//     checkGitState: true,
//     expectedState: {
//       initialized: true,
//       commits: 1,
//       untrackedFiles: ['accidental.js'],
//     },
//   },
//   startingFiles: [],
//   expectedCommands: ['git init', 'touch', 'git add', 'git restore', 'git commit'],
//   validationTests: [
//     {
//       id: 'test-1',
//       description: 'File unstaged but preserved',
//       gitCheck: { type: 'unstaged', value: 'accidental.js' },
//     },
//   ],
//   tags: ['git', 'staging', 'unstage'],
//   prerequisites: [],
//   createdBy: 'system',
// },
// ];

// // Clear existing challenges and seed new ones
// async function seedChallenges() {
//   console.log('🌱 Seeding challenges to Firestore...\n');

//   try {
//     // Step 1: Clear existing challenges
//     console.log('🗑️  Clearing existing challenges...');
//     const existingChallenges = await getDocs(collection(db, 'challenges'));
//     const deletePromises = existingChallenges.docs.map(doc => deleteDoc(doc.ref));
//     await Promise.all(deletePromises);
//     console.log(`✅ Deleted ${existingChallenges.size} existing challenges\n`);

//     // Step 2: Add new challenges
//     console.log('📝 Adding new challenges...');
//     for (const challenge of mockChallenges) {
//       await addDoc(collection(db, 'challenges'), {
//         ...challenge,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });
//       console.log(`✅ Added: ${challenge.title}`);
//     }

//     console.log('\n🎉 Successfully seeded all challenges!');
//     console.log('Refresh your app - challenges should now work correctly.');
//   } catch (error) {
//     console.error('❌ Error seeding challenges:', error);
//     process.exit(1);
//   }

//   process.exit(0);
// }

// // Run the seed function
// seedChallenges();
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import dotenv from 'dotenv';
import { allChallenges } from './challenges/index.js';

dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedChallenges() {
  console.log('🌱 Seeding challenges to Firestore...\n');

  try {
    // Clear existing
    console.log('🗑️  Clearing existing challenges...');
    const existingChallenges = await getDocs(collection(db, 'challenges'));
    const deletePromises = existingChallenges.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log(`✅ Deleted ${existingChallenges.size} existing challenges\n`);

    // Seed new
    console.log('📝 Adding new challenges...');
    for (const challenge of allChallenges) {
      await addDoc(collection(db, 'challenges'), {
        ...challenge,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`✅ Added: ${challenge.title}`);
    }

    console.log(`\n🎉 Successfully seeded ${allChallenges.length} challenges!`);
    console.log('📊 Total points available: 500');
  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedChallenges();