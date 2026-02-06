import type { MutationRecord } from './types';

export class AnalyticsTracker {
  private mutations: MutationRecord[] = [];
  private maxRecords: number;

  constructor(maxRecords: number = 200) {
    this.maxRecords = maxRecords;
  }

  record(property: string, oldValue: unknown, newValue: unknown, action: 'set' | 'delete'): void {
    const record: MutationRecord = {
      id: `mut_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
      property,
      oldValue,
      newValue,
      action,
    };
    this.mutations.push(record);
    if (this.mutations.length > this.maxRecords) {
      this.mutations = this.mutations.slice(-this.maxRecords);
    }
  }

  getMutations(): ReadonlyArray<MutationRecord> {
    return this.mutations;
  }

  getCount(): number {
    return this.mutations.length;
  }

  getMutationRate(): number {
    const tenSecondsAgo = Date.now() - 10_000;
    const recentMutations = this.mutations.filter((m) => m.timestamp > tenSecondsAgo);
    return Math.round((recentMutations.length / 10) * 10) / 10;
  }

  clear(): void {
    this.mutations = [];
  }
}
