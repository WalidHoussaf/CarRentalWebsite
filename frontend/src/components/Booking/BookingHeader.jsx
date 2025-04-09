import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

// Futuristic calendar icon component (Dates)
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path className="stroke-current stroke-1" strokeLinecap="round" d="M6 2v4M18 2v4" />
    <rect x="2" y="4" width="20" height="18" rx="2" className="fill-transparent stroke-current stroke-1" />
    <path d="M2 10h20" className="stroke-current stroke-1" />
    <circle cx="8" cy="15" r="1.5" fill="currentColor" />
    <circle cx="16" cy="15" r="1.5" fill="currentColor" />
    <circle cx="8" cy="19" r="1.5" fill="currentColor" />
    <circle cx="16" cy="19" r="1.5" fill="currentColor" />
    <path d="M10 3L14 3" className="stroke-current stroke-1" />
  </svg>
);

// Futuristic location icon component (Location)
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <circle cx="12" cy="9" r="3" className="fill-current" />
    <path d="M18 9.5h3M3 9.5h3" className="stroke-current stroke-1" strokeLinecap="round" strokeWidth="1.2" />
    <path d="M12 16.5v3" className="stroke-current stroke-1" strokeLinecap="round" strokeWidth="1.2" />
  </svg>
);

// Futuristic options icon component
const OptionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    {/* Outer circle */}
    <circle cx="12" cy="12" r="10" className="fill-transparent stroke-current stroke-1" />
    
    {/* Main gear */}
    <path d="M12 6.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zm0 9a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" className="fill-transparent stroke-current stroke-1" />
    
    {/* Gear teeth */}
    <path d="M12 2v2.5M12 19.5V22M22 12h-2.5M4.5 12H2M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8M19.1 19.1l-1.8-1.8M6.7 6.7l-1.8-1.8" strokeLinecap="round" className="stroke-current stroke-1" />
    
    {/* Center point */}
    <circle cx="12" cy="12" r="1.8" className="fill-current" />
    
    {/* Light effect */}
    <circle cx="12" cy="12" r="3" className="fill-transparent stroke-current stroke-1" strokeDasharray="0.5 1" />
  </svg>
);

// Futuristic summary icon component
const SummaryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <rect x="3" y="3" width="18" height="18" rx="2" className="fill-transparent stroke-current stroke-1" />
    <path d="M7 8h10M7 12h10M7 16h6" strokeLinecap="round" className="stroke-current stroke-1" />
    <path d="M17 17l2 2M21 19l-2-2" strokeLinecap="round" className="stroke-current stroke-1" />
    <circle cx="17" cy="17" r="1.5" className="fill-current" />
  </svg>
);

