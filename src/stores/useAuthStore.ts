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
    await secureStorage.setUser(session.user);
    set({
      user: session.user,
      session,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await secureStorage.clearTokens();
    await secureStorage.clearUser();
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
        // Try to get stored user data
        try {
          const storedUser = await secureStorage.getUser();
          if (storedUser) {
            set({
              user: storedUser,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }
        } catch (e) {
          // User data not found, continue
        }
        // If no user data, set loading to false but keep user as null
        // The app will show auth screen if user is null
        set({ isLoading: false, isAuthenticated: false });
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

