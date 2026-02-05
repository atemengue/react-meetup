import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Accueil' },
    { path: '/usestate', label: 'useState - Formulaire' },
    { path: '/usereducer', label: 'useReducer - Todo List' },
    { path: '/context', label: 'Context API - Thème' },
    { path: '/redux', label: 'Redux - Panier' },
    { path: '/zustand', label: 'Zustand - Auth' },
    { path: '/proxy', label: 'Proxy State - Trading' },
  ];

  return (
    <nav className="navigation">
      <h2>React State Management</h2>
      <ul>
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
