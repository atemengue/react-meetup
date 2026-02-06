import { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import {
  tradingState, priceHistory, startSimulation, stopSimulation,
  isSimulating, selectStock, resetState, analytics, getMutations, getMutationRate,
} from './tradingStore';
import { RenderTracker } from './components/RenderTracker';
import { CodePanel } from './components/CodePanel';
import { AtomicStatusBar } from './components/AtomicStatusBar';
import { SplitLayout } from './components/SplitLayout';
import './ProxyExample.css';

function formatVolume(vol: number): string {
  if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(1)}M`;
  if (vol >= 1_000) return `${(vol / 1_000).toFixed(0)}K`;
  return String(vol);
}

function formatTime(ts: unknown): string {
  return new Date(Number(ts)).toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

function formatValue(value: unknown): string {
  if (value === undefined || value === null) return '—';
  if (typeof value === 'number') return value.toFixed(2);
  return String(value).slice(0, 30);
}

// --- Sous-composant Rendu (trading dashboard) ---

function TradingDashboard() {
  const snap = useSnapshot(tradingState);
  const historySnap = useSnapshot(priceHistory);
  const [simulating, setSimulating] = useState(isSimulating());
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => forceUpdate((n) => n + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  const selectedHistory = (historySnap[snap.selectedStock] ?? []).map((p) => ({
    timestamp: p.timestamp, price: p.price, volume: p.volume,
  }));
  const mutations = getMutations();

  return (
    <div className="trading-dashboard">
      {/* Controles */}
      <div className="trading-controls">
        <div className="controls-left">
          <button
            className={`ctrl-btn ${simulating ? 'active' : ''}`}
            onClick={() => { startSimulation(); setSimulating(true); }}
            disabled={simulating}
          >
            Demarrer
          </button>
          <button
            className="ctrl-btn stop"
            onClick={() => { stopSimulation(); setSimulating(false); }}
            disabled={!simulating}
          >
            Arreter
          </button>
          <button className="ctrl-btn reset" onClick={() => { resetState(); setSimulating(false); }}>
            Reset
          </button>
        </div>
        <div className="market-status">
          <span className={`status-badge ${snap.marketStatus}`}>{snap.marketStatus.toUpperCase()}</span>
          <span className="stat">{analytics.getCount()} mut.</span>
          <span className="stat">{getMutationRate()}/s</span>
        </div>
      </div>

      {/* Stocks Grid avec RenderTracker */}
      <div className="stocks-grid">
        {Object.values(snap.stocks).map((stock: { symbol: string; name: string; price: number; changePercent: number; volume: number }) => (
          <RenderTracker key={stock.symbol} name={stock.symbol}>
            <div
              className={`stock-card ${stock.changePercent >= 0 ? 'positive' : 'negative'} ${snap.selectedStock === stock.symbol ? 'selected' : ''}`}
              onClick={() => selectStock(stock.symbol)}
            >
              <div className="stock-symbol">{stock.symbol}</div>
              <div className="stock-name">{stock.name}</div>
              <div className="stock-price">${stock.price.toFixed(2)}</div>
              <div className={`stock-change ${stock.changePercent >= 0 ? 'positive' : 'negative'}`}>
                {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </div>
              <div className="stock-volume">Vol: {formatVolume(stock.volume)}</div>
            </div>
          </RenderTracker>
        ))}
      </div>

      {/* Courbe de prix */}
      <RenderTracker name="Chart">
        <div className="chart-section">
          <h3>
            Courbe — {snap.selectedStock}
            {selectedHistory.length > 0 && (
              <span className="chart-points"> ({selectedHistory.length} pts)</span>
            )}
          </h3>
          {selectedHistory.length > 1 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={selectedHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="timestamp" tickFormatter={formatTime} stroke="#999" fontSize={11} />
                  <YAxis domain={['auto', 'auto']} stroke="#999" fontSize={11} />
                  <Tooltip labelFormatter={formatTime} contentStyle={{ background: '#282c34', border: 'none', borderRadius: '6px', color: '#fff' }} />
                  <Line type="monotone" dataKey="price" stroke="#61dafb" dot={false} strokeWidth={2} animationDuration={300} />
                </LineChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={selectedHistory}>
                  <XAxis dataKey="timestamp" tickFormatter={formatTime} stroke="#999" fontSize={10} />
                  <YAxis stroke="#999" fontSize={10} />
                  <Bar dataKey="volume" fill="#82ca9d" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </>
          ) : (
            <div className="chart-placeholder">Demarrez la simulation pour voir la courbe</div>
          )}
        </div>
      </RenderTracker>

      {/* Mutations log */}
      <RenderTracker name="Analytics">
        <div className="analytics-section">
          <h3>Mutations ({analytics.getCount()})</h3>
          {mutations.length > 0 ? (
            <div className="mutations-table">
              <table>
                <thead>
                  <tr><th>Heure</th><th>Propriete</th><th>Ancien</th><th>Nouveau</th><th>Act.</th></tr>
                </thead>
                <tbody>
                  {mutations.slice(-15).reverse().map((mut) => (
                    <tr key={mut.id}>
                      <td>{formatTime(mut.timestamp)}</td>
                      <td><code>{mut.property}</code></td>
                      <td>{formatValue(mut.oldValue)}</td>
                      <td>{formatValue(mut.newValue)}</td>
                      <td className="action-badge">{mut.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-analytics">Aucune mutation. Demarrez la simulation.</p>
          )}
        </div>
      </RenderTracker>
    </div>
  );
}

// --- Composant principal ---

const ProxyExample = () => {
  return (
    <div className="module-container proxy-module">
      <h1>Proxy State - Trading Dashboard</h1>
      <p className="subtitle">Valtio (Proxy) + Jotai (Atomic) + Recharts (Courbes)</p>

      <div className="description">
        <h3>Concept</h3>
        <p>
          <strong>Valtio</strong> utilise le <code>Proxy</code> natif pour rendre un objet reactif.
          <strong> Jotai</strong> gere l'etat atomique — chaque piece de donnee est un atome independant.
          Ensemble, ils permettent un rendu granulaire optimal pour les applications critiques.
        </p>
        <ul>
          <li><strong>Proxy Wrapper</strong> — <code>proxy()</code> de Valtio intercepte chaque mutation</li>
          <li><strong>Proxy Handler</strong> — Traps <code>get/set/delete</code> internes automatiques</li>
          <li><strong>Observateurs</strong> — <code>subscribe()</code> + ObserverManager custom</li>
          <li><strong>Jotai Atoms</strong> — Etat atomique derive avec <code>atom()</code></li>
          <li><strong>Persistance</strong> — localStorage via subscribe avec debounce</li>
          <li><strong>Analytics</strong> — Tracking de chaque mutation en temps reel</li>
        </ul>
      </div>

      <SplitLayout
        statusBar={<AtomicStatusBar />}
        tabs={[
          { id: 'render', label: 'Rendu', content: <TradingDashboard /> },
          { id: 'code', label: 'Code', content: <CodePanel /> },
        ]}
      />

      {/* Architecture info */}
      <div className="proxy-info">
        <h3>Architecture Valtio + Jotai</h3>
        <div className="architecture-grid">
          <div className="arch-card">
            <h4>Proxy Wrapper</h4>
            <p><code>proxy()</code> cree l'objet reactif. Mutations directes interceptees par le handler interne.</p>
          </div>
          <div className="arch-card">
            <h4>Proxy Handler</h4>
            <p>Traps <code>get/set/delete</code> detectent chaque operation. Deep proxy automatique pour les objets imbriques.</p>
          </div>
          <div className="arch-card">
            <h4>Jotai Atoms</h4>
            <p><code>atom()</code> cree des unites d'etat atomiques. Les derives (<code>atom(get =&gt; ...)</code>) se recalculent automatiquement.</p>
          </div>
          <div className="arch-card">
            <h4>Observateurs</h4>
            <p><code>subscribe()</code> de Valtio + ObserverManager. Bridge Valtio → Jotai via <code>useEffect</code>.</p>
          </div>
          <div className="arch-card">
            <h4>Persistance</h4>
            <p>Sauvegarde debounced (500ms) dans localStorage. Restauration automatique au demarrage.</p>
          </div>
          <div className="arch-card">
            <h4>RenderTracker</h4>
            <p>Visualise en temps reel quels composants se re-rendent et a quelle frequence.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProxyExample;
