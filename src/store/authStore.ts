import {create} from 'zustand';
import {User} from '../types/user';
import {authService} from '../services/supabase/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: 'customer' | 'driver',
  ) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: user =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  signIn: async (email, password) => {
    set({isLoading: true});
    try {
      const {user, error} = await authService.signIn(email, password);
      if (error) throw error;
      set({user, isAuthenticated: !!user, isLoading: false});
    } catch (error) {
      set({isLoading: false});
      throw error;
    }
  },

  signUp: async (email, password, fullName, role) => {
    set({isLoading: true});
    try {
      const {user, error} = await authService.signUp(email, password, fullName, role);
      if (error) throw error;
      set({user, isAuthenticated: !!user, isLoading: false});
    } catch (error) {
      set({isLoading: false});
      throw error;
    }
  },

  signOut: async () => {
    set({isLoading: true});
    try {
      await authService.signOut();
      set({user: null, isAuthenticated: false, isLoading: false});
    } catch (error) {
      set({isLoading: false});
      throw error;
    }
  },

  checkAuth: async () => {
    set({isLoading: true});
    try {
      const user = await authService.getCurrentUser();
      set({user, isAuthenticated: !!user, isLoading: false});
    } catch (error) {
      set({user: null, isAuthenticated: false, isLoading: false});
    }
  },
}));

