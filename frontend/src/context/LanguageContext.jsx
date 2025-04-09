import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const LanguageContext = createContext();

// Custom hook to use the language context
export const useLanguage = () => {
  return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
  // Get stored language or use 'en' as default
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
    // Update the lang attribute of the HTML document
    document.documentElement.lang = language;
  }, [language]);

  // Change the language
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  // Check if current language is French
  const isFrench = language === 'fr';

  // Context value
  const value = {
    language,
    setLanguage,
    toggleLanguage,
    isFrench
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext; 