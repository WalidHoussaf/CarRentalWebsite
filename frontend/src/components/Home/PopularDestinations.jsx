import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

const PopularDestinations = ({ destinations }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);

  // Fonction pour obtenir le nom traduit d'une destination
  const getTranslatedName = (destination) => {
    const key = `destination_${destination.name.toLowerCase().replace(/\s+/g, '_')}`;
    return t(key) || destination.name;
  };

  // Fonction pour obtenir la description traduite d'une destination
  const getTranslatedDescription = (destination) => {
    const key = `destination_${destination.name.toLowerCase().replace(/\s+/g, '_')}_desc`;
    return t(key) || destination.description || t('exploreDestination');
  };

  return (
    <section className="relative py-24 px-4 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 via-black to-blue-900/10 pointer-events-none"></div>
  
      {/* Grid Lines Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(to right, #8B5CF6 1px, transparent 1px), linear-gradient(to bottom, #8B5CF6 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-2xl md:text-5xl font-semibold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] leading-[1.2]">
          {t('popularDestinations')}
        </h2>
    
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <div
              key={index}
              className="group relative h-80 rounded-xl overflow-hidden border border-gray-800 transform transition-all duration-500 hover:scale-105 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden z-20">
                <div className="absolute top-0 right-0 w-16 h-2 bg-blue-900 transform rotate-45 translate-y-1 translate-x-2"></div>
                <div className="absolute top-0 right-0 h-16 w-2 bg-blue-600 transform -rotate-45 translate-y-2 translate-x-1"></div>
              </div>
              
              {/* Digital Noise Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 opacity-70 z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Digital Lines Animation */}
              <div className="absolute inset-0 opacity-20 z-10 overflow-hidden">
                <div className="h-full w-full animate-pulse">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute h-px w-full bg-blue-400/30"
                      style={{ 
                        top: `${Math.random() * 100}%`,
                        animation: 'scanline 3s linear infinite',
                        animationDelay: `${i * 0.5}s`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              <img
                src={destination.image}
                alt={getTranslatedName(destination)}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Location Tag */}
              <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-md bg-black/70 backdrop-blur-sm border border-cyan-400 flex items-center space-x-1 group-hover:border-blue-500/50 transition-all duration-300">
                <div className="w-2 h-2 rounded-full bg-cyan-400 group-hover:bg-blue-400 transition-colors duration-300 animate-pulse"></div>
                <span className="text-xs font-medium text-cyan-400 group-hover:text-blue-400 transition-colors duration-300 font-['Orbitron']">
                  {index + 1 < 10 ? `0${index + 1}` : index + 1}
                </span>
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-30 transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                <h3 className="text-2xl font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300 font-['Orbitron'] mb-3">
                  {getTranslatedName(destination)}
                </h3>
                
                <p className="text-xs text-gray-300 mb-4 opacity-0 group-hover:opacity-100 transform transition-all duration-500 translate-y-4 group-hover:translate-y-0 font-['Orbitron']">
                  {getTranslatedDescription(destination)}
                </p>
                
                <Link
                  to={`/cars?location=${destination.value || destination.name.toLowerCase()}`}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-cyan/30 border border-cyan-500/50 rounded-md group-hover:bg-blue-900/30 group-hover:border-blue-500/50 transition-all duration-300 overflow-hidden"
                >
                  {/* Animated background glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                  <span className="relative z-10 font-['Orbitron']">{t('discoverRides')}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 relative z-10 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;