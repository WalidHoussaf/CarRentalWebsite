import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

const StatsSection = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  return (
    <section className="relative py-12 bg-black border-t border-b border-black">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 to-cyan-900/5"></div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-2">
              100+
            </div>
            <div className="text-gray-300 font-['Orbitron'] text-sm">{t('stats_vehicles')}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-2">
              7
            </div>
            <div className="text-gray-300 font-['Orbitron'] text-sm">{t('stats_locations')}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-2">
              4.9
            </div>
            <div className="text-gray-300 font-['Orbitron'] text-sm">{t('stats_rating')}</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-2">
              24 / 7
            </div>
            <div className="text-gray-300 font-['Orbitron'] text-sm">{t('stats_support')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;