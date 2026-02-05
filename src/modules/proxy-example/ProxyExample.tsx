import { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  tradingState,
  priceHistory,
  startSimulation,
  stopSimulation,
  isSimulating,
  selectStock,
  resetState,
  analytics,
  getMutations,
  getMutationRate,
} from './tradingStore';
import './ProxyExample.css';

// --- Helpers ---

function formatVolume(vol: number): string {
  if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(1)}M`;
  if (vol >= 1_000) return `${(vol / 1_000).toFixed(0)}K`;
  return String(vol);
}

function formatTime(ts: unknown): string {
  return new Date(Number(ts)).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatValue(value: unknown): string {
  if (value === undefined || value === null) return '—';
  if (typeof value === 'number') return value.toFixed(2);
  return String(value).slice(0, 30);
}

// --- Composant principal ---

const ProxyExample = () => {
  const snap = useSnapshot(tradingState);
  const historySnap = useSnapshot(priceHistory);
  const [simulating, setSimulating] = useState(isSimulating());
  const [, forceUpdate] = useState(0);

  // Actualiser les analytics dans le rendu
  useEffect(() => {
    const interval = setInterval(() => forceUpdate((n) => n + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    startSimulation();
    setSimulating(true);
  };

  const handleStop = () => {
    stopSimulation();
    setSimulating(false);
  };

  const handleReset = () => {
    resetState();
    setSimulating(false);
  };

  // Deep-clone le snapshot pour Recharts (les snapshots Valtio sont frozen,
  // ce qui cause "get on proxy: property '0' is read-only" avec les librairies de charts)
  const selectedHistory = (historySnap[snap.selectedStock] ?? []).map((p) => ({
    timestamp: p.timestamp,
    price: p.price,
    volume: p.volume,
  }));
  const mutations = getMutations();

  return (
    <div className="module-container">
      <h1>Proxy State - Trading Dashboard</h1>
      <p className="subtitle">
        Gestion d'etat reactive avec Valtio (JavaScript Proxy)
      </p>

      {/* --- DESCRIPTION --- */}
      <div className="description">
        <h3>Concept</h3>
        <p>
          <strong>Valtio</strong> utilise le <code>Proxy</code> natif de
          JavaScript pour rendre un objet reactif. Toute mutation directe de
          l'objet declenche automatiquement le re-rendu des composants abonnes.
        </p>
        <p>Architecture de cet exemple :</p>
        <ul>
          <li>
            <strong>Proxy Wrapper</strong> — <code>proxy()</code> de Valtio cree
            un objet reactif intercepte par un ProxyHandler interne
          </li>
          <li>
            <strong>Proxy Handler</strong> — Traps <code>get/set/delete</code>{' '}
            internes qui detectent chaque lecture et mutation
          </li>
          <li>
            <strong>Observateurs</strong> — <code>subscribe()</code> +
            ObserverManager custom pour reagir aux changements
          </li>
          <li>
            <strong>Persistance</strong> — Sauvegarde automatique dans
            localStorage via subscribe
          </li>
          <li>
            <strong>Analytics</strong> — Chaque mutation est enregistree avec
            horodatage pour le debugging
          </li>
        </ul>
      </div>

      {/* --- CONTROLES --- */}
      <div className="trading-controls">
        <div className="controls-left">
          <button
            className={`ctrl-btn ${simulating ? 'active' : ''}`}
            onClick={handleStart}
            disabled={simulating}
          >
            Demarrer la simulation
          </button>
          <button
            className="ctrl-btn stop"
            onClick={handleStop}
            disabled={!simulating}
          >
            Arreter
          </button>
          <button className="ctrl-btn reset" onClick={handleReset}>
            Reinitialiser
          </button>
        </div>
        <div className="market-status">
          <span className={`status-badge ${snap.marketStatus}`}>
            {snap.marketStatus.toUpperCase()}
          </span>
          <span className="stat">
            {analytics.getCount()} mutations
          </span>
          <span className="stat">{getMutationRate()}/sec</span>
        </div>
      </div>

      {/* --- GRILLE DES STOCKS --- */}
      <div className="stocks-grid">
        {Object.values(snap.stocks).map((stock: { symbol: string; name: string; price: number; changePercent: number; volume: number }) => (
          <div
            key={stock.symbol}
            className={`stock-card ${stock.changePercent >= 0 ? 'positive' : 'negative'} ${snap.selectedStock === stock.symbol ? 'selected' : ''}`}
            onClick={() => selectStock(stock.symbol)}
          >
            <div className="stock-symbol">{stock.symbol}</div>
            <div className="stock-name">{stock.name}</div>
            <div className="stock-price">${stock.price.toFixed(2)}</div>
            <div
              className={`stock-change ${stock.changePercent >= 0 ? 'positive' : 'negative'}`}
            >
              {stock.changePercent >= 0 ? '+' : ''}
              {stock.changePercent.toFixed(2)}%
            </div>
            <div className="stock-volume">
              Vol: {formatVolume(stock.volume)}
            </div>
          </div>
        ))}
      </div>

      {/* --- COURBE DE PRIX --- */}
      <div className="chart-section">
        <h3>
          Courbe de prix — {snap.selectedStock}
          {selectedHistory.length > 0 && (
            <span className="chart-points">
              {' '}
              ({selectedHistory.length} points)
            </span>
          )}
        </h3>
        {selectedHistory.length > 1 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={selectedHistory as { timestamp: number; price: number; volume: number }[]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatTime}
                  stroke="#999"
                  fontSize={12}
                />
                <YAxis domain={['auto', 'auto']} stroke="#999" fontSize={12} />
                <Tooltip
                  labelFormatter={formatTime}
                  contentStyle={{
                    background: '#282c34',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#61dafb"
                  dot={false}
                  strokeWidth={2}
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>

            <h4 className="volume-title">Volume</h4>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={selectedHistory as { timestamp: number; price: number; volume: number }[]}>
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatTime}
                  stroke="#999"
                  fontSize={11}
                />
                <YAxis stroke="#999" fontSize={11} />
                <Tooltip
                  labelFormatter={formatTime}
                  contentStyle={{
                    background: '#282c34',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="volume" fill="#82ca9d" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </>
        ) : (
          <div className="chart-placeholder">
            Demarrez la simulation pour voir la courbe en temps reel
          </div>
        )}
      </div>

      {/* --- JOURNAL DES MUTATIONS (ANALYTICS) --- */}
      <div className="analytics-section">
        <h3>Journal des mutations ({analytics.getCount()} enregistrees)</h3>
        {mutations.length > 0 ? (
          <div className="mutations-table">
            <table>
              <thead>
                <tr>
                  <th>Horodatage</th>
                  <th>Propriete</th>
                  <th>Ancienne valeur</th>
                  <th>Nouvelle valeur</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {mutations
                  .slice(-20)
                  .reverse()
                  .map((mut) => (
                    <tr key={mut.id}>
                      <td>{formatTime(mut.timestamp)}</td>
                      <td>
                        <code>{mut.property}</code>
                      </td>
                      <td>{formatValue(mut.oldValue)}</td>
                      <td>{formatValue(mut.newValue)}</td>
                      <td className="action-badge">{mut.action}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-analytics">
            Aucune mutation enregistree. Demarrez la simulation.
          </p>
        )}
      </div>

      {/* --- ARCHITECTURE INFO --- */}
      <div className="proxy-info">
        <h3>Architecture Valtio / Proxy State</h3>
        <div className="architecture-grid">
          <div className="arch-card">
            <h4>Proxy Wrapper</h4>
            <p>
              <code>proxy()</code> de Valtio cree un objet reactif. Toute
              mutation directe (<code>state.x = y</code>) est interceptee par le
              ProxyHandler interne.
            </p>
          </div>
          <div className="arch-card">
            <h4>Proxy Handler</h4>
            <p>
              En interne, Valtio utilise un <code>ProxyHandler</code> avec les
              traps <code>get</code>, <code>set</code> et{' '}
              <code>deleteProperty</code> pour detecter chaque operation.
            </p>
          </div>
          <div className="arch-card">
            <h4>Observateurs</h4>
            <p>
              <code>subscribe()</code> ecoute les mutations du proxy.{' '}
              <code>useSnapshot()</code> cree un snapshot immutable pour React.
              ObserverManager ajoute un layer pub/sub custom.
            </p>
          </div>
          <div className="arch-card">
            <h4>Persistance</h4>
            <p>
              Un <code>subscribe()</code> sauvegarde automatiquement l'etat dans
              localStorage avec un debounce de 500ms pour les performances.
            </p>
          </div>
          <div className="arch-card">
            <h4>Analytics</h4>
            <p>
              Chaque mutation est enregistree avec horodatage, ancienne et
              nouvelle valeur. Taux de mutations/sec calcule en temps reel.
            </p>
          </div>
          <div className="arch-card">
            <h4>Courbes temps reel</h4>
            <p>
              Recharts visualise l'historique de prix. Les donnees sont mises a
              jour automatiquement via le proxy reactif.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProxyExample;
