import { proxy, subscribe } from 'valtio';
import type { TradingState, PricePoint, MutationRecord } from './types';
import { INITIAL_STOCKS, generateStockUpdate } from './tradingData';
import { AnalyticsTracker } from './analytics';
import { PersistenceManager } from './persistence';
import { ObserverManager } from './observers';

// ====================================================
// 1. PROXY WRAPPER — Création de l'état réactif (valtio)
//    proxy() intercepte automatiquement get/set/delete
// ====================================================

const persistence = new PersistenceManager('proxy-trading-state', 500);
const savedState = persistence.load<TradingState>();

export const tradingState = proxy<TradingState>(
  savedState ?? {
    stocks: structuredClone(INITIAL_STOCKS),
    marketStatus: 'open',
    lastRefresh: Date.now(),
    selectedStock: 'AAPL',
  }
);

// État dérivé : historique de prix pour les courbes
export const priceHistory = proxy<Record<string, PricePoint[]>>({});

// ====================================================
// 2. PROXY HANDLER — Valtio utilise en interne un
//    ProxyHandler avec les traps get/set/deleteProperty.
//    Nous exposons ici la logique de "trapping" via
//    subscribe() qui écoute toute mutation.
// ====================================================

// ====================================================
// 3. OBSERVATEURS — Pattern pub/sub avec ObserverManager
//    + subscribe() natif de Valtio
// ====================================================

export const observers = new ObserverManager();

// Connecter les observateurs Valtio → ObserverManager
subscribe(tradingState, () => {
  observers.notify('tradingState', tradingState, null);
});

// ====================================================
// 4. PERSISTENCE — Sauvegarde automatique via subscribe
// ====================================================

subscribe(tradingState, () => {
  persistence.save(JSON.parse(JSON.stringify(tradingState)));
});

// ====================================================
// 5. ANALYTICS — Suivi de chaque mutation
// ====================================================

export const analytics = new AnalyticsTracker(200);

// Tracker les changements de prix des stocks
subscribe(tradingState, () => {
  const snap = JSON.parse(JSON.stringify(tradingState)) as TradingState;
  for (const symbol of Object.keys(snap.stocks)) {
    const stock = snap.stocks[symbol];
    analytics.record(
      `stocks.${symbol}.price`,
      stock.previousPrice,
      stock.price,
      'set'
    );
  }
});

// ====================================================
// 6. ACTIONS — Fonctions qui mutent l'état via le proxy
// ====================================================

let simulationInterval: ReturnType<typeof setInterval> | null = null;

export function startSimulation() {
  if (simulationInterval) return;

  simulationInterval = setInterval(() => {
    const symbols = Object.keys(tradingState.stocks);
    const count = Math.random() > 0.5 ? 2 : 1;

    for (let i = 0; i < count; i++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const stock = tradingState.stocks[symbol];
      const update = generateStockUpdate(stock);

      // Mutation directe via le proxy — déclenche les traps
      Object.assign(tradingState.stocks[symbol], update);

      // Historique pour la courbe
      if (!priceHistory[symbol]) {
        priceHistory[symbol] = [];
      }
      priceHistory[symbol].push({
        timestamp: Date.now(),
        price: update.price!,
        volume: update.volume!,
      });
      if (priceHistory[symbol].length > 50) {
        priceHistory[symbol] = priceHistory[symbol].slice(-50);
      }
    }

    tradingState.lastRefresh = Date.now();
  }, 1500);
}

export function stopSimulation() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
}

export function isSimulating(): boolean {
  return simulationInterval !== null;
}

export function selectStock(symbol: string) {
  tradingState.selectedStock = symbol;
}

export function resetState() {
  stopSimulation();
  persistence.clear();
  analytics.clear();

  // Réinitialiser les stocks
  const freshStocks = structuredClone(INITIAL_STOCKS);
  for (const symbol of Object.keys(freshStocks)) {
    tradingState.stocks[symbol] = freshStocks[symbol];
  }
  tradingState.selectedStock = 'AAPL';
  tradingState.lastRefresh = Date.now();

  // Vider l'historique
  for (const key of Object.keys(priceHistory)) {
    delete priceHistory[key];
  }
}

// ====================================================
// 7. EXPORT des managers pour le composant UI
// ====================================================

export function getMutations(): ReadonlyArray<MutationRecord> {
  return analytics.getMutations();
}

export function getMutationRate(): number {
  return analytics.getMutationRate();
}
