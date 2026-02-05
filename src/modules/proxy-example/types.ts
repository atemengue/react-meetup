export interface StockData {
  symbol: string;
  name: string;
  price: number;
  previousPrice: number;
  volume: number;
  high: number;
  low: number;
  change: number;
  changePercent: number;
  lastUpdated: number;
}

export interface TradingState {
  stocks: Record<string, StockData>;
  marketStatus: 'open' | 'closed' | 'pre-market';
  lastRefresh: number;
  selectedStock: string;
}

export interface MutationRecord {
  id: string;
  timestamp: number;
  property: string;
  oldValue: unknown;
  newValue: unknown;
  action: 'set' | 'delete';
}

export type ObserverCallback = (
  property: string,
  newValue: unknown,
  oldValue: unknown
) => void;

export interface Observer {
  id: string;
  callback: ObserverCallback;
  filter?: string;
}

export interface PricePoint {
  timestamp: number;
  price: number;
  volume: number;
}
