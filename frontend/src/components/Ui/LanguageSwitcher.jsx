import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { assets } from '../../assets/assets';

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <button
      onClick={toggleLanguage}
      className="w-8 h-6 ml-2 overflow-hidden rounded-sm transition-transform duration-300 hover:scale-110 focus:outline-none border border-black cursor-pointer"
      aria-label={language === 'en' ? 'Passer en français' : 'Switch to English'}
    >
      <img 
        src={language === 'en' ? assets.frenchFlag : assets.ukFlag} 
        alt={language === 'en' ? 'Drapeau français' : 'UK flag'} 
        className="w-full h-full object-cover"
      />
    </button>
  );
};

export default LanguageSwitcher; 