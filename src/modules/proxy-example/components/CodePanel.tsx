import { useState } from 'react';

interface CodeBlock {
  id: string;
  title: string;
  code: string;
  highlights?: number[];
  description: string;
}

const CODE_BLOCKS: CodeBlock[] = [
  {
    id: 'proxy-wrapper',
    title: 'Proxy Wrapper',
    code: `import { proxy, subscribe } from 'valtio';

// proxy() cree un objet reactif
// Chaque mutation directe est interceptee
export const tradingState = proxy({
  stocks: { ...INITIAL_STOCKS },
  marketStatus: 'open',
  selectedStock: 'AAPL',
});

// Mutation directe → traps set
tradingState.stocks.AAPL.price = 182.30;`,
    highlights: [4, 5, 6, 11],
    description: "proxy() enveloppe l'objet dans un Proxy JS. Toute ecriture passe par le trap set.",
  },
  {
    id: 'subscribe',
    title: 'Observateurs',
    code: `// subscribe() ecoute les mutations
subscribe(tradingState, () => {
  // Persister dans localStorage
  persistence.save(
    JSON.parse(JSON.stringify(tradingState))
  );
});

// Observer custom avec filtre
observers.subscribe(
  (prop, newVal) => {
    console.log(prop, newVal);
  },
  'stocks.AAPL'
);`,
    highlights: [2, 10, 11],
    description: 'subscribe() de Valtio + ObserverManager custom pour reagir aux mutations.',
  },
  {
    id: 'jotai',
    title: 'Jotai Atoms',
    code: `import { atom, useAtomValue } from 'jotai';

// Atome primitif
const statusAtom = atom<AtomStatus[]>([]);

// Atome derive (read-only)
const mutationCountAtom = atom((get) => {
  get(renderCountAtom);
  return analytics.getCount();
});

// Lecture reactive dans le composant
const count = useAtomValue(mutationCountAtom);`,
    highlights: [4, 7, 8, 13],
    description: 'Jotai: chaque piece d\'etat est un atome. Les derives se recalculent automatiquement.',
  },
  {
    id: 'snapshot',
    title: 'useSnapshot',
    code: `import { useSnapshot } from 'valtio';

const Component = () => {
  // Snapshot = version frozen
  const snap = useSnapshot(tradingState);

  // Re-render SEULEMENT si les
  // proprietes lues changent
  return <div>{snap.stocks.AAPL.price}</div>;
  // → AAPL change = re-render
  // → MSFT change = PAS de re-render
};`,
    highlights: [5, 9],
    description: 'useSnapshot() cree un snapshot immutable. Rendu granulaire automatique.',
  },
  {
    id: 'persistence',
    title: 'Persistance',
    code: `class PersistenceManager {
  save(state) {
    // Debounce 500ms
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      localStorage.setItem(
        this.key,
        JSON.stringify(state)
      );
    }, 500);
  }

  load() {
    return JSON.parse(
      localStorage.getItem(this.key)
    );
  }
}`,
    highlights: [5, 6, 7, 8],
    description: 'Sauvegarde debounced dans localStorage. Restauration auto au chargement.',
  },
];

export function CodePanel() {
  const [activeBlock, setActiveBlock] = useState(CODE_BLOCKS[0].id);
  const block = CODE_BLOCKS.find((b) => b.id === activeBlock) ?? CODE_BLOCKS[0];

  return (
    <div className="code-panel">
      <div className="code-tabs">
        {CODE_BLOCKS.map((b) => (
          <button
            key={b.id}
            className={`code-tab ${activeBlock === b.id ? 'active' : ''}`}
            onClick={() => setActiveBlock(b.id)}
          >
            {b.title}
          </button>
        ))}
      </div>
      <div className="code-description">{block.description}</div>
      <div className="code-block">
        <pre>
          <code>
            {block.code.split('\n').map((line, i) => (
              <div
                key={i}
                className={`code-line ${block.highlights?.includes(i + 1) ? 'highlight' : ''}`}
              >
                <span className="line-number">{i + 1}</span>
                <span className="line-content">{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
