import React from 'react';
import FeatureCard from '../FeatureCard';
import { useLanguage } from '../../../../context/LanguageContext';
import { useTranslations } from '../../../../translations';

// Helper function to determine iconType based on feature name
const getIconTypeFromFeature = (featureName) => {
  const featureLower = featureName.toLowerCase();
  
  if (featureLower.includes('performance') || featureLower.includes('engine') || featureLower.includes('power')) 
    return 'performance';
  if (featureLower.includes('battery') || featureLower.includes('electric') || featureLower.includes('charging')) 
    return 'battery';
  if (featureLower.includes('audio') || featureLower.includes('sound') || featureLower.includes('speaker')) 
    return 'audio';
  if (featureLower.includes('climate') || featureLower.includes('air') || featureLower.includes('temperature')) 
    return 'climate';
  if (featureLower.includes('wifi') || featureLower.includes('connect') || featureLower.includes('internet')) 
    return 'connectivity';
  if (featureLower.includes('security') || featureLower.includes('alarm') || featureLower.includes('lock')) 
    return 'security';
  if (featureLower.includes('camera') || featureLower.includes('view') || featureLower.includes('monitor')) 
    return 'camera';
  if (featureLower.includes('navigation') || featureLower.includes('gps') || featureLower.includes('map')) 
    return 'navigation';
  if (featureLower.includes('bluetooth')) 
    return 'bluetooth';
  
  // Default, return 'default'
  return 'default';
};

const FeaturesTab = ({ car }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);

  return (
    <div className="relative overflow-hidden rounded-lg p-8">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-950 to-black z-0"></div>
     
      {/* Animated Grid Lines */}
      <div className="absolute inset-0 opacity-20 z-0 bg-grid-scan"></div>
     
      {/* Tech Lines */}
      <div className="absolute inset-0 opacity-15 z-0 bg-tech-lines"></div>
     
      {/* Data Stream */}
      <div className="absolute inset-0 opacity-10 z-0 bg-data-stream"></div>
     
      {/* Glowing Circles */}
      <div className="absolute top-20 -right-20 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-xl z-0 floating-light"></div>
      <div className="absolute -bottom-16 left-20 w-64 h-64 bg-indigo-500 rounded-full opacity-10 blur-xl z-0 floating-light-slow"></div>
     
      {/* Digital Circuit Lines */}
      <div className="absolute bottom-0 right-0 w-full h-40 opacity-20 bg-circuit-pattern z-0"></div>
     
      {/* Content */}
      <div className="relative z-10">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white font-['Orbitron'] mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">{t('premiumFeatures')}</span>
          </h2>
          <p className="text-gray-300 font-['Orbitron'] text-2xs">
            {t('discoverFeatures', { carName: car ? car.name : '' })}
          </p>
        </div>
       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {car.features && car.features.length > 0 ? (
            car.features.map((feature, index) => {
              // Get feature translation if it exists
              const featureKey = `feature_${feature.toLowerCase().replace(/\s+/g, '_')}`;
              const translatedFeature = t(featureKey) !== featureKey ? t(featureKey) : feature;
              
              return (
                <div key={index} className="transform transition-all duration-300 hover:scale-105 hover:z-20">
                  <FeatureCard 
                    key={index} 
                    feature={translatedFeature} 
                    iconType={getIconTypeFromFeature(feature)}
                  />
                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-gray-400 font-['Orbitron']">{t('noFeaturesAvailable')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturesTab;