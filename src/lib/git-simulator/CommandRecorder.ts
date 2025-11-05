/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CommandRecord {
  id: string
  command: string
  timestamp: Date
  gitStateBefore: any
  gitStateAfter: any
  output: string
  success: boolean
}

export class CommandRecorder {
  private history: CommandRecord[] = []
  private currentIndex = -1

  record(
    command: string,
    stateBefore: any,
    stateAfter: any,
    output: string,
    success: boolean
  ): void {
    const record: CommandRecord = {
      id: `cmd-${Date.now()}`,
      command,
      timestamp: new Date(),
      gitStateBefore: JSON.parse(JSON.stringify(stateBefore)),
      gitStateAfter: JSON.parse(JSON.stringify(stateAfter)),
      output,
      success,
    }

    // If we're in the middle of history and add new command, truncate forward history
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1)
    }

    this.history.push(record)
    this.currentIndex = this.history.length - 1
  }

  getHistory(): CommandRecord[] {
    return this.history
  }

  getCurrentRecord(): CommandRecord | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return this.history[this.currentIndex]
    }
    return null
  }

  canGoBack(): boolean {
    return this.currentIndex > 0
  }

  canGoForward(): boolean {
    return this.currentIndex < this.history.length - 1
  }

  goBack(): CommandRecord | null {
    if (this.canGoBack()) {
      this.currentIndex--
      return this.history[this.currentIndex]
    }
    return null
  }

  goForward(): CommandRecord | null {
    if (this.canGoForward()) {
      this.currentIndex++
      return this.history[this.currentIndex]
    }
    return null
  }

  reset(): void {
    this.history = []
    this.currentIndex = -1
  }

  exportAsScript(): string {
    return this.history
      .filter((record) => record.success)
      .map((record) => record.command)
      .join('\n')
  }

  getSuccessfulCommands(): string[] {
    return this.history
      .filter((record) => record.success)
      .map((record) => record.command)
  }

  getTotalCommands(): number {
    return this.history.length
  }

  getSuccessRate(): number {
    if (this.history.length === 0) return 0
    const successful = this.history.filter((r) => r.success).length
    return (successful / this.history.length) * 100
  }
}