import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'auto';
type Language = 'en' | 'ka';

interface UIState {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => Promise<void>;
  setLanguage: (language: Language) => Promise<void>;
  initialize: () => Promise<void>;
}

const THEME_KEY = '@carryo:theme';
const LANGUAGE_KEY = '@carryo:language';

export const useUIStore = create<UIState>(set => ({
  theme: 'light',
  language: 'en',

  setTheme: async theme => {
    await AsyncStorage.setItem(THEME_KEY, theme);
    set({theme});
  },

  setLanguage: async language => {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
    set({language});
  },

  initialize: async () => {
    const [theme, language] = await Promise.all([
      AsyncStorage.getItem(THEME_KEY),
      AsyncStorage.getItem(LANGUAGE_KEY),
    ]);
    set({
      theme: (theme as Theme) || 'light',
      language: (language as Language) || 'en',
    });
  },
}));

