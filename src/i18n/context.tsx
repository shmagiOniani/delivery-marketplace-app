import React, {createContext, useContext, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useUIStore} from '../store/uiStore';

interface I18nContextType {
  changeLanguage: (lang: 'en' | 'ka') => Promise<void>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const {i18n} = useTranslation();
  const {language, setLanguage} = useUIStore();

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const changeLanguage = async (lang: 'en' | 'ka') => {
    await setLanguage(lang);
    await i18n.changeLanguage(lang);
  };

  return (
    <I18nContext.Provider value={{changeLanguage}}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};

