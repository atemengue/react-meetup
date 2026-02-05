import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuthStore } from './authStore';
import './ZustandExample.css';

const ZustandExample = () => {
  const { user, isAuthenticated, isLoading, login, logout, updateProfile } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleLogout = () => {
    logout();
    setError('');
  };

  const handleUpdateProfile = (e: FormEvent) => {
    e.preventDefault();
    if (editName.trim()) {
      updateProfile({ name: editName });
      setEditMode(false);
    }
  };

  const startEdit = () => {
    setEditName(user?.name || '');
    setEditMode(true);
  };

  return (
    <div className="module-container">
      <h1>Zustand - Authentification</h1>
      <p className="subtitle">State management simple et performant</p>

      <div className="description">
        <h3>Concept</h3>
        <p>
          <strong>Zustand</strong> est une bibliothèque de gestion d'état minimaliste et rapide.
          Elle utilise les hooks et ne nécessite pas de Provider.
        </p>
        <p>
          Avantages de Zustand:
        </p>
        <ul>
          <li>API simple et intuitive</li>
          <li>Petite taille (1kb gzippé)</li>
          <li>Pas besoin de Provider</li>
          <li>Support des middlewares (persist, devtools, etc.)</li>
          <li>Excellentes performances</li>
        </ul>
      </div>

      <div className="auth-container">
        {!isAuthenticated ? (
          <div className="login-section">
            <h2>Connexion</h2>
            <div className="demo-credentials">
              <h4>Comptes de démo:</h4>
              <div className="credential-list">
                <div className="credential-item">
                  <strong>Admin:</strong>
                  <span>jean@example.com</span>
                  <span className="password-hint">(password: password)</span>
                </div>
                <div className="credential-item">
                  <strong>User:</strong>
                  <span>marie@example.com</span>
                  <span className="password-hint">(password: password)</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              {error && <div className="error-banner">{error}</div>}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <button type="submit" className="login-btn" disabled={isLoading}>
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          </div>
        ) : (
          <div className="profile-section">
            <h2>Profil utilisateur</h2>

            <div className="user-card">
              <div className="user-avatar">{user?.avatar}</div>
              <div className="user-info">
                {editMode ? (
                  <form onSubmit={handleUpdateProfile} className="edit-form">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button type="submit" className="save-btn">Sauvegarder</button>
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => setEditMode(false)}
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3>{user?.name}</h3>
                    <p className="user-email">{user?.email}</p>
                    <span className={`role-badge ${user?.role}`}>{user?.role}</span>
                  </>
                )}
              </div>
            </div>

            <div className="user-details">
              <h4>Informations du compte</h4>
              <div className="detail-item">
                <span className="detail-label">ID:</span>
                <span className="detail-value">{user?.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{user?.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Rôle:</span>
                <span className="detail-value">{user?.role}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Statut:</span>
                <span className="detail-value status-active">Actif</span>
              </div>
            </div>

            <div className="profile-actions">
              {!editMode && (
                <button className="edit-profile-btn" onClick={startEdit}>
                  Modifier le profil
                </button>
              )}
              <button className="logout-btn" onClick={handleLogout}>
                Se déconnecter
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="zustand-info">
        <h3>Caractéristiques de Zustand</h3>
        <div className="features-grid">
          <div className="feature-card">
            <h4>🚀 Simple</h4>
            <p>API minimaliste avec create() et hooks</p>
          </div>
          <div className="feature-card">
            <h4>⚡ Rapide</h4>
            <p>Optimisé pour les performances</p>
          </div>
          <div className="feature-card">
            <h4>💾 Persist</h4>
            <p>Middleware pour sauvegarder dans localStorage</p>
          </div>
          <div className="feature-card">
            <h4>🔧 Flexible</h4>
            <p>Pas de Provider, utilisable partout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZustandExample;
