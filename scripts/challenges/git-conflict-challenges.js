const gitConflictChallenges = [
  {
    moduleId: 'git-advanced',
    title: 'Resolving Your First Merge Conflict',
    description: 'Learn to identify and resolve merge conflicts when branches diverge',
    difficulty: 'advanced',
    points: 50,
    orderIndex: 25,
    estimatedTimeMinutes: 25,
    isPublished: true,
    instructions: `Merge conflicts happen when two branches modify the same lines. Let's practice resolving them!

**Your Task:**
1. Initialize a repository and create a file "config.txt" with content "version=1.0"
2. Commit it on main
3. Create a branch "feature/update-config"
4. On the feature branch, change the file to "version=2.0" and commit
5. Switch back to main and change the file to "version=1.5" and commit
6. Try to merge the feature branch (conflict will occur)
7. Resolve the conflict by accepting "version=2.0"
8. Complete the merge with a commit

**This teaches you:**
- Why conflicts happen
- How to identify conflicts
- How to resolve conflicts
- How to complete a merge after resolving`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Create the file and commit it first on main' },
      { id: 'hint-2', level: 2, text: 'Make sure both branches modify the SAME line in the file' },
      { id: 'hint-3', level: 3, text: 'When you try to merge, Git will tell you there is a conflict' },
      { id: 'hint-4', level: 4, text: 'Edit the file to remove conflict markers and choose version=2.0' },
      { id: 'hint-5', level: 5, text: 'After resolving, git add the file and git commit to finish' },
    ],
    solution: {
      commands: [
        'git init',
        'echo "version=1.0" > config.txt',
        'git add config.txt',
        'git commit -m "Initial config"',
        'git checkout -b feature/update-config',
        'echo "version=2.0" > config.txt',
        'git add config.txt',
        'git commit -m "Update to version 2.0"',
        'git checkout main',
        'echo "version=1.5" > config.txt',
        'git add config.txt',
        'git commit -m "Update to version 1.5"',
        'git merge feature/update-config',
        '# Conflict occurs here - resolve it',
        'echo "version=2.0" > config.txt',
        'git add config.txt',
        'git commit -m "Merge feature/update-config"',
      ],
      explanation: 'Conflicts occur when the same lines are modified in both branches. To resolve: 1) Identify the conflict, 2) Edit the file to keep desired changes, 3) Stage the resolved file, 4) Complete the merge with a commit.',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: ['git init', 'git merge', 'git commit'],
      checkGitState: true,
      expectedState: {
        initialized: true,
        merged: true,
        commits: 4,
      },
    },
    startingFiles: [],
    expectedCommands: ['git init', 'echo', 'git add', 'git commit', 'git merge'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Merge conflict was resolved',
        gitCheck: { type: 'merged', value: true },
      },
    ],
    tags: ['git', 'conflicts', 'merge', 'advanced'],
    prerequisites: ['git-merging'],
    createdBy: 'system',
  },
]

export default gitConflictChallenges