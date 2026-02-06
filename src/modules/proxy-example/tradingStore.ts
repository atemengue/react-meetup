import { proxy, subscribe } from 'valtio';
import type { TradingState, PricePoint, MutationRecord } from './types';
import { INITIAL_STOCKS, generateStockUpdate } from './tradingData';
import { AnalyticsTracker } from './analytics';
import { PersistenceManager } from './persistence';
import { ObserverManager } from './observers';

// 1. PROXY WRAPPER
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

export const priceHistory = proxy<Record<string, PricePoint[]>>({});

// 2. OBSERVATEURS
export const observers = new ObserverManager();
subscribe(tradingState, () => {
  observers.notify('tradingState', tradingState, null);
});

// 3. PERSISTENCE
subscribe(tradingState, () => {
  persistence.save(JSON.parse(JSON.stringify(tradingState)));
});

// 4. ANALYTICS
export const analytics = new AnalyticsTracker(200);
subscribe(tradingState, () => {
  const snap = JSON.parse(JSON.stringify(tradingState)) as TradingState;
  for (const symbol of Object.keys(snap.stocks)) {
    const stock = snap.stocks[symbol];
    analytics.record(`stocks.${symbol}.price`, stock.previousPrice, stock.price, 'set');
  }
});

// 5. ACTIONS
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
      Object.assign(tradingState.stocks[symbol], update);
      if (!priceHistory[symbol]) priceHistory[symbol] = [];
      priceHistory[symbol].push({ timestamp: Date.now(), price: update.price!, volume: update.volume! });
      if (priceHistory[symbol].length > 50) {
        priceHistory[symbol] = priceHistory[symbol].slice(-50);
      }
    }
    tradingState.lastRefresh = Date.now();
  }, 1500);
}

export function stopSimulation() {
  if (simulationInterval) { clearInterval(simulationInterval); simulationInterval = null; }
}

export function isSimulating(): boolean { return simulationInterval !== null; }
export function selectStock(symbol: string) { tradingState.selectedStock = symbol; }

export function resetState() {
  stopSimulation();
  persistence.clear();
  analytics.clear();
  const freshStocks = structuredClone(INITIAL_STOCKS);
  for (const symbol of Object.keys(freshStocks)) {
    tradingState.stocks[symbol] = freshStocks[symbol];
  }
  tradingState.selectedStock = 'AAPL';
  tradingState.lastRefresh = Date.now();
  for (const key of Object.keys(priceHistory)) delete priceHistory[key];
}

export function getMutations(): ReadonlyArray<MutationRecord> { return analytics.getMutations(); }
export function getMutationRate(): number { return analytics.getMutationRate(); }
