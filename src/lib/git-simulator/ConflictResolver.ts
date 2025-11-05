export interface ConflictMarker {
  file: string
  startLine: number
  endLine: number
  currentContent: string
  incomingContent: string
  baseContent?: string
}

export interface ConflictResolution {
  file: string
  resolvedContent: string
  resolution: 'accept-current' | 'accept-incoming' | 'accept-both' | 'custom'
}

export class ConflictResolver {
  private conflicts: Map<string, ConflictMarker[]> = new Map()

  detectConflicts(files: Map<string, string>): ConflictMarker[] {
    const allConflicts: ConflictMarker[] = []

    files.forEach((content, filename) => {
      const conflicts = this.parseConflictMarkers(filename, content)
      if (conflicts.length > 0) {
        this.conflicts.set(filename, conflicts)
        allConflicts.push(...conflicts)
      }
    })

    return allConflicts
  }

  private parseConflictMarkers(file: string, content: string): ConflictMarker[] {
    const lines = content.split('\n')
    const conflicts: ConflictMarker[] = []
    let inConflict = false
    let conflictStart = -1
    let currentContent: string[] = []
    let incomingContent: string[] = []
    let inIncoming = false

    lines.forEach((line, index) => {
      if (line.startsWith('<<<<<<<')) {
        inConflict = true
        conflictStart = index
        currentContent = []
        incomingContent = []
        inIncoming = false
      } else if (line.startsWith('=======') && inConflict) {
        inIncoming = true
      } else if (line.startsWith('>>>>>>>') && inConflict) {
        conflicts.push({
          file,
          startLine: conflictStart,
          endLine: index,
          currentContent: currentContent.join('\n'),
          incomingContent: incomingContent.join('\n'),
        })
        inConflict = false
      } else if (inConflict) {
        if (inIncoming) {
          incomingContent.push(line)
        } else {
          currentContent.push(line)
        }
      }
    })

    return conflicts
  }

  resolveConflict(resolution: ConflictResolution): string {
    const conflicts = this.conflicts.get(resolution.file)
    if (!conflicts || conflicts.length === 0) {
      return resolution.resolvedContent
    }

    // Apply resolution based on strategy
    switch (resolution.resolution) {
      case 'accept-current':
        return this.acceptCurrent(resolution.file, conflicts)
      case 'accept-incoming':
        return this.acceptIncoming(resolution.file, conflicts)
      case 'accept-both':
        return this.acceptBoth(resolution.file, conflicts)
      case 'custom':
        return resolution.resolvedContent
      default:
        return resolution.resolvedContent
    }
  }

  private acceptCurrent(file: string, conflicts: ConflictMarker[]): string {
    return conflicts.map((c) => c.currentContent).join('\n')
  }

  private acceptIncoming(file: string, conflicts: ConflictMarker[]): string {
    return conflicts.map((c) => c.incomingContent).join('\n')
  }

  private acceptBoth(file: string, conflicts: ConflictMarker[]): string {
    return conflicts
      .map((c) => `${c.currentContent}\n${c.incomingContent}`)
      .join('\n')
  }

  hasConflicts(): boolean {
    return this.conflicts.size > 0
  }

  getConflictCount(): number {
    let count = 0
    this.conflicts.forEach((conflicts) => {
      count += conflicts.length
    })
    return count
  }

  clearConflicts(): void {
    this.conflicts.clear()
  }
}