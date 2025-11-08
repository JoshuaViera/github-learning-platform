// scripts/challenges/git-basics.js

const gitBasicsChallenges = [
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
  {
    moduleId: 'git-basics',
    title: 'Understanding the Staging Area',
    description: 'Learn the difference between working directory, staging area, and repository',
    difficulty: 'beginner',
    points: 15,
    orderIndex: 4,
    estimatedTimeMinutes: 10,
    isPublished: true,
    instructions: `The staging area is like a preparation zone before committing. Let's practice!

**Your Task:**
1. Initialize a repository
2. Create two files: "file1.txt" and "file2.txt"
3. Add ONLY "file1.txt" to the staging area
4. Check the status to see the difference
5. Commit only the staged file

**Commands you'll need:**
- \`git init\` - Initialize repository
- \`touch <filename>\` - Create files
- \`git add <filename>\` - Stage specific file
- \`git status\` - Check what's staged vs unstaged
- \`git commit -m "message"\` - Commit staged changes`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Start with git init' },
      { id: 'hint-2', level: 2, text: 'Create both files: touch file1.txt file2.txt' },
      { id: 'hint-3', level: 3, text: 'Only stage file1.txt: git add file1.txt' },
      { id: 'hint-4', level: 4, text: 'Use git status to see file1.txt is staged and file2.txt is untracked' },
      { id: 'hint-5', level: 5, text: 'Commit with: git commit -m "Add file1"' },
    ],
    solution: {
      commands: [
        'git init',
        'touch file1.txt file2.txt',
        'git add file1.txt',
        'git status',
        'git commit -m "Add file1"'
      ],
      explanation: 'The staging area lets you control exactly what goes into each commit. You can work on multiple files but commit them separately for better organization.',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: ['git init', 'touch', 'git add file1.txt', 'git commit'],
      checkGitState: true,
      expectedState: {
        initialized: true,
        commits: 1,
        stagedFiles: [],
        untrackedFiles: ['file2.txt'],
      },
    },
    startingFiles: [],
    expectedCommands: ['git init', 'touch', 'git add', 'git status', 'git commit'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Repository initialized and one file committed',
        gitCheck: { type: 'commit', value: 'file1' },
      },
    ],
    tags: ['git', 'staging', 'basics'],
    prerequisites: [],
    createdBy: 'system',
  },
  {
    moduleId: 'git-basics',
    title: 'Writing Good Commit Messages',
    description: 'Learn how to write clear, descriptive commit messages',
    difficulty: 'beginner',
    points: 10,
    orderIndex: 5,
    estimatedTimeMinutes: 8,
    isPublished: true,
    instructions: `Good commit messages are essential for team collaboration. Practice writing them!

**Your Task:**
1. Initialize a repository
2. Create a file called "index.html"
3. Stage and commit it with message: "Add homepage structure"
4. Create another file "styles.css"
5. Stage and commit it with message: "Add stylesheet for homepage"

**Good commit message format:**
- Start with a verb (Add, Fix, Update, Remove)
- Be specific and concise
- Describe WHAT and WHY, not HOW`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Initialize with git init' },
      { id: 'hint-2', level: 2, text: 'Create and commit index.html first' },
      { id: 'hint-3', level: 3, text: 'Use exact message: git commit -m "Add homepage structure"' },
      { id: 'hint-4', level: 4, text: 'Then create and commit styles.css' },
      { id: 'hint-5', level: 5, text: 'Second commit: git commit -m "Add stylesheet for homepage"' },
    ],
    solution: {
      commands: [
        'git init',
        'touch index.html',
        'git add index.html',
        'git commit -m "Add homepage structure"',
        'touch styles.css',
        'git add styles.css',
        'git commit -m "Add stylesheet for homepage"'
      ],
      explanation: 'Clear commit messages help your team understand the project history. Start with action verbs and be specific about what changed.',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: ['git init', 'git commit'],
      checkGitState: true,
      expectedState: {
        initialized: true,
        commits: 2,
      },
    },
    startingFiles: [],
    expectedCommands: ['git init', 'touch', 'git add', 'git commit'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Two commits with descriptive messages',
        gitCheck: { type: 'commit', value: 'Add' },
      },
    ],
    tags: ['git', 'commit-messages', 'best-practices'],
    prerequisites: [],
    createdBy: 'system',
  },
  {
    moduleId: 'git-basics',
    title: 'Viewing Commit History',
    description: 'Learn how to view and navigate your project history',
    difficulty: 'beginner',
    points: 15,
    orderIndex: 6,
    estimatedTimeMinutes: 10,
    isPublished: true,
    instructions: `Git log shows you the history of your project. Let's explore it!

**Your Task:**
1. Initialize a repository
2. Create and commit "README.md"
3. Create and commit "app.js"
4. Create and commit "test.js"
5. Use git log to view the history
6. Use git log --oneline for a compact view

**Commands you'll need:**
- \`git log\` - View full commit history
- \`git log --oneline\` - View condensed history
- \`git log -n <number>\` - View last N commits`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Make three separate commits for three different files' },
      { id: 'hint-2', level: 2, text: 'First: touch README.md, git add README.md, git commit -m "Add README"' },
      { id: 'hint-3', level: 3, text: 'Repeat for app.js and test.js with appropriate messages' },
      { id: 'hint-4', level: 4, text: 'View full history: git log' },
      { id: 'hint-5', level: 5, text: 'View compact history: git log --oneline' },
    ],
    solution: {
      commands: [
        'git init',
        'touch README.md',
        'git add README.md',
        'git commit -m "Add README"',
        'touch app.js',
        'git add app.js',
        'git commit -m "Add main application"',
        'touch test.js',
        'git add test.js',
        'git commit -m "Add tests"',
        'git log',
        'git log --oneline'
      ],
      explanation: 'Git log is your time machine! It shows who made changes, when, and why. The --oneline flag is great for quick overviews.',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: ['git init', 'git commit', 'git log'],
      checkGitState: true,
      expectedState: {
        initialized: true,
        commits: 3,
      },
    },
    startingFiles: [],
    expectedCommands: ['git init', 'touch', 'git add', 'git commit', 'git log'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Three commits made and history viewed',
        gitCheck: { type: 'commits', value: 3 },
      },
    ],
    tags: ['git', 'log', 'history'],
    prerequisites: [],
    createdBy: 'system',
  },
  {
    moduleId: 'git-basics',
    title: 'Mastering Git Status',
    description: 'Learn to read and understand git status output',
    difficulty: 'beginner',
    points: 15,
    orderIndex: 11,
    estimatedTimeMinutes: 12,
    isPublished: true,
    instructions: `Git status shows three states: untracked, modified, and staged. Master them all!

**Your Task:**
1. Initialize a repository
2. Create three files: "tracked.txt", "modified.txt", "new.txt"
3. Add and commit "tracked.txt" and "modified.txt"
4. Modify "modified.txt" (by touching it again)
5. Run git status to see all three states
6. Add "modified.txt" to staging
7. Check status again

**File states:**
- Untracked: Git doesn't know about it
- Modified: Changed since last commit
- Staged: Ready to commit`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Create all three files first with touch' },
      { id: 'hint-2', level: 2, text: 'Add and commit tracked.txt and modified.txt together' },
      { id: 'hint-3', level: 3, text: 'Modify modified.txt: touch modified.txt (updates timestamp)' },
      { id: 'hint-4', level: 4, text: 'Run git status to see the different states' },
      { id: 'hint-5', level: 5, text: 'Stage modified.txt: git add modified.txt, then check status again' },
    ],
    solution: {
      commands: [
        'git init',
        'touch tracked.txt modified.txt new.txt',
        'git add tracked.txt modified.txt',
        'git commit -m "Initial files"',
        'touch modified.txt',
        'git status',
        'git add modified.txt',
        'git status'
      ],
      explanation: 'Git status is your most-used command! It shows exactly what state your files are in and what actions you can take next.',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: ['git init', 'git status', 'git add', 'git commit'],
      checkGitState: true,
      expectedState: {
        initialized: true,
        stagedFiles: ['modified.txt'],
        untrackedFiles: ['new.txt'],
      },
    },
    startingFiles: [],
    expectedCommands: ['git init', 'touch', 'git add', 'git commit', 'git status'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Files in different states',
        gitCheck: { type: 'status', value: 'mixed-states' },
      },
    ],
    tags: ['git', 'status', 'staging'],
    prerequisites: [],
    createdBy: 'system',
  },
]

export default gitBasicsChallenges