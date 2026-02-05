import type { Observer, ObserverCallback } from './types';

export class ObserverManager {
  private observers: Map<string, Observer> = new Map();
  private idCounter = 0;

  subscribe(callback: ObserverCallback, filter?: string): string {
    const id = `observer_${++this.idCounter}`;
    this.observers.set(id, { id, callback, filter });
    return id;
  }

  unsubscribe(id: string): boolean {
    return this.observers.delete(id);
  }

  notify(property: string, newValue: unknown, oldValue: unknown): void {
    for (const observer of this.observers.values()) {
      if (observer.filter && !property.startsWith(observer.filter)) {
        continue;
      }
      try {
        observer.callback(property, newValue, oldValue);
      } catch (error) {
        console.error(`Erreur dans l'observateur ${observer.id}:`, error);
      }
    }
  }

  getObserverCount(): number {
    return this.observers.size;
  }

  clear(): void {
    this.observers.clear();
  }
}
