import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '@/types';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

export const secureStorage = {
  async setAccessToken(token: string): Promise<void> {
    const refreshToken = await this.getRefreshToken();
    if (refreshToken) {
      await Keychain.setGenericPassword(token, refreshToken);
    } else {
      await Keychain.setGenericPassword(token, '');
    }
  },

  async getAccessToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        return credentials.username || null;
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  async setRefreshToken(token: string): Promise<void> {
    const accessToken = await this.getAccessToken();
    if (accessToken) {
      await Keychain.setGenericPassword(accessToken, token);
    } else {
      await Keychain.setGenericPassword('', token);
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        return credentials.password || null;
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Keychain.setGenericPassword(accessToken, refreshToken);
  },

  async getTokens(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        return {
          accessToken: credentials.username,
          refreshToken: credentials.password,
        };
      }
      return { accessToken: null, refreshToken: null };
    } catch (error) {
      return { accessToken: null, refreshToken: null };
    }
  },

  async clearTokens(): Promise<void> {
    await Keychain.resetGenericPassword();
  },

  async setUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      if (userData) {
        return JSON.parse(userData) as User;
      }
      return null;
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  },

  async clearUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  },
};

