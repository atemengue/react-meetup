import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

// Mock users pour la démo
const mockUsers: User[] = [
  {
    id: 1,
    name: 'Jean Dupont',
    email: 'jean@example.com',
    role: 'admin',
    avatar: '👨‍💼',
  },
  {
    id: 2,
    name: 'Marie Martin',
    email: 'marie@example.com',
    role: 'user',
    avatar: '👩‍💻',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        // Simulation d'un appel API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const user = mockUsers.find((u) => u.email === email);

        if (user && password === 'password') {
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({ isLoading: false });
          throw new Error('Email ou mot de passe incorrect');
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      updateProfile: (data: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },
    }),
    {
      name: 'auth-storage', // nom de la clé dans localStorage
    }
  )
);
