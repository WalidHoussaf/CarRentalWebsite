import React, { useState } from 'react';
import { featureOptions } from '../../../assets/assets';
import { useLanguage } from '../../../context/LanguageContext';
import { useTranslations } from '../../../translations';

const FeaturesFilter = ({ filters, toggleFeature }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  
  // Default number of features to display
  const defaultVisibleCount = 6;
  
  // Visible features based on current state
  const visibleFeatures = showAllFeatures 
    ? featureOptions 
    : featureOptions.slice(0, defaultVisibleCount);
  
  return (
    <div>
      <label className="text-sm font-medium text-gray-300 mb-3 font-['Orbitron'] flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
        {t('advancedFeatures')}
      </label>
      <div className="space-y-2 bg-black/50 border border-gray-800 rounded-md p-3">
        {visibleFeatures.map((feature) => (
          <div key={feature.value} className="flex items-center">
            <div className="relative w-4 h-4 flex items-center justify-center mr-2">
              <input
                type="checkbox"
                id={feature.value}
                checked={filters.features.includes(feature.value)}
                onChange={() => toggleFeature(feature.value)}
                className="opacity-0 absolute h-4 w-4 cursor-pointer"
              />
              <div className={`border ${filters.features.includes(feature.value) ? 'bg-cyan-600 border-cyan-600' : 'border-gray-700'} w-4 h-4 rounded transition-colors duration-200`}></div>
              {filters.features.includes(feature.value) && (
                <svg className="fill-current text-white absolute w-2 h-2" viewBox="0 0 20 20">
                  <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                </svg>
              )}
            </div>
            <label
              htmlFor={feature.value}
              className="text-xs text-gray-300 font-['Orbitron'] cursor-pointer"
            >
              {feature.label[language]}
            </label>
          </div>
        ))}
        
        {/* Show more/less button */}
        {featureOptions.length > defaultVisibleCount && (
          <button
            onClick={() => setShowAllFeatures(!showAllFeatures)}
            className="mt-2 w-full text-center text-xs text-cyan-400 hover:text-cyan-300 font-['Orbitron'] transition-colors duration-300 cursor-pointer"
          >
            {showAllFeatures ? 'Show Less' : `Show ${featureOptions.length - defaultVisibleCount} More`}
          </button>
        )}
      </div>
    </div>
  );
};

export default FeaturesFilter;