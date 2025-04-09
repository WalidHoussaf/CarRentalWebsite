import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sampleCars, resolveImagePaths, resolveGalleryPaths, categoryTranslations } from '../assets/assets';
import HeroSection from '../components/CarsDetails/HeroSection';
import PerformanceStats from '../components/CarsDetails/PerformanceStats';
import AvailabilitySection from '../components/CarsDetails/AvailabilitySection';
import DetailsTabSection from '../components/CarsDetails/DetailsTabSection';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';

const CarDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  // Scroll to Top on Component Mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  // Function to Scroll Navigation to the Top
  const navigateWithScroll = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };
  
  // Find the Car by ID
  const car = sampleCars.find(car => car.id === parseInt(id));
  
  // If Car is not Found, Show the Error UI
  if (!car) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-lg text-center px-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-600 mb-6" viewBox="0 0 24 24" fill="none">
            <path d="M3 14L4 8C4.4 6.5 5.2 6 7 6H17C18.8 6 19.6 6.5 20 8L21 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M4 17H2C1.5 17 1 16.5 1 16V14C1 13.5 1.5 13 2 13H22C22.5 13 23 13.5 23 14V16C23 16.5 22.5 17 22 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="6" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="18" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4 11H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <h2 className="text-2xl font-bold mb-4 font-['Orbitron']">{t('vehicleNotFound')}</h2>
          <p className="text-gray-400 mb-8">{t('vehicleNotFoundDesc')}</p>
          <button 
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-white hover:from-white hover:to-cyan-400 text-black font-['Orbitron'] transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 rounded-md"
            onClick={() => navigateWithScroll('/cars')}
          >
            {t('backToVehicles')}
          </button>
        </div>
      </div>
    );
  }
  
  // Resolve the Car Image Paths
  const processedCar = resolveImagePaths([car], 'image')[0];
  
  // Resolve Gallery Paths as per your Requirement
  const [resolvedCar] = resolveGalleryPaths([car]);
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section Component */}
      <HeroSection car={processedCar} />

      {/* Availability Section */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <AvailabilitySection carId={car.id} />
        </div>
      </section>
      
      {/* Performance Stats Component */}
      <PerformanceStats specifications={processedCar.specifications} />

      {/* Details Tab Section */}
      <DetailsTabSection car={resolvedCar} />

      {/* Animated Divider */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-white via-cyan-400 to-white animate-pulse"></div>
      </div>

      {/* Related Vehicles Section */}
      <section className="py-16 px-4 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/50 to-black z-0"></div>
          
          {/* Diagonal Lines */}
          <div className="absolute inset-0 z-10"
               style={{
                 backgroundImage: 'linear-gradient(135deg, transparent 0%, transparent 49%, rgba(59, 130, 246, 0.1) 50%, transparent 51%, transparent 100%), linear-gradient(45deg, transparent 0%, transparent 49%, rgba(139, 92, 246, 0.1) 50%, transparent 51%, transparent 100%)',
                 backgroundSize: '50px 50px, 50px 50px',
               }}>
          </div>

          {/* Digital Effect */}
          <div className="absolute inset-0 z-10"
               style={{
                 background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.03) 3px, transparent 3px)',
                 backgroundSize: '100% 4px',
               }}>
          </div>
          
          {/* Vignette Effect */}
          <div className="absolute inset-0 bg-radial-gradient z-10"
               style={{
                 background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.6) 100%)',
               }}>
          </div>
          
        </div>

        <div className="max-w-7xl mx-auto relative z-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-4">
              {t('similarVehicles')}
            </h2> 
            <div className="w-24 h-1 bg-gradient-to-r from-white to-cyan-400 mx-auto mb-4"></div>
            <p className="text-gray-300 max-w-2xl mx-auto text-2xs font-['Orbitron']">
              {t('exploreVehicles')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleCars
              .filter(relatedCar => relatedCar.category === car.category && relatedCar.id !== car.id)
              .slice(0, 3)
              .map((relatedCar) => {
                const processedRelatedCar = resolveImagePaths([relatedCar], 'image')[0];
                return (
                  <div
                  key={relatedCar.id}
                  className="relative bg-black/60 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300 group hover:border-blue-500/50"
                  >
                  {/* Card Corner */}
                  <div className="absolute top-0 left-0 w-2 h-8 bg-gradient-to-b from-white to-transparent"></div>
                  <div className="absolute top-0 left-0 w-8 h-2 bg-gradient-to-r from-white to-transparent"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-8 bg-gradient-to-t from-cyan-400 to-transparent"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-2 bg-gradient-to-l from-cyan-400  to-transparent"></div>
                  
                  {/* Card Header */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                    src={processedRelatedCar.image || "/api/placeholder/400/240"}
                    alt={processedRelatedCar.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                    
                    {/* Badge for Category */}
                    <div className="absolute top-3 left-3">
                    <div className="px-3 py-1 rounded-full bg-blue-500/80 backdrop-blur-sm text-xs text-black font-bold bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] uppercase tracking-wider">
                      {categoryTranslations[processedRelatedCar.category] 
                        ? categoryTranslations[processedRelatedCar.category][language] 
                        : processedRelatedCar.category}
                    </div>
                    </div>
                    
                    {/* Price Badge */}
                    <div className="absolute bottom-3 right-3">
                    <div className="px-3 py-1 rounded-md bg-black/80 backdrop-blur-sm text-2xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron']">
                      ${processedRelatedCar.price}{t('day')}
                    </div>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-300 font-['Orbitron'] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-400 transition-all duration-300">
                      {processedRelatedCar.name}
                    </h3>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-white text-xl font-['Rationale']">{processedRelatedCar.rating.toFixed(1)}</span>
                    </div>
                    </div>
                    
                    {/* Button */}
                    <button
                    onClick={() => {
                      navigateWithScroll(`/cars/${processedRelatedCar.id}`);
                    }}
                    className="w-full px-4 py-2 bg-black text-white border border-cyan-400 font-['Orbitron'] text-sm transition-all duration-300 rounded-sm mt-2 
                      hover:bg-gradient-to-r hover:from-white hover:to-cyan-500/50 
                      group relative overflow-hidden cursor-pointer"
                    >
                    <span className="relative z-10 transition-colors duration-100  text-white
                      group-hover:text-black">
                      {t('viewDetails')}
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-white 
                      transition-all duration-500 
                      group-hover:h-1 group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-400">
                    </span>
                    </button>
                  </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarDetailPage;