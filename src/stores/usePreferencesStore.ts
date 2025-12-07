import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'ka';

interface PreferencesState {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
  initialize: () => Promise<void>;
}

const LANGUAGE_KEY = '@carryo:language';

export const usePreferencesStore = create<PreferencesState>((set) => ({
  language: 'en',

  setLanguage: async (language: Language) => {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
    set({ language });
  },

  initialize: async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage === 'en' || savedLanguage === 'ka') {
        set({ language: savedLanguage });
      }
    } catch (error) {
      // Use default language
    }
  },
}));

