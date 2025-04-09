import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets, categoryTranslations } from '../../assets/assets';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

// Fonction pour résoudre les chemins d'image
const resolvePath = (path) => {
  if (!path || typeof path !== 'string') return null;
  
  // Si c'est une référence aux assets (format: "cars.tesla")
  if (path.includes('cars.')) {
    const parts = path.split('.');
    if (parts.length === 2 && parts[0] === 'cars') {
      const carKey = parts[1];
      return assets.cars[carKey];
    }
  }
  
  // Si c'est déjà un chemin complet
  return path;
};

const HeroSection = ({ car }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  // Handle booking
  const handleBookNow = () => {
    navigate(`/booking/${car.id}`);
  };
  
  // Handle navigation back to cars page
  const handleBackClick = () => {
    navigate('/cars');
  };
  
  return (
    <section className="relative">
      {/* Main Image with parallax effect */}
      <div className="h-[60vh] overflow-hidden relative">
        <div className="absolute inset-0 transform scale-105 transition-transform duration-15000 hover:scale-100">
          {car.image && car.image.includes('cars.') ? (
            <img 
              src={resolvePath(car.image)} 
              alt={car.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://via.placeholder.com/1200/800/0f172a/22d3ee?text=${encodeURIComponent(car.name)}`;
              }}
            />
          ) : (
            <img 
              src={car.image || "/api/placeholder/1200/800"} 
              alt={car.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://via.placeholder.com/1200/800/0f172a/22d3ee?text=${encodeURIComponent(car.name)}`;
              }}
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
        
        {/* Animated Light Beams */}
        <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-1 h-full bg-cyan-400 blur-xl transform -skew-x-12 animate-pulse"></div>
          <div className="absolute top-0 right-1/3 w-1 h-full bg-white blur-xl transform skew-x-12 animate-pulse delay-1000"></div>
        </div>
        
        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="animate-fade-in-up">
                <div className="px-4 py-1.5 rounded-full bg-cyan-600/80 backdrop-blur-md text-xs font-bold text-white font-['Orbitron'] uppercase tracking-widest inline-block mb-4 shadow-lg shadow-cyan-500/20">
                  {categoryTranslations[car.category] 
                    ? categoryTranslations[car.category][language] 
                    : car.category}
                </div>
                <h1 className="text-4xl md:text-6xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-3 tracking-tight leading-[1.2]">
                  {car.name}
                </h1>
                <div className="flex items-center text-2xl text-gray-300 font-['Rationale'] space-x-4">
                  <div className="flex items-center group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-500 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>
                      {Array.isArray(car.location) 
                        ? car.location.join(', ').charAt(0).toUpperCase() + car.location.join(', ').slice(1).toLowerCase()
                        : car.location.charAt(0).toUpperCase() + car.location.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center group">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star}
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-4 w-4 ${star <= Math.floor(car.rating) ? "text-yellow-400" : star <= car.rating ? "text-gradient-to-r from-yellow-400 to-gray-400" : "text-gray-500"}`}
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="font-['Rationale'] ml-1 text-gray-300">{car.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:mt-0 animate-fade-in">
                <div className="px-6 py-4 rounded-lg bg-black/70 backdrop-blur-lg border border-gray-800/50 shadow-xl hover:shadow-blue-900/20 transition-all duration-300 transform hover:scale-105">
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] text-center">
                    ${car.price}
                    <span className="text-gray-400 text-sm font-normal ml-1">{t('day')}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-400 text-center font-['Orbitron']">{t('premiumExperience')}</div>
                  
                  {/* Book Now button */}
                  <button 
                    onClick={handleBookNow}
                    className="w-full mt-3 px-6 py-2.5 bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black font-['Orbitron'] text-sm transition-all duration-300 rounded-lg shadow-lg hover:shadow-cyan-500/30 transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    {t('bookNow')}
                  </button>
                  
                  {/* Back to Vehicles Button */}
                  <button 
                    onClick={handleBackClick}
                    className="w-full mt-2 flex items-center justify-center text-gray-400 hover:text-cyan-400 transition-colors duration-300 group text-sm py-2 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="font-['Orbitron'] tracking-wider">{t('backToVehicles')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;