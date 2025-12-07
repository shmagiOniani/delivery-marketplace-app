import { create } from 'zustand';
import { secureStorage } from '@/lib/storage/secureStorage';
import type { User, Session, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  login: (session: Session) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
  },

  setSession: (session) => {
    set({ session });
    if (session?.user) {
      set({ user: session.user, isAuthenticated: true });
    }
  },

  login: async (session: Session) => {
    await secureStorage.setTokens(session.access_token, session.refresh_token);
    set({
      user: session.user,
      session,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await secureStorage.clearTokens();
    set({
      user: null,
      session: null,
      isAuthenticated: false,
    });
  },

  initialize: async () => {
    try {
      const tokens = await secureStorage.getTokens();
      if (tokens.accessToken && tokens.refreshToken) {
        set({ isLoading: false });
      } else {
        set({ isLoading: false, isAuthenticated: false });
      }
    } catch (error) {
      set({ isLoading: false, isAuthenticated: false });
    }
  },
}));

export const useUserRole = (): UserRole | null => {
  const user = useAuthStore((state) => state.user);
  return user?.role || null;
};

