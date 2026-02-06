import { atom, useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { subscribe } from 'valtio';
import { tradingState, analytics, getMutationRate } from '../tradingStore';
import type { StockData } from '../types';

// ====================================================
// JOTAI ATOMS — Chaque stock est un atome independant
// Les composants ne re-rendent QUE si leur atome change
// ====================================================

interface AtomStatus {
  symbol: string;
  price: number;
  changed: boolean;
}

// Atome primitif : statuts de chaque stock
const atomStatusesAtom = atom<AtomStatus[]>([]);

// Atome primitif : compteur de renders
const renderCountAtom = atom(0);

// Atome derive (read-only) : nombre total de mutations
const mutationCountAtom = atom((get) => {
  get(renderCountAtom); // force le re-calcul quand renderCount change
  return analytics.getCount();
});

// Atome derive (read-only) : taux de mutations/sec
const mutationRateAtom = atom((get) => {
  get(renderCountAtom);
  return getMutationRate();
});

// ====================================================
// HOOK : Synchronise Valtio → Jotai
// Bridge entre le proxy state et les atoms
// ====================================================

function useValtioToJotaiSync() {
  const [, setStatuses] = useAtom(atomStatusesAtom);
  const [, setRenderCount] = useAtom(renderCountAtom);

  useEffect(() => {
    const prevPrices: Record<string, number> = {};

    // Initialiser les prix precedents
    for (const [symbol, stock] of Object.entries(tradingState.stocks)) {
      prevPrices[symbol] = (stock as StockData).price;
    }

    const unsub = subscribe(tradingState, () => {
      const newStatuses: AtomStatus[] = [];

      for (const [symbol, stock] of Object.entries(tradingState.stocks)) {
        const s = stock as StockData;
        const changed = prevPrices[symbol] !== s.price;
        newStatuses.push({ symbol, price: s.price, changed });
        prevPrices[symbol] = s.price;
      }

      setStatuses(newStatuses);
      setRenderCount((n) => n + 1);
    });

    return unsub;
  }, [setStatuses, setRenderCount]);
}

// ====================================================
// COMPOSANT : AtomicStatusBar
// ====================================================

export function AtomicStatusBar() {
  useValtioToJotaiSync();

  const atomStatuses = useAtomValue(atomStatusesAtom);
  const renderCount = useAtomValue(renderCountAtom);
  const totalMutations = useAtomValue(mutationCountAtom);
  const mutationRate = useAtomValue(mutationRateAtom);

  return (
    <div className="atomic-status-bar">
      <div className="atoms-row">
        {atomStatuses.map((a) => (
          <div
            key={a.symbol}
            className={`atom-indicator ${a.changed ? 'changed' : 'stable'}`}
          >
            <span className={`atom-dot ${a.changed ? 'pulse' : ''}`} />
            <span className="atom-symbol">{a.symbol}</span>
            <span className="atom-price">${a.price.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="atoms-stats">
        <span className="atoms-stat">
          Renders: <strong>{renderCount}</strong>
        </span>
        <span className="atoms-stat">
          Mutations: <strong>{totalMutations}</strong>
        </span>
        <span className="atoms-stat">
          Rate: <strong>{mutationRate}/s</strong>
        </span>
        <span className="atoms-legend">
          <span className="atom-dot changed-dot" /> modifie
          <span className="atom-dot stable-dot" /> stable
        </span>
      </div>
    </div>
  );
}
