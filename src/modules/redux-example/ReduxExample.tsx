import { useDispatch, useSelector } from 'react-redux';
import './ReduxExample.css';
import { type Product, type RootState, addToCart, clearCart, removeFromCart, updateQuantity } from './store';

// Produits disponibles
const availableProducts: Product[] = [
  { id: 1, name: 'MacBook Pro', price: 2499, image: '💻' },
  { id: 2, name: 'iPhone 15', price: 999, image: '📱' },
  { id: 3, name: 'AirPods Pro', price: 249, image: '🎧' },
  { id: 4, name: 'iPad Air', price: 599, image: '📱' },
  { id: 5, name: 'Apple Watch', price: 399, image: '⌚' },
  { id: 6, name: 'Magic Mouse', price: 79, image: '🖱️' },
];

const ReduxExample = () => {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
  };

  const handleRemoveFromCart = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleClearCart = () => {
    if (window.confirm('Voulez-vous vraiment vider le panier?')) {
      dispatch(clearCart());
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="module-container">
      <h1>Redux Toolkit - Panier d'achat</h1>
      <p className="subtitle">Gestion d'état prévisible et scalable</p>

      <div className="description">
        <h3>Concept</h3>
        <p>
          <strong>Redux Toolkit</strong> simplifie Redux en réduisant le boilerplate.
          Il utilise Immer pour les mises à jour immutables et configure le store automatiquement.
        </p>
        <p>
          Avantages de Redux:
        </p>
        <ul>
          <li>État centralisé et prévisible</li>
          <li>DevTools puissants pour déboguer</li>
          <li>Time-travel debugging</li>
          <li>Excellent pour les grandes applications</li>
          <li>Middleware pour les effets secondaires</li>
        </ul>
      </div>

      <div className="shopping-container">
        <div className="products-section">
          <h2>Produits disponibles</h2>
          <div className="products-grid">
            {availableProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">{product.image}</div>
                <h3>{product.name}</h3>
                <p className="product-price">${product.price}</p>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Ajouter au panier
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-section">
          <div className="cart-header">
            <h2>Panier</h2>
            <span className="item-count">{itemCount} article{itemCount !== 1 ? 's' : ''}</span>
          </div>

          {items.length === 0 ? (
            <div className="empty-cart">
              <p>Votre panier est vide</p>
              <p className="empty-cart-hint">Ajoutez des produits pour commencer</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">{item.image}</div>
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      <p className="cart-item-price">${item.price} × {item.quantity}</p>
                    </div>
                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        Retirer
                      </button>
                    </div>
                    <div className="cart-item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="total-amount">${total.toFixed(2)}</span>
                </div>
                <div className="cart-actions">
                  <button className="clear-cart-btn" onClick={handleClearCart}>
                    Vider le panier
                  </button>
                  <button className="checkout-btn">
                    Procéder au paiement
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="redux-info">
        <h3>Architecture Redux Toolkit</h3>
        <div className="info-grid">
          <div className="info-card">
            <h4>Store</h4>
            <p>État centralisé unique configuré avec configureStore()</p>
          </div>
          <div className="info-card">
            <h4>Slice</h4>
            <p>Combine reducers et actions avec createSlice()</p>
          </div>
          <div className="info-card">
            <h4>Dispatch</h4>
            <p>Envoie les actions au store via useDispatch()</p>
          </div>
          <div className="info-card">
            <h4>Selector</h4>
            <p>Récupère les données du store via useSelector()</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReduxExample;
