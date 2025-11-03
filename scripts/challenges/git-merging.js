export default [
  {
    moduleId: 'git-merging',
    title: 'Your First Merge - Fast Forward',
    description: 'Learn how to merge a feature branch back into main',
    difficulty: 'intermediate',
    points: 25,
    orderIndex: 14,
    estimatedTimeMinutes: 15,
    isPublished: true,
    instructions: `Merging combines work from different branches. Let's do your first merge!

**Your Task:**
1. Initialize repo and make initial commit on main
2. Create and switch to "feature/header"
3. Make a commit on the feature branch
4. Switch back to main
5. Merge feature/header into main using git merge feature/header
6. Use git log to see the merged history

**What is Fast-Forward?**
When main hasn't changed since branching, Git simply moves the main pointer forward. No merge commit needed!`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Start on main: git init, create file, commit' },
      { id: 'hint-2', level: 2, text: 'Create feature branch: git checkout -b feature/header' },
      { id: 'hint-3', level: 3, text: 'Make a commit on feature branch' },
      { id: 'hint-4', level: 4, text: 'Switch to main: git checkout main' },
      { id: 'hint-5', level: 5, text: 'Merge: git merge feature/header' },
    ],
    solution: {
      commands: [
        'git init',
        'touch index.html',
        'git add index.html',
        'git commit -m "Initial commit"',
        'git checkout -b feature/header',
        'touch header.js',
        'git add header.js',
        'git commit -m "Add header component"',
        'git checkout main',
        'git merge feature/header',
        'git log --oneline'
      ],
      explanation: 'A fast-forward merge happens when there are no new commits on main since the branch was created. Git just moves the main pointer forward to include the feature commits.',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: ['git init', 'git checkout', 'git commit', 'git merge'],
      checkGitState: true,
      expectedState: {
        initialized: true,
        branches: ['main', 'feature/header'],
        currentBranch: 'main',
        commits: 2,
      },
    },
    startingFiles: [],
    expectedCommands: ['git init', 'git checkout', 'git merge'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Feature branch merged into main',
        gitCheck: { type: 'merged', value: 'feature/header' },
      },
    ],
    tags: ['git', 'merge', 'fast-forward'],
    prerequisites: [],
    createdBy: 'system',
  },
  {
    moduleId: 'git-merging',
    title: 'Three-Way Merge',
    description: 'Learn to merge when both branches have new commits',
    difficulty: 'intermediate',
    points: 30,
    orderIndex: 15,
    estimatedTimeMinutes: 18,
    isPublished: true,
    instructions: `When both branches have commits, Git creates a merge commit. Let's practice!

**Your Task:**
1. Initialize repo with initial commit
2. Create "feature/navbar" branch and make a commit
3. Switch back to main and make a DIFFERENT commit
4. Merge feature/navbar into main (will create merge commit)
5. Look at git log --graph to see the merge

**Three-Way Merge:**
When both branches have moved forward, Git creates a special merge commit with TWO parents!`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Make initial commit on main' },
      { id: 'hint-2', level: 2, text: 'Create feature branch and commit something' },
      { id: 'hint-3', level: 3, text: 'Switch to main and commit something DIFFERENT' },
      { id: 'hint-4', level: 4, text: 'Now merge: git merge feature/navbar' },
      { id: 'hint-5', level: 5, text: 'Git will create a merge commit automatically' },
    ],
    solution: {
      commands: [
        'git init',
        'touch base.txt',
        'git add base.txt',
        'git commit -m "Initial commit"',
        'git checkout -b feature/navbar',
        'touch navbar.js',
        'git add navbar.js',
        'git commit -m "Add navbar"',
        'git checkout main',
        'touch footer.js',
        'git add footer.js',
        'git commit -m "Add footer"',
        'git merge feature/navbar',
        'git log --graph --oneline'
      ],
      explanation: 'A three-way merge creates a special commit that has two parents - one from each branch. This preserves the complete history of both branches.',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: ['git init', 'git checkout', 'git merge'],
      checkGitState: true,
      expectedState: {
        initialized: true,
        mergeCommit: true,
        commits: 4,
      },
    },
    startingFiles: [],
    expectedCommands: ['git init', 'git checkout', 'git commit', 'git merge'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Three-way merge completed',
        gitCheck: { type: 'merge-commit', value: true },
      },
    ],
    tags: ['git', 'merge', 'three-way'],
    prerequisites: [],
    createdBy: 'system',
  },
  {
    moduleId: 'git-merging',
    title: 'Understanding Merge Conflicts',
    description: 'Learn what causes merge conflicts and how to identify them',
    difficulty: 'advanced',
    points: 35,
    orderIndex: 16,
    estimatedTimeMinutes: 20,
    isPublished: true,
    instructions: `Merge conflicts happen when both branches modify the same part of a file. Let's understand them!

**Your Task:**
1. Initialize repo and create "config.txt"
2. Commit it on main
3. Create "feature/update-config" branch
4. On feature branch, modify config.txt and commit
5. Switch to main and modify config.txt DIFFERENTLY and commit
6. Try to merge feature branch (conflict will occur)
7. Use git status to see conflicted files

**What causes conflicts?**
When two branches change the SAME lines in the SAME file, Git can't auto-merge.`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Create and commit config.txt on main' },
      { id: 'hint-2', level: 2, text: 'Branch off and modify config.txt' },
      { id: 'hint-3', level: 3, text: 'Go back to main and modify config.txt differently' },
      { id: 'hint-4', level: 4, text: 'Attempt merge: git merge feature/update-config' },
      { id: 'hint-5', level: 5, text: 'Check status: git status (will show conflict)' },
    ],
    solution: {
      commands: [
        'git init',
        'touch config.txt',
        'git add config.txt',
        'git commit -m "Add config"',
        'git checkout -b feature/update-config',
        'echo "feature version" > config.txt',
        'git add config.txt',
        'git commit -m "Update config for feature"',
        'git checkout main',
        'echo "main version" > config.txt',
        'git add config.txt',
        'git commit -m "Update config on main"',
        'git merge feature/update-config',
        'git status'
      ],
      explanation: 'Merge conflicts occur when Git cannot automatically determine which changes to keep. This happens when the same lines are modified in both branches.',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: ['git init', 'git merge', 'git status'],
      checkGitState: true,
      expectedState: {
        initialized: true,
        hasConflict: true,
      },
    },
    startingFiles: [],
    expectedCommands: ['git init', 'git checkout', 'echo', 'git merge'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Merge conflict identified',
        gitCheck: { type: 'conflict', value: true },
      },
    ],
    tags: ['git', 'merge', 'conflicts'],
    prerequisites: [],
    createdBy: 'system',
  },
]