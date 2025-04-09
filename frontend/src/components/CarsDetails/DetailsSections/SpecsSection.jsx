import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTranslations } from '../../../translations';

const SpecsSection = ({ title, icon, specs, specKeys }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-cyan-400 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white font-['Orbitron'] mb-6 flex items-center">
        {icon}
        {t(title.toLowerCase().replace(/\s+/g, '_'))}
      </h3>
      
      <div className="space-y-4">
        {specs && Object.entries(specs)
          .filter(([key]) => specKeys.includes(key))
          .map(([key, value]) => {
            // Translate specification names
            const specKey = `spec_${key}`;
            const specName = t(specKey) !== specKey 
              ? t(specKey) 
              : key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              
            return (
              <div key={key} className="flex justify-between items-center py-3 border-b border-cyan-400 last:border-0">
                <span className="text-gray-400 font-['Orbitron'] text-2xs">
                  {specName}
                </span>
                <span className="text-white font-['Rationale'] text-xl">
                  {value}
                </span>
              </div>
            );
          })}
          
        {(!specs || Object.entries(specs).filter(([key]) => specKeys.includes(key)).length === 0) && (
          <div className="text-center py-4">
            <p className="text-gray-400 font-['Orbitron'] text-sm">{t('noSpecificationsAvailable')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecsSection;