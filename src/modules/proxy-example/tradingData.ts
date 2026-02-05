import type { StockData } from './types';

export const INITIAL_STOCKS: Record<string, StockData> = {
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 178.5,
    previousPrice: 176.2,
    volume: 52_340_000,
    high: 180.1,
    low: 175.8,
    change: 2.3,
    changePercent: 1.31,
    lastUpdated: Date.now(),
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 141.8,
    previousPrice: 140.5,
    volume: 28_120_000,
    high: 143.2,
    low: 139.9,
    change: 1.3,
    changePercent: 0.93,
    lastUpdated: Date.now(),
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 378.9,
    previousPrice: 375.6,
    volume: 31_560_000,
    high: 381.4,
    low: 374.2,
    change: 3.3,
    changePercent: 0.88,
    lastUpdated: Date.now(),
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.2,
    previousPrice: 252.1,
    volume: 89_450_000,
    high: 254.3,
    low: 245.6,
    change: -3.9,
    changePercent: -1.55,
    lastUpdated: Date.now(),
  },
  AMZN: {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 185.6,
    previousPrice: 183.4,
    volume: 45_780_000,
    high: 187.2,
    low: 182.1,
    change: 2.2,
    changePercent: 1.2,
    lastUpdated: Date.now(),
  },
};

export function simulatePriceChange(currentPrice: number): number {
  const changePercent = (Math.random() - 0.48) * 4;
  const change = currentPrice * (changePercent / 100);
  return Math.round((currentPrice + change) * 100) / 100;
}

export function generateStockUpdate(stock: StockData): Partial<StockData> {
  const newPrice = simulatePriceChange(stock.price);
  const change = Math.round((newPrice - stock.previousPrice) * 100) / 100;
  const changePercent =
    Math.round((change / stock.previousPrice) * 10000) / 100;
  const volumeChange = Math.floor((Math.random() - 0.3) * 500_000);

  return {
    price: newPrice,
    change,
    changePercent,
    volume: Math.max(0, stock.volume + volumeChange),
    high: Math.max(stock.high, newPrice),
    low: Math.min(stock.low, newPrice),
    lastUpdated: Date.now(),
  };
}
