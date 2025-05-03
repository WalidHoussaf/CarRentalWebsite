import React, { useState, useEffect } from 'react';
import { featureOptions } from '../../../assets/assets';
import { useLanguage } from '../../../context/LanguageContext';
import { useTranslations } from '../../../translations';

const FeaturesFilter = ({ filters, toggleFeature, filteredCars }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [availableFeatures, setAvailableFeatures] = useState([]);
  
  // Find features that match at least one car or are already selected
  useEffect(() => {
    if (filteredCars && filteredCars.length > 0) {
      const matchingFeatures = featureOptions.filter(featureOption => {
        // If feature is already selected, always include it
        if (filters.features.includes(featureOption.value)) {
          return true;
        }
        
        // Get the keywords for this feature
        const keywords = featureOption.keywords || [featureOption.value];
        
        // Check if any car has this feature
        return filteredCars.some(car => {
          // Check in car features
          const matchInFeatures = keywords.some(keyword => 
            car.features.some(carFeature => 
              carFeature.toLowerCase().includes(keyword.toLowerCase())
            )
          );
          
          if (matchInFeatures) return true;
          
          // Check in car description
          if (car.description) {
            const matchInDescription = keywords.some(keyword => 
              car.description.toLowerCase().includes(keyword.toLowerCase())
            );
            if (matchInDescription) return true;
          }
          
          // Check in specifications
          if (car.specifications) {
            // Check engine
            if (car.specifications.engine) {
              const matchInEngine = keywords.some(keyword => 
                car.specifications.engine.toLowerCase().includes(keyword.toLowerCase())
              );
              if (matchInEngine) return true;
            }
            
            // Check transmission
            if (car.specifications.transmission) {
              const matchInTransmission = keywords.some(keyword => 
                car.specifications.transmission.toLowerCase().includes(keyword.toLowerCase())
              );
              if (matchInTransmission) return true;
            }
            
            // Check horsepower
            if (featureOption.value === 'horsepower' && car.specifications.horsepower) {
              // Consider "high horsepower" as 400+ hp
              if (car.specifications.horsepower >= 400) {
                return true;
              }
            }
          }
          
          // Check special boolean properties
          if (featureOption.value === 'air conditioning' && car.air_conditioning) return true;
          if (featureOption.value === 'bluetooth' && car.bluetooth) return true;
          if (featureOption.value === 'navigation' && car.gps) return true;
          if (featureOption.value === 'usb' && car.usb) return true;
          
          return false;
        });
      });
      
      setAvailableFeatures(matchingFeatures);
    } else {
      // If no filtered cars, use all features
      setAvailableFeatures(featureOptions);
    }
  }, [filteredCars, filters.features]);
  
  // Default number of features to display
  const defaultVisibleCount = 6;
  
  // Visible features based on current state
  const visibleFeatures = showAllFeatures 
    ? availableFeatures 
    : availableFeatures.slice(0, defaultVisibleCount);
  
  // If no available features, don't render the component
  if (availableFeatures.length === 0) {
    return null;
  }
  
  return (
    <div>
      <label className="text-sm font-medium text-gray-300 mb-3 font-['Orbitron'] flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
        {t('advancedFeatures')}
        {filters.features.length > 0 && (
          <span className="ml-2 px-2 py-0.5 text-xs bg-cyan-500/20 text-cyan-400 rounded-full animate-pulse">
            {filters.features.length}
          </span>
        )}
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
              className={`text-xs font-['Orbitron'] cursor-pointer ${
                filters.features.includes(feature.value) 
                  ? 'text-cyan-300' 
                  : 'text-gray-300 hover:text-cyan-300'
              }`}
            >
              {feature.label[language]}
            </label>
          </div>
        ))}
        
        {/* Show more/less button */}
        {availableFeatures.length > defaultVisibleCount && (
          <button
            onClick={() => setShowAllFeatures(!showAllFeatures)}
            className="mt-2 w-full text-center text-xs text-cyan-400 hover:text-cyan-300 font-['Orbitron'] transition-colors duration-300 cursor-pointer"
          >
            {showAllFeatures ? t('showLess') : t('showMore') + ` (${availableFeatures.length - defaultVisibleCount})`}
          </button>
        )}
      </div>
    </div>
  );
};

export default FeaturesFilter;