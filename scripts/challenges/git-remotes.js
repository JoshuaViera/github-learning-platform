export default [
  {
    moduleId: 'git-remotes',
    title: 'Understanding Remote Repositories',
    description: 'Learn the concept of remote repositories and why they matter',
    difficulty: 'intermediate',
    points: 20,
    orderIndex: 17,
    estimatedTimeMinutes: 12,
    isPublished: true,
    instructions: `Remote repositories (like GitHub) let you collaborate and backup your code. Let's learn the basics!

**Your Task:**
1. Initialize a repository
2. Make some commits
3. Add a simulated remote called "origin" pointing to a fake URL
4. View your remotes with git remote -v
5. Check remote info with git remote show origin

**Key Concepts:**
- **Local:** Your computer
- **Remote:** Server (GitHub, GitLab, etc.)
- **origin:** Default name for main remote
- **Remotes let you:** Collaborate, backup, deploy`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Initialize and make a couple commits' },
      { id: 'hint-2', level: 2, text: 'Add remote: git remote add origin https://github.com/user/repo.git' },
      { id: 'hint-3', level: 3, text: 'View remotes: git remote -v' },
      { id: 'hint-4', level: 4, text: 'Check details: git remote show origin' },
      { id: 'hint-5', level: 5, text: 'You can have multiple remotes with different names!' },
    ],
    solution: {
      commands: [
        'git init',
        'touch app.js',
        'git add app.js',
        'git commit -m "Initial app"',
        'git remote add origin https://github.com/pursuit/my-project.git',
        'git remote -v',
        'git remote show origin'
      ],
      explanation: 'Remote repositories enable collaboration. The "origin" remote is typically your main GitHub repository. You can have multiple remotes for different purposes.',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: ['git init', 'git remote add', 'git remote'],
      checkGitState: true,
      expectedState: {
        initialized: true,
        hasRemote: true,
        remoteName: 'origin',
      },
    },
    startingFiles: [],
    expectedCommands: ['git init', 'git remote'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Remote repository added',
        gitCheck: { type: 'remote', value: 'origin' },
      },
    ],
    tags: ['git', 'remote', 'github'],
    prerequisites: [],
    createdBy: 'system',
  },
  {
    moduleId: 'git-remotes',
    title: 'Pushing to Remote Repository',
    description: 'Learn how to push your local commits to a remote repository',
    difficulty: 'intermediate',
    points: 25,
    orderIndex: 18,
    estimatedTimeMinutes: 15,
    isPublished: true,
    instructions: `Pushing uploads your local commits to the remote repository. Essential for collaboration!

**Your Task:**
1. Initialize repo and make 2-3 commits
2. Add a remote called "origin"
3. "Push" your main branch to origin using git push -u origin main
4. The -u flag sets upstream tracking

**What is pushing?**
- **Push:** Upload local commits to remote
- **Upstream:** Links local branch to remote branch
- **-u flag:** Sets up tracking (only needed first time)`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Make a few commits first' },
      { id: 'hint-2', level: 2, text: 'Add remote: git remote add origin <url>' },
      { id: 'hint-3', level: 3, text: 'Push: git push -u origin main' },
      { id: 'hint-4', level: 4, text: 'The -u flag is short for --set-upstream' },
      { id: 'hint-5', level: 5, text: 'After this, just git push will work!' },
    ],
    solution: {
      commands: [
        'git init',
        'touch file1.txt',
        'git add file1.txt',
        'git commit -m "First commit"',
        'touch file2.txt',
        'git add file2.txt',
        'git commit -m "Second commit"',
        'git remote add origin https://github.com/pursuit/project.git',
        'git push -u origin main'
      ],
      explanation: 'Pushing sends your local commits to the remote repository. The -u flag creates a tracking relationship, so future pushes know where to go.',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: ['git init', 'git remote add', 'git push'],
      checkGitState: true,
      expectedState: {
        initialized: true,
        pushed: true,
        upstream: 'origin/main',
      },
    },
    startingFiles: [],
    expectedCommands: ['git init', 'git commit', 'git remote', 'git push'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Commits pushed to remote',
        gitCheck: { type: 'pushed', value: true },
      },
    ],
    tags: ['git', 'push', 'remote', 'collaboration'],
    prerequisites: [],
    createdBy: 'system',
  },
  {
    moduleId: 'git-remotes',
    title: 'Pulling from Remote Repository',
    description: 'Learn how to download changes from a remote repository',
    difficulty: 'intermediate',
    points: 25,
    orderIndex: 19,
    estimatedTimeMinutes: 15,
    isPublished: true,
    instructions: `Pulling downloads commits from the remote and merges them into your branch. Stay in sync!

**Your Task:**
1. Set up a repo with remote
2. Make and push a commit
3. Simulate someone else pushing to remote
4. Pull changes with git pull origin main
5. See the new commits in your log

**Git Pull = Git Fetch + Git Merge**
- **Fetch:** Downloads commits (doesn't change your files)
- **Merge:** Integrates downloaded commits
- **Pull:** Does both in one command`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Set up repo with remote and make initial commit' },
      { id: 'hint-2', level: 2, text: 'Push your commit: git push origin main' },
      { id: 'hint-3', level: 3, text: 'Simulate remote changes (in real life, teammate pushed)' },
      { id: 'hint-4', level: 4, text: 'Pull changes: git pull origin main' },
      { id: 'hint-5', level: 5, text: 'Check log: git log --oneline' },
    ],
    solution: {
      commands: [
        'git init',
        'git remote add origin https://github.com/pursuit/project.git',
        'touch local.txt',
        'git add local.txt',
        'git commit -m "Local work"',
        'git push origin main',
        'git pull origin main',
        'git log --oneline'
      ],
      explanation: 'Pulling keeps your local repository in sync with the remote. Always pull before pushing to avoid conflicts with your teammates work.',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: ['git init', 'git remote', 'git pull'],
      checkGitState: true,
      expectedState: {
        initialized: true,
        pulled: true,
      },
    },
    startingFiles: [],
    expectedCommands: ['git init', 'git remote', 'git push', 'git pull'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Remote changes pulled successfully',
        gitCheck: { type: 'pulled', value: true },
      },
    ],
    tags: ['git', 'pull', 'remote', 'sync'],
    prerequisites: [],
    createdBy: 'system',
  },
  {
    moduleId: 'git-remotes',
    title: 'Cloning a Repository',
    description: 'Learn how to copy a remote repository to your local machine',
    difficulty: 'beginner',
    points: 15,
    orderIndex: 20,
    estimatedTimeMinutes: 10,
    isPublished: true,
    instructions: `Cloning creates a local copy of a remote repository. This is how you start working on existing projects!

**Your Task:**
1. Simulate cloning a repository with git clone <url>
2. The clone command does several things automatically:
   - Creates a new directory
   - Initializes Git
   - Adds remote named "origin"
   - Downloads all commits
   - Checks out main branch

**Clone vs Init:**
- \`git init\` - Start NEW project
- \`git clone\` - Copy EXISTING project`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Clone: git clone https://github.com/pursuit/project.git' },
      { id: 'hint-2', level: 2, text: 'This creates a folder with the repo name' },
      { id: 'hint-3', level: 3, text: 'Navigate into it: cd project' },
      { id: 'hint-4', level: 4, text: 'Check remote: git remote -v' },
      { id: 'hint-5', level: 5, text: 'Check history: git log' },
    ],
    solution: {
      commands: [
        'git clone https://github.com/pursuit/fellowship.git',
        'cd fellowship',
        'git remote -v',
        'git log --oneline',
        'git status'
      ],
      explanation: 'Cloning is the most common way to start contributing to existing projects. It sets up everything automatically - you just start coding!',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: ['git clone', 'git remote'],
      checkGitState: true,
      expectedState: {
        cloned: true,
        hasRemote: true,
      },
    },
    startingFiles: [],
    expectedCommands: ['git clone', 'cd', 'git remote'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Repository cloned successfully',
        gitCheck: { type: 'cloned', value: true },
      },
    ],
    tags: ['git', 'clone', 'remote', 'github'],
    prerequisites: [],
    createdBy: 'system',
  },
  {
    moduleId: 'git-remotes',
    title: 'Git Fetch vs Git Pull',
    description: 'Understand the difference between fetch and pull',
    difficulty: 'intermediate',
    points: 20,
    orderIndex: 21,
    estimatedTimeMinutes: 15,
    isPublished: true,
    instructions: `Fetch and Pull both get remote changes, but work differently. Learn when to use each!

**Your Task:**
1. Set up repo with remote
2. Use git fetch origin to download updates (doesn't merge)
3. Check remote branches with git branch -r
4. See what would be merged with git log origin/main
5. Merge manually with git merge origin/main

**Key Difference:**
- **Fetch:** Safe. Downloads but doesn't change your files
- **Pull:** Fetch + Merge in one command (convenient but less control)`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Set up repo with remote and commits' },
      { id: 'hint-2', level: 2, text: 'Fetch: git fetch origin' },
      { id: 'hint-3', level: 3, text: 'View remote branches: git branch -r' },
      { id: 'hint-4', level: 4, text: 'Compare: git log HEAD..origin/main' },
      { id: 'hint-5', level: 5, text: 'Merge manually: git merge origin/main' },
    ],
    solution: {
      commands: [
        'git init',
        'git remote add origin https://github.com/pursuit/project.git',
        'touch file.txt',
        'git add file.txt',
        'git commit -m "Initial"',
        'git fetch origin',
        'git branch -r',
        'git log origin/main',
        'git merge origin/main'
      ],
      explanation: 'Fetch is safer for reviewing changes before integrating them. Pull is convenient for quick syncs. Use fetch when you want more control.',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: ['git fetch', 'git branch', 'git merge'],
      checkGitState: true,
      expectedState: {
        initialized: true,
        fetched: true,
      },
    },
    startingFiles: [],
    expectedCommands: ['git fetch', 'git branch -r', 'git merge'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Fetch and manual merge completed',
        gitCheck: { type: 'fetched', value: true },
      },
    ],
    tags: ['git', 'fetch', 'pull', 'remote'],
    prerequisites: [],
    createdBy: 'system',
  },
]