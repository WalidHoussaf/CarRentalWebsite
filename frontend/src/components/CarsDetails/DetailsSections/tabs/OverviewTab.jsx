import React from 'react';
import { Link } from 'react-router-dom';
import CarHighlights from '../CarHighlights';
import { useLanguage } from '../../../../context/LanguageContext';
import { useTranslations } from '../../../../translations';

const OverviewTab = ({ car }) => {
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
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-xl z-0 floating-light"></div>
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-500 rounded-full opacity-10 blur-xl z-0 floating-light-slow"></div>
      
      {/* Digital Circuit Lines */}
      <div className="absolute bottom-0 left-0 w-full h-32 opacity-20 bg-circuit-pattern z-0"></div>
      
      {/* Content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold text-white font-['Orbitron'] mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r uppercase from-white to-cyan-400">{t('experienceThe')} {car.name}</span>
          </h2>
          <div className="space-y-6 text-gray-300 text-justify font-['Orbitron'] text-sm backdrop-blur-sm bg-black/30 p-6 rounded-lg border border-blue-900/50 shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
            <p>{t('luxuryExperience', { carName: car.name })}</p>
            
            <p>
              {t('poweredBy')} {car.specifications.engine} {t('producing')} {car.specifications.horsepower || car.specifications.power}, {t('the')} {car.name} {t('deliversAcceleration')} {car.specifications.acceleration?.split(' ')[0] || 'record'} {t('seconds')}. {t('advancedTransmission', {
                transmission: car.specifications.transmission, 
                driveType: car.specifications.driveType || car.specifications.torque
              })}
            </p>
          </div>
          
          <div className="mt-8 flex items-center">
            <Link to="/contact" className="px-6 py-3 bg-gradient-to-r font-semibold from-white to-cyan-400 text-black font-['Orbitron'] rounded-md flex items-center hover:from-cyan-400 hover:to-white transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-blue-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {t('contactAboutVehicle')}
            </Link>
          </div>
        </div>
        
        {/* CarHighlights Component */}
        <div className="relative z-10">
          <CarHighlights car={car} />
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;