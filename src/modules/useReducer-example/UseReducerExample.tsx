import { useReducer, useState } from 'react';
import './UseReducerExample.css';

// Types
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface State {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
}

type Action =
  | { type: 'ADD_TODO'; payload: { text: string; priority: 'low' | 'medium' | 'high' } }
  | { type: 'TOGGLE_TODO'; payload: number }
  | { type: 'DELETE_TODO'; payload: number }
  | { type: 'SET_FILTER'; payload: 'all' | 'active' | 'completed' }
  | { type: 'CLEAR_COMPLETED' };

// État initial
const initialState: State = {
  todos: [
    { id: 1, text: 'Apprendre useState', completed: true, priority: 'high' },
    { id: 2, text: 'Maîtriser useReducer', completed: false, priority: 'high' },
    { id: 3, text: 'Explorer Context API', completed: false, priority: 'medium' },
  ],
  filter: 'all',
};

// Reducer
function todoReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload.text,
            completed: false,
            priority: action.payload.priority,
          },
        ],
      };

    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        ),
      };

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };

    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload,
      };

    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter((todo) => !todo.completed),
      };

    default:
      return state;
  }
}

const UseReducerExample = () => {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      dispatch({ type: 'ADD_TODO', payload: { text: inputValue, priority } });
      setInputValue('');
      setPriority('medium');
    }
  };

  // Filtrer les todos
  const filteredTodos = state.todos.filter((todo) => {
    if (state.filter === 'active') return !todo.completed;
    if (state.filter === 'completed') return todo.completed;
    return true;
  });

  const stats = {
    total: state.todos.length,
    active: state.todos.filter((t) => !t.completed).length,
    completed: state.todos.filter((t) => t.completed).length,
  };

  return (
    <div className="module-container">
      <h1>useReducer - Todo List</h1>
      <p className="subtitle">Gestion d'état complexe avec actions multiples</p>

      <div className="description">
        <h3>Concept</h3>
        <p>
          <strong>useReducer</strong> est idéal pour gérer un état complexe avec plusieurs actions.
          Il suit le pattern Redux et rend le code plus prévisible.
        </p>
        <p>
          Avantages par rapport à useState:
        </p>
        <ul>
          <li>Logique de mise à jour centralisée dans le reducer</li>
          <li>Transitions d'état plus prévisibles</li>
          <li>Facilite les tests unitaires</li>
          <li>Mieux pour les états avec plusieurs sous-valeurs</li>
        </ul>
      </div>

      <div className="todo-container">
        <form onSubmit={handleSubmit} className="todo-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Nouvelle tâche..."
            className="todo-input"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="priority-select"
          >
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
          <button type="submit" className="add-btn">
            Ajouter
          </button>
        </form>

        <div className="stats">
          <span>Total: {stats.total}</span>
          <span>Actives: {stats.active}</span>
          <span>Complétées: {stats.completed}</span>
        </div>

        <div className="filters">
          <button
            className={state.filter === 'all' ? 'active' : ''}
            onClick={() => dispatch({ type: 'SET_FILTER', payload: 'all' })}
          >
            Toutes
          </button>
          <button
            className={state.filter === 'active' ? 'active' : ''}
            onClick={() => dispatch({ type: 'SET_FILTER', payload: 'active' })}
          >
            Actives
          </button>
          <button
            className={state.filter === 'completed' ? 'active' : ''}
            onClick={() => dispatch({ type: 'SET_FILTER', payload: 'completed' })}
          >
            Complétées
          </button>
          <button
            className="clear-btn"
            onClick={() => dispatch({ type: 'CLEAR_COMPLETED' })}
          >
            Effacer complétées
          </button>
        </div>

        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
              />
              <span className="todo-text">{todo.text}</span>
              <span className={`priority-badge ${todo.priority}`}>{todo.priority}</span>
              <button
                className="delete-btn"
                onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>

        {filteredTodos.length === 0 && (
          <p className="empty-message">Aucune tâche à afficher</p>
        )}
      </div>
    </div>
  );
};

export default UseReducerExample;
