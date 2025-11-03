import gitBasics from './git-basics.js'
import gitBranching from './git-branching.js'
import gitMerging from './git-merging.js'
import gitRemotes from './git-remotes.js'
import gitAdvanced from './git-advanced.js'
import gitCapstone from './git-capstone.js'

export const allChallenges = [
  ...gitBasics,
  ...gitBranching,
  ...gitMerging,
  ...gitRemotes,
  ...gitAdvanced,
  ...gitCapstone,
]

export const challengesByModule = {
  'git-basics': gitBasics,
  'git-branching': gitBranching,
  'git-merging': gitMerging,
  'git-remotes': gitRemotes,
  'git-advanced': gitAdvanced,
  'git-capstone': gitCapstone,
}