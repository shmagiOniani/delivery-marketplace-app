import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
import { secureStorage } from '../storage/secureStorage';

const supabaseUrl = SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = SUPABASE_ANON_KEY || 'your-supabase-anon-key-placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: async (key: string) => {
        if (key.includes('access_token')) {
          const tokens = await secureStorage.getTokens();
          return tokens.accessToken || null;
        }
        if (key.includes('refresh_token')) {
          const tokens = await secureStorage.getTokens();
          return tokens.refreshToken || null;
        }
        return null;
      },
      setItem: async (key: string, value: string) => {
        if (key.includes('access_token')) {
          await secureStorage.setAccessToken(value);
        }
        if (key.includes('refresh_token')) {
          await secureStorage.setRefreshToken(value);
        }
      },
      removeItem: async (key: string) => {
        await secureStorage.clearTokens();
      },
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;

