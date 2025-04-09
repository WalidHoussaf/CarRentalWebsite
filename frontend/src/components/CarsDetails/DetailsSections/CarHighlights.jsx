import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTranslations } from '../../../translations';

const HighlightItem = ({ title, description }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-1">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </div>
    <div className="ml-3">
      <p className="text-white font-medium font-['Orbitron']">{title}</p>
      <p className="text-gray-400 text-xs font-['Orbitron']">{description}</p>
    </div>
  </div>
);

const CarHighlights = ({ car }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800 rounded-xl p-6 h-fit">
      <h3 className="text-xl font-semibold text-white font-['Orbitron'] mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
        </svg>
        {t('highlights') || 'HIGHLIGHTS'}
      </h3>
      
      <div className="space-y-4">
        <HighlightItem 
          title={t('explosivePerformance') || "Explosive Performance"} 
          description={`${t('accelerateFrom') || 'Accelerate from'} 0-60 mph ${t('inJust') || 'in just'} ${car.specifications.acceleration?.split(' ')[0] || 'record'} ${t('secondsWith') || 'seconds with'} ${car.specifications.horsepower} ${t('ofRawPower') || 'of raw power'}.`} 
        />
        
        <HighlightItem 
          title={t('cuttingEdgeTechnology') || "Cutting-Edge Technology"} 
          description={t('experienceLatestAutomotive') || "Experience the latest in automotive innovation with advanced driver assistance systems and connectivity features."} 
        />
        
        {car.features && car.features.length > 0 && (
          car.features.slice(0, 2).map((feature, index) => (
            <HighlightItem 
              key={index}
              title={feature} 
              description={t('premiumQuality') || "Premium quality and performance in every detail."} 
            />
          ))
        )}
      </div>
      
      <div className="mt-8 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-cyan-400 font-['Orbitron']">{t('limitedAvailability') || "Limited Availability"}</h4>
            <p className="mt-1 text-2xs text-gray-300 font-['Rationale']">{t('vehicleHighDemand') || "This vehicle is in high demand. We recommend booking in advance to secure your experience."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarHighlights;