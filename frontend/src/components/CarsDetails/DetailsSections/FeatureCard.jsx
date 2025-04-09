import React from 'react';
import { featureIcons } from './featureIcons.jsx';
import { useLanguage } from '../../../context/LanguageContext';
import { useTranslations } from '../../../translations';

const FeatureCard = ({ feature, iconType, icon, description = "" }) => {
  // Use hooks for translation
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  // Determine which icon to display based on iconType or use the provided custom icon
  const displayIcon = iconType ? featureIcons[iconType] || featureIcons.default : icon;
  
  // Use the provided description or a translated default description
  const featureDescription = description || t('defaultFeatureDescription');
  
  return (
    <div className="group relative bg-gradient-to-br from-gray-900/70 to-black/80 border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition-all duration-300 overflow-hidden shadow-lg">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Decorative Element */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all duration-500"></div>

      <div className="flex items-start gap-4">
        {/* Icon Container */}
        <div className="bg-blue-500/20 p-2 rounded-lg text-cyan-400 group-hover:text-blue-300 group-hover:bg-blue-500/30 transition-all duration-300">
          {displayIcon}
        </div>

        <div className="flex-1">
          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-2 font-['Orbitron'] tracking-wide group-hover:text-blue-300 transition-colors duration-300">{feature}</h3>
          
          {/* Description */}
          <p className="text-gray-400 text-sm font-['Orbitron'] text-justify group-hover:text-gray-300 transition-colors duration-300">
            {featureDescription}
          </p>
        </div>
      </div>
      
      {/* Bottom Line */}
      <div className="w-12 h-1 bg-cyan-400 mt-4 rounded-full group-hover:w-full transition-all duration-500"></div>
    </div>
  );
};

export default FeatureCard;