import { useTheme } from './ThemeContext';
import './ContextExample.css';

const ContextExample = () => {
  const { theme, toggleTheme, accentColor, setAccentColor } = useTheme();

  const colors = [
    { name: 'Cyan', value: '#61dafb' },
    { name: 'Purple', value: '#9c27b0' },
    { name: 'Green', value: '#4caf50' },
    { name: 'Orange', value: '#ff9800' },
    { name: 'Pink', value: '#e91e63' },
  ];

  return (
    <div className={`module-container theme-${theme}`}>
      <h1>Context API - Gestion de Thème</h1>
      <p className="subtitle">Partage d'état global sans prop drilling</p>

      <div className="description">
        <h3>Concept</h3>
        <p>
          <strong>Context API</strong> permet de partager des données entre composants sans passer
          les props manuellement à chaque niveau (prop drilling).
        </p>
        <p>
          Idéal pour :
        </p>
        <ul>
          <li>Thèmes (dark/light mode)</li>
          <li>Préférences utilisateur</li>
          <li>Langues/i18n</li>
          <li>Authentification (données utilisateur)</li>
        </ul>
      </div>

      <div className="theme-controls">
        <div className="control-section">
          <h3>Mode d'affichage</h3>
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === 'light' ? '🌙 Passer en mode sombre' : '☀️ Passer en mode clair'}
          </button>
          <p className="current-theme">Thème actuel: <strong>{theme}</strong></p>
        </div>

        <div className="control-section">
          <h3>Couleur d'accent</h3>
          <div className="color-picker">
            {colors.map((color) => (
              <button
                key={color.value}
                className={`color-btn ${accentColor === color.value ? 'selected' : ''}`}
                style={{ backgroundColor: color.value }}
                onClick={() => setAccentColor(color.value)}
                title={color.name}
              >
                {accentColor === color.value && '✓'}
              </button>
            ))}
          </div>
          <p className="current-color">Couleur sélectionnée: <strong>{accentColor}</strong></p>
        </div>
      </div>

      <div className="demo-section">
        <h3>Composants utilisant le contexte</h3>
        <div className="demo-components">
          <ThemedCard />
          <ThemedCard />
          <ThemedCard />
        </div>
      </div>

      <div className="code-explanation">
        <h3>Comment ça marche?</h3>
        <ol>
          <li>
            <strong>Créer le Context:</strong> Définir le contexte avec <code>createContext()</code>
          </li>
          <li>
            <strong>Provider:</strong> Envelopper l'app avec le Provider qui fournit les valeurs
          </li>
          <li>
            <strong>Consumer:</strong> Utiliser <code>useContext()</code> dans les composants enfants
          </li>
        </ol>
        <p>
          Tous les composants enfants du Provider ont accès aux valeurs du contexte,
          peu importe leur profondeur dans l'arbre des composants.
        </p>
      </div>
    </div>
  );
};

// Composant qui consomme le contexte
const ThemedCard = () => {
  const { theme, accentColor } = useTheme();

  return (
    <div className="themed-card" style={{ borderColor: accentColor }}>
      <h4 style={{ color: accentColor }}>Carte thématisée</h4>
      <p>Mode: {theme}</p>
      <p>Cette carte utilise automatiquement le thème et la couleur du contexte.</p>
      <button className="card-btn" style={{ backgroundColor: accentColor }}>
        Action
      </button>
    </div>
  );
};

export default ContextExample;
