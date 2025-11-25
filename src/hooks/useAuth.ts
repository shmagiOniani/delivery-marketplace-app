import {useAuthStore} from '../store/authStore';

export const useAuth = () => {
  const {user, isAuthenticated, isLoading, signOut} = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    signOut,
    isCustomer: user?.role === 'customer',
    isDriver: user?.role === 'driver',
    isAdmin: user?.role === 'admin',
  };
};

