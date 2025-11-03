const gitCapstoneChallenges = [
  {
    moduleId: 'git-capstone',
    title: 'The Complete Git Workflow',
    description: 'Real-world scenario combining everything you have learned',
    difficulty: 'advanced',
    points: 40,
    orderIndex: 24,
    estimatedTimeMinutes: 30,
    isPublished: true,
    instructions: `You're joining a team project. Complete the full workflow from start to finish!

**Scenario:** You're adding a new feature to an existing project.

**Your Task:**
1. Clone the project repository
2. Create a feature branch called "feature/user-profile"
3. Make 2 commits on your feature branch
4. Switch to main and make 1 commit (simulating teammate's work)
5. Merge your feature branch into main
6. Push to remote
7. Tag the release as v1.5.0
8. View the complete history

**This tests:**
✓ Cloning
✓ Branching
✓ Committing
✓ Merging
✓ Remote operations
✓ Tagging`,
    hints: [
      { id: 'hint-1', level: 1, text: 'Start with: git clone <url>' },
      { id: 'hint-2', level: 2, text: 'Create feature branch: git checkout -b feature/user-profile' },
      { id: 'hint-3', level: 3, text: 'Make your commits, then switch back to main' },
      { id: 'hint-4', level: 4, text: 'Merge feature branch: git merge feature/user-profile' },
      { id: 'hint-5', level: 5, text: 'Push and tag: git push origin main && git tag v1.5.0' },
    ],
    solution: {
      commands: [
        'git clone https://github.com/pursuit/project.git',
        'cd project',
        'git checkout -b feature/user-profile',
        'touch profile.js',
        'git add profile.js',
        'git commit -m "Add user profile component"',
        'touch profile.css',
        'git add profile.css',
        'git commit -m "Style user profile"',
        'git checkout main',
        'touch readme-update.txt',
        'git add readme-update.txt',
        'git commit -m "Update documentation"',
        'git merge feature/user-profile',
        'git push origin main',
        'git tag -a v1.5.0 -m "Release 1.5.0"',
        'git log --graph --oneline'
      ],
      explanation: 'This workflow simulates real team collaboration: clone project, work on feature branch, handle merge, push to remote, and tag release. This is the daily workflow of professional developers!',
    },
    validation: {
      type: 'command-sequence',
      requiredCommands: ['git clone', 'git checkout', 'git merge', 'git push', 'git tag'],
      checkGitState: true,
      expectedState: {
        cloned: true,
        merged: true,
        pushed: true,
        tagged: true,
        commits: 4,
      },
    },
    startingFiles: [],
    expectedCommands: ['git clone', 'git checkout', 'git merge', 'git push', 'git tag'],
    validationTests: [
      {
        id: 'test-1',
        description: 'Complete workflow executed',
        gitCheck: { type: 'workflow-complete', value: true },
      },
    ],
    tags: ['git', 'workflow', 'capstone', 'real-world'],
    prerequisites: ['git-basics', 'git-branching', 'git-merging', 'git-remotes'],
    createdBy: 'system',
  },
]
export default gitCapstoneChallenges