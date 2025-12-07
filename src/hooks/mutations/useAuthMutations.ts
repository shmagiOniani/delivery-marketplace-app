import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/stores/useAuthStore';
import { showErrorAlert } from '@/lib/utils/errorHandler';
import type { Session, UserRole } from '@/types';
import type { LoginFormData, SignupFormData } from '@/lib/validation/schemas';

interface LoginResponse {
  user: {
    id: string;
    email: string;
    full_name?: string;
    role: UserRole;
  };
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
  role: UserRole;
}

interface SignupResponse {
  user: {
    id: string;
    email: string;
    full_name?: string;
    role: UserRole;
  };
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  } | null;
}

export const useLoginMutation = () => {
  const navigation = useNavigation();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiClient.post<LoginResponse>('/api/auth/login', {
        email: data.email,
        password: data.password,
      });
      return response;
    },
    onSuccess: (data) => {
      const session: Session = {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
        user: {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.full_name,
          role: data.user.role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };
      login(session);
    },
    onError: (error) => {
      showErrorAlert(error, 'Login Failed');
    },
  });
};

export const useSignupMutation = () => {
  const navigation = useNavigation();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (data: SignupFormData) => {
      const response = await apiClient.post<SignupResponse>('/api/auth/signup', {
        email: data.email,
        password: data.password,
        fullName: data.full_name,
        role: data.role || 'customer',
      });
      return response;
    },
    onSuccess: (data) => {
      if (data.session) {
        const session: Session = {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
          user: {
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.full_name,
            role: data.user.role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        };
        login(session);
      } else {
        // Email confirmation required - show message to user
        showErrorAlert(
          { message: 'Please check your email to confirm your account' },
          'Email Confirmation Required'
        );
      }
    },
    onError: (error) => {
      showErrorAlert(error, 'Signup Failed');
    },
  });
};

export const useLogoutMutation = () => {
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/api/auth/logout');
    },
    onSuccess: () => {
      logout();
    },
    onError: (error) => {
      showErrorAlert(error, 'Logout Failed');
      logout();
    },
  });
};

