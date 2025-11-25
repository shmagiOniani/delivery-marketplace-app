import {supabase} from './client';
import {User} from '../../types/user';

export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

export const authService = {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Fetch user profile
      const {data: profile, error: profileError} = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      return {
        user: profile as User,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: error as Error,
      };
    }
  },

  async signUp(
    email: string,
    password: string,
    fullName: string,
    role: 'customer' | 'driver',
  ): Promise<AuthResponse> {
    try {
      const {data, error} = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });

      if (error) throw error;

      // Create user profile
      const {data: profile, error: profileError} = await supabase
        .from('users')
        .insert({
          id: data.user!.id,
          email: data.user!.email!,
          full_name: fullName,
          role,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      return {
        user: profile as User,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: error as Error,
      };
    }
  },

  async signOut(): Promise<{error: Error | null}> {
    try {
      const {error} = await supabase.auth.signOut();
      return {error: error as Error | null};
    } catch (error) {
      return {error: error as Error};
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const {
        data: {user: authUser},
      } = await supabase.auth.getUser();

      if (!authUser) return null;

      const {data: profile} = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      return profile as User | null;
    } catch (error) {
      return null;
    }
  },

  async resendVerificationEmail(): Promise<{error: Error | null}> {
    try {
      const {
        data: {user},
      } = await supabase.auth.getUser();

      if (!user) {
        return {error: new Error('No user found')};
      }

      const {error} = await supabase.auth.resend({
        type: 'signup',
        email: user.email!,
      });

      return {error: error as Error | null};
    } catch (error) {
      return {error: error as Error};
    }
  },

  async resetPassword(email: string): Promise<{error: Error | null}> {
    try {
      const {error} = await supabase.auth.resetPasswordForEmail(email);
      return {error: error as Error | null};
    } catch (error) {
      return {error: error as Error};
    }
  },
};

