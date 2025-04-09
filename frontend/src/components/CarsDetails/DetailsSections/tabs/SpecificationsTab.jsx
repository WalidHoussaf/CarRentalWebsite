import React from 'react';
import SpecsSection from '../SpecsSection';
import { useLanguage } from '../../../../context/LanguageContext';
import { useTranslations } from '../../../../translations';

const SpecificationsTab = ({ car }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  // Group specs by category
  const performanceSpecs = ['engine', 'horsepower', 'torque', 'acceleration', 'topSpeed', 'transmission'];
  const dimensionSpecs = ['weight', 'length', 'width', 'height', 'wheelbase', 'driveType'];
 
  return (
    <div className="relative overflow-hidden rounded-lg p-8">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-950 to-black z-0"></div>
      
      {/* Animated Grid Lines */}
      <div className="absolute inset-0 opacity-20 z-0">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>
      
      {/* Glowing Circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-xl z-0"></div>
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-500 rounded-full opacity-10 blur-xl z-0"></div>
      
      {/* Digital Circuit Lines */}
      <div className="absolute bottom-0 left-0 w-full h-32 opacity-20 bg-circuit-pattern z-0"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white font-['Orbitron'] mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">{t('technicalSpecifications')}</span>
          </h2>
          <p className="text-gray-300 text-2xs font-['Orbitron']">
            {t('exploreEngineering', { carName: car && car.name ? car.name : '' })}
          </p>
        </div>
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <SpecsSection
            title="performance"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            }
            specs={car.specifications}
            specKeys={performanceSpecs}
            className="backdrop-blur-sm bg-black/30 p-6 rounded-lg border border-blue-900/50 shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
          />
         
          <SpecsSection
            title="dimensions_weight"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            }
            specs={car.specifications}
            specKeys={dimensionSpecs}
            className="backdrop-blur-sm bg-black/30 p-6 rounded-lg border border-blue-900/50 shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
};


export default SpecificationsTab;