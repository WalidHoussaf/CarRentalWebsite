import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTranslations } from '../../../translations';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  const tabs = [
    { id: 'overview', label: t('overview') },
    { id: 'gallery', label: t('gallery') },
    { id: 'specifications', label: t('specifications') },
    { id: 'features', label: t('features') },
  ];
  
  return (
    <div className="flex flex-wrap border-b border-gray-800 mb-12">
      {tabs.map(tab => (
        <button 
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`py-4 px-6 font-['Orbitron'] text-sm font-medium border-b-2 transition-all duration-300 ${
            activeTab === tab.id 
              ? 'border-cyan-400 text-white' 
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;