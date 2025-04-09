import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTranslations } from '../../../translations';

const ResetButton = ({ resetFilters, navigate }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  const handleReset = () => {
    resetFilters();
    navigate('/cars');
  };

  return (
    <button
      onClick={handleReset}
      className="w-full mt-8 px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 rounded-md hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-['Orbitron'] text-sm border border-gray-700 hover:border-gray-600 flex items-center justify-center cursor-pointer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      {t('resetFilters')}
    </button>
  );
};

export default ResetButton;