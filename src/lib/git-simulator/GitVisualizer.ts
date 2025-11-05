/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CommitNode {
  id: string
  hash: string
  message: string
  author: string
  timestamp: Date
  parents: string[]
  branches: string[]
  isHead: boolean
  x: number
  y: number
}

export interface BranchNode {
  name: string
  commitId: string
  color: string
  isHead: boolean
}

export interface VisualTree {
  commits: CommitNode[]
  branches: BranchNode[]
  edges: { from: string; to: string }[]
}

export class GitVisualizer {
  private commitSpacing = 80
  private branchSpacing = 100
  private colors = [
    '#22c55e', // green
    '#3b82f6', // blue
    '#f59e0b', // orange
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
  ]

  visualize(gitState: any): VisualTree {
    const commits = this.buildCommitNodes(gitState)
    const branches = this.buildBranchNodes(gitState)
    const edges = this.buildEdges(commits)

    return { commits, branches, edges }
  }

  private buildCommitNodes(gitState: any): CommitNode[] {
    const commits: CommitNode[] = []
    const commitMap = new Map<string, CommitNode>()

    // Extract commits from git state
    const allCommits = gitState.commits || []
    
    allCommits.forEach((commit: any, index: number) => {
      const node: CommitNode = {
        id: commit.hash || `commit-${index}`,
        hash: commit.hash?.substring(0, 7) || `${index}`,
        message: commit.message || 'Initial commit',
        author: commit.author || 'User',
        timestamp: commit.timestamp || new Date(),
        parents: commit.parents || [],
        branches: this.getCommitBranches(commit.hash, gitState),
        isHead: commit.hash === gitState.HEAD,
        x: 0,
        y: index * this.commitSpacing,
      }

      commitMap.set(node.id, node)
      commits.push(node)
    })

    // Calculate x positions based on branches
    this.calculateXPositions(commits, gitState)

    return commits.reverse() // Show newest at top
  }

  private buildBranchNodes(gitState: any): BranchNode[] {
    const branches: BranchNode[] = []
    const branchNames = Object.keys(gitState.branches || {})

    branchNames.forEach((name, index) => {
      branches.push({
        name,
        commitId: gitState.branches[name],
        color: this.colors[index % this.colors.length],
        isHead: name === gitState.currentBranch,
      })
    })

    return branches
  }

  private buildEdges(commits: CommitNode[]): { from: string; to: string }[] {
    const edges: { from: string; to: string }[] = []

    commits.forEach((commit) => {
      commit.parents.forEach((parentId) => {
        edges.push({ from: commit.id, to: parentId })
      })
    })

    return edges
  }

  private getCommitBranches(commitHash: string, gitState: any): string[] {
    const branches: string[] = []
    const branchMap = gitState.branches || {}

    Object.entries(branchMap).forEach(([name, hash]) => {
      if (hash === commitHash) {
        branches.push(name)
      }
    })

    return branches
  }

  private calculateXPositions(commits: CommitNode[], gitState: any): void {
    const branchNames = Object.keys(gitState.branches || {})
    const branchXMap = new Map<string, number>()

    branchNames.forEach((name, index) => {
      branchXMap.set(name, index * this.branchSpacing)
    })

    commits.forEach((commit) => {
      if (commit.branches.length > 0) {
        const branchName = commit.branches[0]
        commit.x = branchXMap.get(branchName) || 0
      } else {
        // Commits without branches go on main line
        commit.x = 0
      }
    })
  }

  getTreeDimensions(tree: VisualTree): { width: number; height: number } {
    let maxX = 0
    let maxY = 0

    tree.commits.forEach((commit) => {
      maxX = Math.max(maxX, commit.x)
      maxY = Math.max(maxY, commit.y)
    })

    return {
      width: maxX + 300,
      height: maxY + 150,
    }
  }
}