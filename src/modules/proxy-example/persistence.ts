const DEFAULT_STORAGE_KEY = 'proxy-trading-state';

export class PersistenceManager {
  private storageKey: string;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private debounceMs: number;

  constructor(storageKey: string = DEFAULT_STORAGE_KEY, debounceMs: number = 500) {
    this.storageKey = storageKey;
    this.debounceMs = debounceMs;
  }

  save(state: Record<string, unknown>): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      try {
        const serialized = JSON.stringify(state);
        localStorage.setItem(this.storageKey, serialized);
      } catch (error) {
        console.error('Erreur de persistance:', error);
      }
    }, this.debounceMs);
  }

  load<T>(): T | null {
    try {
      const serialized = localStorage.getItem(this.storageKey);
      if (serialized === null) return null;
      return JSON.parse(serialized) as T;
    } catch (error) {
      console.error('Erreur de chargement:', error);
      return null;
    }
  }

  clear(): void {
    localStorage.removeItem(this.storageKey);
  }
}
