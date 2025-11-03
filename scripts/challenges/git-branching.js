export default [
  {
    moduleId: 'git-branching',
    title: 'Creating Feature Branches',
    description: 'Learn to create branches with meaningful names for new features',
    difficulty: 'intermediate',
    points: 20,
    orderIndex: 7,
    estimatedTimeMinutes: 12,
    isPublished: true,
    instructions: `Branch naming conventions help teams stay organized. Practice creating well-named branches!

**Your Task:**
1. Initialize a repository and make an initial commit
2. Create a branch called "feature/user-authentication"
3. Switch to that branch
4. Create a branch called "bugfix/login-error"
5. List all branches to see them

**Branch naming conventions:**
- feature/ - for new features
- bugfix/ - for bug fixes
- hotfix/ - for urgent production fixes
- Use hyphens, not spaces`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Start with git init and make a commit on main branch' },
      { id: 'hint-2', level: 2, text: 'Create feature branch: git branch feature/user-authentication' },
      { id: 'hint-3', level: 3, text: 'Switch to it: git checkout feature/user-authentication' },
      { id: 'hint-4', level: 4, text: 'Create bugfix branch: git branch bugfix/login-error' },
      { id: 'hint-5', level: 5, text: 'List branches: git branch' },
    ],
    solution: {
      commands: [
        'git init',
        'touch main.txt',
        'git add main.txt',
        'git commit -m "Initial commit"',
        'git branch feature/user-authentication',
        'git checkout feature/user-authentication',
        'git branch bugfix/login-error',
        'git branch'
      ],
      explanation: 'Organized branch names make it easy for teams to understand what work is being done. The prefix (feature/, bugfix/) categorizes the work.',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: ['git init', 'git branch', 'git checkout'],
      checkGitState: true,
      expectedState: {
        initialized: true,
        branches: ['main', 'feature/user-authentication', 'bugfix/login-error'],
      },
    },
    startingFiles: [],
    expectedCommands: ['git init', 'git branch', 'git checkout'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Multiple branches with proper naming',
        gitCheck: { type: 'branch', value: 'feature' },
      },
    ],
    tags: ['git', 'branches', 'workflow'],
    prerequisites: [],
    createdBy: 'system',
  },
  {
    moduleId: 'git-branching',
    title: 'Switching Between Branches',
    description: 'Practice moving between branches and understanding branch isolation',
    difficulty: 'intermediate',
    points: 25,
    orderIndex: 8,
    estimatedTimeMinutes: 15,
    isPublished: true,
    instructions: `Each branch is an isolated workspace. Let's practice switching between them!

**Your Task:**
1. Initialize a repo and make initial commit
2. Create a branch "feature/navbar"
3. Switch to it and create "navbar.js"
4. Commit on the feature branch
5. Switch back to main
6. Create "footer.js" and commit on main
7. Switch between branches and use git log to see different histories

**Key Concept:** Each branch has its own commit history!`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Initialize and make a commit on main first' },
      { id: 'hint-2', level: 2, text: 'Create and switch: git checkout -b feature/navbar (shortcut!)' },
      { id: 'hint-3', level: 3, text: 'Make a commit on feature branch with navbar.js' },
      { id: 'hint-4', level: 4, text: 'Switch back: git checkout main' },
      { id: 'hint-5', level: 5, text: 'Make a different commit on main with footer.js' },
    ],
    solution: {
      commands: [
        'git init',
        'touch index.html',
        'git add index.html',
        'git commit -m "Initial commit"',
        'git checkout -b feature/navbar',
        'touch navbar.js',
        'git add navbar.js',
        'git commit -m "Add navbar component"',
        'git checkout main',
        'touch footer.js',
        'git add footer.js',
        'git commit -m "Add footer"',
        'git log --oneline'
      ],
      explanation: 'Branches let you work on multiple features simultaneously. Each branch maintains its own history until you merge them together.',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: ['git init', 'git checkout', 'git commit'],
      checkGitState: true,
      expectedState: {
        initialized: true,
        branches: ['main', 'feature/navbar'],
        commits: 2,
      },
    },
    startingFiles: [],
    expectedCommands: ['git init', 'git checkout', 'git add', 'git commit'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Commits on different branches',
        gitCheck: { type: 'branches', value: 2 },
      },
    ],
    tags: ['git', 'branches', 'checkout'],
    prerequisites: [],
    createdBy: 'system',
  },
  {
    moduleId: 'git-branching',
    title: 'Visualizing Branch History',
    description: 'Learn to visualize and understand branch structures',
    difficulty: 'intermediate',
    points: 20,
    orderIndex: 9,
    estimatedTimeMinutes: 12,
    isPublished: true,
    instructions: `Understanding branch structure is crucial for collaboration. Let's visualize it!

**Your Task:**
1. Initialize repo with initial commit
2. Create two branches: "develop" and "feature/api"
3. Make commits on each branch
4. Use git log --all --graph --oneline to see the branch structure
5. Use git branch -v to see last commit on each branch

**Visualization commands:**
- \`git log --graph --oneline --all\` - ASCII graph of branches
- \`git branch -v\` - Branches with last commit`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Start with an initial commit on main' },
      { id: 'hint-2', level: 2, text: 'Create branches: git branch develop, git branch feature/api' },
      { id: 'hint-3', level: 3, text: 'Switch to each and make a commit' },
      { id: 'hint-4', level: 4, text: 'Visualize: git log --all --graph --oneline' },
      { id: 'hint-5', level: 5, text: 'Check branches: git branch -v' },
    ],
    solution: {
      commands: [
        'git init',
        'touch README.md',
        'git add README.md',
        'git commit -m "Initial commit"',
        'git branch develop',
        'git branch feature/api',
        'git checkout develop',
        'touch dev.txt',
        'git add dev.txt',
        'git commit -m "Dev changes"',
        'git checkout feature/api',
        'touch api.js',
        'git add api.js',
        'git commit -m "Add API"',
        'git log --all --graph --oneline',
        'git branch -v'
      ],
      explanation: 'Visualization tools help you understand complex branch structures. The --graph flag shows branches as a tree, making relationships clear.',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: ['git init', 'git branch', 'git log'],
      checkGitState: true,
      expectedState: {
        initialized: true,
        branches: 3,
      },
    },
    startingFiles: [],
    expectedCommands: ['git init', 'git branch', 'git checkout', 'git log'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Multiple branches visualized',
        gitCheck: { type: 'visualization', value: true },
      },
    ],
    tags: ['git', 'visualization', 'branches'],
    prerequisites: [],
    createdBy: 'system',
  },
  {
    moduleId: 'git-branching',
    title: 'Deleting Branches',
    description: 'Learn how to delete branches safely after completing work',
    difficulty: 'intermediate',
    points: 15,
    orderIndex: 10,
    estimatedTimeMinutes: 10,
    isPublished: true,
    instructions: `Keep your repository clean by deleting branches after merging. Let's practice!

**Your Task:**
1. Initialize repo and make initial commit
2. Create a branch "feature/temp"
3. Create another branch "feature/old"
4. Delete "feature/temp" using git branch -d
5. List remaining branches

**Branch deletion:**
- \`git branch -d <name>\` - Safe delete (only if merged)
- \`git branch -D <name>\` - Force delete (even if unmerged)
- Can't delete current branch`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Initialize and make a commit' },
      { id: 'hint-2', level: 2, text: 'Create both branches: git branch feature/temp, git branch feature/old' },
      { id: 'hint-3', level: 3, text: 'Delete feature/temp: git branch -d feature/temp' },
      { id: 'hint-4', level: 4, text: 'Make sure you are NOT on the branch you want to delete' },
      { id: 'hint-5', level: 5, text: 'List branches: git branch' },
    ],
    solution: {
      commands: [
        'git init',
        'touch file.txt',
        'git add file.txt',
        'git commit -m "Initial commit"',
        'git branch feature/temp',
        'git branch feature/old',
        'git branch -d feature/temp',
        'git branch'
      ],
      explanation: 'Deleting merged branches keeps your repository organized. Use -d for safe deletion (prevents data loss) or -D to force delete.',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: ['git init', 'git branch', 'git branch -d'],
      checkGitState: true,
      expectedState: {
        initialized: true,
        branches: ['main', 'feature/old'],
      },
    },
    startingFiles: [],
    expectedCommands: ['git init', 'git branch', 'git branch -d'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Branch deleted successfully',
        gitCheck: { type: 'branch-deleted', value: 'feature/temp' },
      },
    ],
    tags: ['git', 'branches', 'cleanup'],
    prerequisites: [],
    createdBy: 'system',
  },
  {
    moduleId: 'git-branching',
    title: 'Undoing Changes in Working Directory',
    description: 'Learn how to undo changes before committing',
    difficulty: 'intermediate',
    points: 20,
    orderIndex: 12,
    estimatedTimeMinutes: 15,
    isPublished: true,
    instructions: `Made a mistake? Learn to undo changes safely before committing!

**Your Task:**
1. Initialize repo and create "code.js"
2. Commit the file
3. Modify "code.js" (simulate making a mistake)
4. Use git status to see it's modified
5. Discard changes with git restore code.js
6. Verify with git status that changes were discarded

**Undo commands:**
- \`git restore <file>\` - Discard changes (Git 2.23+)
- \`git checkout -- <file>\` - Discard changes (older Git)
- ⚠️ This permanently deletes local changes!`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Create and commit code.js first' },
      { id: 'hint-2', level: 2, text: 'Modify it: touch code.js' },
      { id: 'hint-3', level: 3, text: 'Check status: git status' },
      { id: 'hint-4', level: 4, text: 'Restore: git restore code.js' },
      { id: 'hint-5', level: 5, text: 'Verify: git status (should be clean)' },
    ],
    solution: {
      commands: [
        'git init',
        'touch code.js',
        'git add code.js',
        'git commit -m "Add code file"',
        'touch code.js',
        'git status',
        'git restore code.js',
        'git status'
      ],
      explanation: 'Git restore lets you undo local changes before committing. Use it carefully - discarded changes cannot be recovered!',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: ['git init', 'git commit', 'git restore'],
      checkGitState: true,
      expectedState: {
        initialized: true,
        modifiedFiles: [],
        stagedFiles: [],
      },
    },
    startingFiles: [],
    expectedCommands: ['git init', 'touch', 'git add', 'git commit', 'git restore'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Changes discarded successfully',
        gitCheck: { type: 'clean', value: true },
      },
    ],
    tags: ['git', 'undo', 'restore'],
    prerequisites: [],
    createdBy: 'system',
  },
  {
    moduleId: 'git-branching',
    title: 'Removing Files from Staging Area',
    description: 'Learn to unstage files without losing changes',
    difficulty: 'intermediate',
    points: 15,
    orderIndex: 13,
    estimatedTimeMinutes: 10,
    isPublished: true,
    instructions: `Staged the wrong file? Learn to unstage it while keeping your changes!

**Your Task:**
1. Initialize repo
2. Create "important.js" and "accidental.js"
3. Stage BOTH files with git add .
4. Realize you only want to commit "important.js"
5. Unstage "accidental.js" using git restore --staged accidental.js
6. Commit only "important.js"
7. Verify "accidental.js" is still there but untracked

**Key Difference:**
- \`git restore <file>\` - Discards changes (deletes!)
- \`git restore --staged <file>\` - Unstages only (keeps changes)`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Create both files: touch important.js accidental.js' },
      { id: 'hint-2', level: 2, text: 'Stage both: git add .' },
      { id: 'hint-3', level: 3, text: 'Unstage accidental: git restore --staged accidental.js' },
      { id: 'hint-4', level: 4, text: 'Commit important: git commit -m "Add important file"' },
      { id: 'hint-5', level: 5, text: 'Check status: accidental.js should still exist but be untracked' },
    ],
    solution: {
      commands: [
        'git init',
        'touch important.js accidental.js',
        'git add .',
        'git restore --staged accidental.js',
        'git commit -m "Add important file"',
        'git status'
      ],
      explanation: 'Unstaging lets you control what goes into each commit without losing your work. This is safer than discarding changes.',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: ['git init', 'git add', 'git restore --staged', 'git commit'],
      checkGitState: true,
      expectedState: {
        initialized: true,
        commits: 1,
        untrackedFiles: ['accidental.js'],
      },
    },
    startingFiles: [],
    expectedCommands: ['git init', 'touch', 'git add', 'git restore', 'git commit'],
    validationTests: [
      {
        id: 'test-1',
        description: 'File unstaged but preserved',
        gitCheck: { type: 'unstaged', value: 'accidental.js' },
      },
    ],
    tags: ['git', 'staging', 'unstage'],
    prerequisites: [],
    createdBy: 'system',
  },
]