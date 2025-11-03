const gitAdvancedChallenges = [
  {
    moduleId: 'git-advanced',
    title: 'Stashing Work in Progress',
    description: 'Learn to temporarily save uncommitted changes',
    difficulty: 'intermediate',
    points: 25,
    orderIndex: 22,
    estimatedTimeMinutes: 15,
    isPublished: true,
    instructions: `Need to switch branches but have uncommitted work? Stash it!

**Your Task:**
1. Initialize repo and make initial commit
2. Start working on a file (modify it but don't commit)
3. Use git stash to save your work
4. See your working directory is clean with git status
5. Recover your work with git stash pop

**What is Stash?**
A temporary shelf for uncommitted changes. Like hitting "pause" on your work!

**Stash Commands:**
- \`git stash\` - Save changes
- \`git stash list\` - See saved stashes
- \`git stash pop\` - Restore and delete stash
- \`git stash apply\` - Restore but keep stash`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Create and commit a file first' },
      { id: 'hint-2', level: 2, text: 'Modify the file: echo "changes" >> file.txt' },
      { id: 'hint-3', level: 3, text: 'Stash: git stash' },
      { id: 'hint-4', level: 4, text: 'Check status: git status (should be clean)' },
      { id: 'hint-5', level: 5, text: 'Restore: git stash pop' },
    ],
    solution: {
      commands: [
        'git init',
        'touch work.txt',
        'git add work.txt',
        'git commit -m "Initial commit"',
        'echo "in progress" >> work.txt',
        'git status',
        'git stash',
        'git status',
        'git stash list',
        'git stash pop',
        'git status'
      ],
      explanation: 'Stashing is perfect when you need to quickly switch contexts without committing half-finished work. Your changes are safely stored until you are ready to continue.',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: ['git stash', 'git stash pop'],
      checkGitState: true,
      expectedState: {
        initialized: true,
        stashEmpty: true,
      },
    },
    startingFiles: [],
    expectedCommands: ['git stash', 'git stash list', 'git stash pop'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Work stashed and recovered',
        gitCheck: { type: 'stashed', value: true },
      },
    ],
    tags: ['git', 'stash', 'workflow'],
    prerequisites: [],
    createdBy: 'system',
  },
  {
    moduleId: 'git-advanced',
    title: 'Git Tags for Releases',
    description: 'Learn to mark important points in history with tags',
    difficulty: 'intermediate',
    points: 20,
    orderIndex: 23,
    estimatedTimeMinutes: 12,
    isPublished: true,
    instructions: `Tags mark specific commits as important milestones, like releases (v1.0, v2.0).

**Your Task:**
1. Initialize repo and make several commits
2. Create a lightweight tag: git tag v1.0
3. Make more commits
4. Create an annotated tag: git tag -a v2.0 -m "Version 2.0 release"
5. List tags with git tag
6. View tag details with git show v2.0

**Two Types of Tags:**
- **Lightweight:** Just a pointer (like a branch that doesn't move)
- **Annotated:** Includes message, date, tagger info (recommended for releases)`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Make 2-3 commits first' },
      { id: 'hint-2', level: 2, text: 'Simple tag: git tag v1.0' },
      { id: 'hint-3', level: 3, text: 'Make another commit' },
      { id: 'hint-4', level: 4, text: 'Annotated tag: git tag -a v2.0 -m "Major release"' },
      { id: 'hint-5', level: 5, text: 'List all tags: git tag' },
    ],
    solution: {
      commands: [
        'git init',
        'touch app.js',
        'git add app.js',
        'git commit -m "Initial version"',
        'git tag v1.0',
        'touch feature.js',
        'git add feature.js',
        'git commit -m "Add new feature"',
        'git tag -a v2.0 -m "Version 2.0 with new features"',
        'git tag',
        'git show v2.0'
      ],
      explanation: 'Tags are like permanent bookmarks in your history. Use them to mark releases so you can always find specific versions of your code.',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: ['git tag', 'git show'],
      checkGitState: true,
      expectedState: {
        initialized: true,
        tags: ['v1.0', 'v2.0'],
      },
    },
    startingFiles: [],
    expectedCommands: ['git tag', 'git show'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Tags created successfully',
        gitCheck: { type: 'tags', value: 2 },
      },
    ],
    tags: ['git', 'tags', 'releases', 'versioning'],
    prerequisites: [],
    createdBy: 'system',
  },
]

export default gitAdvancedChallenges