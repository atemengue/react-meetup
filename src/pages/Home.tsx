import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Bienvenue dans React State Management</h1>
      <p className="subtitle">Explorez différentes approches de gestion d'état dans React</p>

      <div className="modules-grid">
        <div className="module-card">
          <h3>useState</h3>
          <p>Gestion d'état local simple avec un formulaire de contact</p>
          <div className="tag">Débutant</div>
        </div>

        <div className="module-card">
          <h3>useReducer</h3>
          <p>Gestion d'état complexe avec une Todo List complète</p>
          <div className="tag">Intermédiaire</div>
        </div>

        <div className="module-card">
          <h3>Context API</h3>
          <p>Partage d'état global avec un système de thème dark/light</p>
          <div className="tag">Intermédiaire</div>
        </div>

        <div className="module-card">
          <h3>Redux Toolkit</h3>
          <p>Gestion d'état prévisible avec un panier d'achat</p>
          <div className="tag">Avancé</div>
        </div>

        <div className="module-card">
          <h3>Zustand</h3>
          <p>State management simple et léger avec authentification</p>
          <div className="tag">Intermédiaire</div>
        </div>
      </div>

      <div className="info-section">
        <h2>À propos de ce projet</h2>
        <p>
          Ce projet démontre différentes approches de gestion d'état dans React,
          du plus simple au plus complexe. Chaque module présente un cas d'utilisation
          concret et pratique.
        </p>
        <ul>
          <li>Utilisez le menu de navigation pour explorer chaque exemple</li>
          <li>Chaque module est indépendant et fonctionnel</li>
          <li>Le code source est commenté pour faciliter la compréhension</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