const BookingHeader = ({ car, bookingStep }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  // Booking process steps with SVG icons
  const steps = [
    { id: 1, name: t('dates'), icon: <CalendarIcon />, description: t('selectRentalPeriod') },
    { id: 2, name: t('location'), icon: <LocationIcon />, description: t('choosePickupReturn') },
    { id: 3, name: t('selectOptions'), icon: <OptionsIcon />, description: t('customizeExperience') },
    { id: 4, name: t('summary'), icon: <SummaryIcon />, description: t('reviewAndConfirm') }
  ];

  return (
    <div className="relative py-16 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 to-cyan-900/5 pointer-events-none"></div>
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(to right, #3B82F6 1px, transparent 1px), linear-gradient(to bottom, #8B5CF6 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}></div>
      </div>
      
      {/* Contenu */}
      <div className="container mx-auto px-4 relative">
        <div className="bg-gradient-to-r from-gray-900/80 via-black/90 to-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-8 lg:p-12 relative overflow-hidden">
          {/* Éléments décoratifs */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>
          <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-cyan-500 blur-xl opacity-20"></div>
          <div className="absolute -right-4 bottom-0 w-8 h-8 rounded-full bg-white blur-xl opacity-20"></div>
          
          <div className="relative z-10">
            <div className="mb-8">
              <Link 
                to={`/cars/${car?.id}`} 
                className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center font-['Orbitron'] group transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('backToVehicleDetails')}
              </Link>
            </div>
            
            {/* Informations du véhicule avec animation */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-8 transform animate-fade-in-up">
              <div className="max-w-2xl">
                <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-xs font-bold text-cyan-400 font-['Orbitron'] uppercase tracking-widest mb-4">
                  {car?.category ? (t(car.category) || car.category) : t('vehicle')}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-3">
                  {t('bookYour')} {car?.name || t('vehicle')}
                </h1>
                <p className="text-gray-300 font-['Orbitron'] text-sm md:text-base">
                  {t('completeStepsBelow')}
                </p>
              </div>
              <div className="mt-6 md:mt-0 flex items-center bg-black/50 p-4 rounded-lg border border-gray-800/50 backdrop-blur-sm shadow-lg hover:shadow-cyan-900/20 transition-all duration-300 transform hover:scale-105">
                <span className="text-gray-400 mr-2 text-sm font-['Orbitron']">{t('startingAt')}</span>
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron']">
                  ${car?.price || '---'}
                </span>
                <span className="text-gray-400 ml-1 text-sm font-['Orbitron']">{t('day')}</span>
              </div>
            </div>
            
            {/* Étapes de progression - Améliorées - Résistantes aux différences de longueur de texte */}
            <div className="mt-16 mb-6">
              {/* Conteneur pour la barre de progression et les étapes */}
              <div className="relative">
                {/* Grille pour les étapes */}
                <div className="hidden md:block absolute top-7 left-14 right-14 h-1 bg-gray-800" style={{ zIndex: 5 }}></div>
                
                {/* Barre de progression active - Valeurs en pixels pour précision maximale */}
                <div 
                  className="hidden md:block absolute top-7 h-1 bg-gradient-to-r from-white to-cyan-400 transition-all duration-500 ease-in-out" 
                  style={{ 
                    left: '50px',
                    width: bookingStep === 1 ? '65px' : 
                           bookingStep === 2 ? '365px' : 
                           bookingStep === 3 ? '680px' : 
                           '1045px',
                    zIndex: 6
                  }}
                ></div>
                
                {/* Grille pour les étapes */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-0 relative">
                  {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center justify-start relative z-10">
                      {/* Icône circulaire */}
                      <div className={`
                        w-14 h-14 rounded-full flex items-center justify-center
                        ${bookingStep >= step.id 
                          ? 'bg-gradient-to-r from-white to-cyan-400 text-black shadow-lg shadow-cyan-500/20' 
                          : 'bg-gray-800/80 text-gray-500 border border-gray-700'}
                        transition-all duration-500 transform ${bookingStep === step.id ? 'scale-110' : ''}
                      `} style={{ zIndex: 7 }}>
                        {step.icon}
                      </div>
                      
                      {/* Étiquette d'étape - Hauteur fixe avec gestion du débordement */}
                      <div className={`
                        mt-3 font-medium font-['Orbitron'] transition-all duration-300 w-full
                        ${bookingStep >= step.id ? 'text-white' : 'text-gray-600'}
                      `}>
                        <div className="text-center">
                          {/* Hauteur fixe pour le titre pour éviter le décalage */}
                          <div className="text-sm min-h-[20px] px-2">{step.name}</div>
                          {/* Hauteur fixe pour la description pour éviter le décalage */}
                          <div className={`
                            text-xs mt-1 min-h-[32px] px-1 line-clamp-2 overflow-hidden
                            ${bookingStep >= step.id ? 'text-gray-300' : 'text-gray-600'}
                          `}>
                            {step.description}
                          </div>
                        </div>
                      </div>
                      
                      {/* Indicateur d'étape actuelle */}
                      {bookingStep === step.id && (
                        <div className="absolute -bottom-2 w-16 h-1 bg-gradient-to-r from-white to-cyan-400 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingHeader;
