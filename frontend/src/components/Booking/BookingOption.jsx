import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

// Icônes SVG pour les options
const InsuranceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M12 4L6 7v4c0 3.7 2.56 7.16 6 8 3.44-.84 6-4.3 6-8V7l-6-3z" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M9 12l2 2 4-4" className="stroke-current stroke-1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DriverIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <circle cx="12" cy="7" r="4" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" className="stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M16 11l2-1.5M8 11l-2-1.5" className="stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M12 13v4M12 17l-2 2M12 17l2 2" className="stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GpsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <circle cx="12" cy="12" r="9" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <circle cx="12" cy="12" r="3" className="fill-current" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" className="stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" className="stroke-current stroke-1" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const WifiIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 19.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" className="fill-current" />
    <path d="M12 15c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0-3c-3.87 0-7 3.13-7 7" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M12 12c4.97 0 9 4.03 9 9" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M12 9c-6.07 0-11 4.93-11 11" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M12 9c6.63 0 12 5.37 12 12" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const ChildSeatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M6 9h12v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9z" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M10 2L8 9h8l-2-7" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M8 12h8M8 15h8M8 18h8" className="stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="12" cy="5" r="1" className="fill-current" />
  </svg>
);

const AdditionalDriverIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <circle cx="9" cy="7" r="3" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M4 21v-2a4 4 0 014-4h2a4 4 0 014 4v2" className="stroke-current stroke-1" strokeWidth="1.2" />
    <circle cx="17" cy="10" r="2.5" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M14 21v-1a3 3 0 013-3h0a3 3 0 013 3v1" className="stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M15 7h4" className="stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const RoadsideAssistanceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M7 4h10l2 5h-14z" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M4 9h16v4h-16z" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <circle cx="8" cy="18" r="2" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <circle cx="16" cy="18" r="2" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M10 18h4" className="stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M14 4l1 4M10 4l-1 4" className="stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M6 13h2m4 0h2m4 0h2" className="stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const getOptionIcon = (iconId) => {
  switch(iconId) {
    case 'insurance': return <InsuranceIcon />;
    case 'driver': return <DriverIcon />;
    case 'gps': return <GpsIcon />;
    case 'wifi': return <WifiIcon />;
    case 'child_seat': return <ChildSeatIcon />;
    case 'additional_driver': return <AdditionalDriverIcon />;
    case 'roadside_assistance': return <RoadsideAssistanceIcon />;
    default: return null;
  }
};

const BookingOption = ({ car, bookingDetails, onOptionSelection, onPreviousStep }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  // Available options with pricing
  const availableOptions = [
    { 
      id: 'insurance', 
      name: t('option_insurance'), 
      description: t('option_insurance_desc'), 
      price: 45,
      icon: 'insurance'
    },
    { 
      id: 'driver', 
      name: t('option_driver'), 
      description: t('option_driver_desc'), 
      price: 120,
      icon: 'driver'
    },
    { 
      id: 'gps', 
      name: t('option_gps'), 
      description: t('option_gps_desc'), 
      price: 15,
      icon: 'gps'
    },
    { 
      id: 'wifi', 
      name: t('option_wifi'), 
      description: t('option_wifi_desc'), 
      price: 20,
      icon: 'wifi'
    },
    { 
      id: 'child_seat', 
      name: t('option_child_seat'), 
      description: t('option_child_seat_desc'), 
      price: 15,
      icon: 'child_seat'
    },
    { 
      id: 'roadside_assistance', 
      name: t('option_roadside_assistance'), 
      description: t('option_roadside_assistance_desc'), 
      price: 25,
      icon: 'roadside_assistance'
    }
  ];
  
  // State for selected options
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  // Calculate additional price
  const calculateAdditionalPrice = () => {
    return selectedOptions.reduce((total, optionId) => {
      const option = availableOptions.find(opt => opt.id === optionId);
      return total + (option ? option.price : 0);
    }, 0);
  };
  
  // Base price calculation
  const basePrice = car ? car.price * bookingDetails.totalDays : 0;
  const additionalPrice = calculateAdditionalPrice();
  const totalPrice = basePrice + additionalPrice;
  
  // Toggle option selection
  const toggleOption = (optionId) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };
  
  // Handle continue button click
  const handleContinue = () => {
    onOptionSelection(selectedOptions, additionalPrice);
  };
  
  return (
    <div className="relative rounded-xl p-6 md:p-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950/70 to-black z-0"></div>
      
      {/* Animated Grid Lines */}
      <div className="absolute inset-0 opacity-15 z-0 bg-grid-scan"></div>
      
      {/* Tech Lines */}
      <div className="absolute inset-0 opacity-10 z-0 bg-tech-lines"></div>
      
      {/* Data Stream */}
      <div className="absolute inset-0 opacity-8 z-0 bg-data-stream"></div>
      
      {/* Glowing Circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full opacity-8 blur-xl z-0 floating-light"></div>
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-500 rounded-full opacity-8 blur-xl z-0 floating-light-slow"></div>
      
      {/* Digital Circuit Lines */}
      <div className="absolute bottom-0 left-0 w-full h-32 opacity-15 bg-circuit-pattern z-0"></div>
      
      {/* Border Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-40 z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-40 z-10"></div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-6">
          {t('enhanceExperience')}
        </h2>
        
        <p className="text-gray-400 font-['Orbitron'] text-sm mb-8">
          {t('selectAddOns').replace('{carName}', car.name)}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableOptions.map((option) => (
            <div 
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`
                p-5 backdrop-blur-sm border rounded-lg cursor-pointer transition-all duration-300 relative overflow-hidden
                ${selectedOptions.includes(option.id) 
                  ? 'border-cyan-500/60 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 hover:shadow-lg hover:shadow-cyan-500/20' 
                  : 'border-blue-900/20 bg-black/40 hover:border-cyan-500/30 hover:bg-black/50'}
                transform hover:scale-[1.02] hover:-translate-y-0.5
              `}
            >
              {/* Ambient background */}
              <div className="absolute inset-0 -z-10 opacity-70">
                {selectedOptions.includes(option.id) && (
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 via-transparent to-blue-900/10"></div>
                )}
              </div>
              
              {/* Inner glow for selected items */}
              {selectedOptions.includes(option.id) && (
                <div className="absolute inset-0 -z-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/5"></div>
                </div>
              )}
              
              <div className="flex items-start relative z-10">
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center text-2xl mr-4 transition-all duration-300
                  ${selectedOptions.includes(option.id) 
                    ? 'bg-gradient-to-br from-cyan-500/30 to-blue-500/20 text-white shadow-md' 
                    : 'bg-black/70 border border-blue-900/30 text-gray-400'}
                `}>
                  {getOptionIcon(option.icon)}
                </div>
                
                <div className="flex-1 pr-20">
                  <h3 className={`
                    font-['Orbitron'] font-medium transition-all duration-300
                    ${selectedOptions.includes(option.id) ? 'text-cyan-400' : 'text-white'}
                  `}>
                    {option.name}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1 font-['Orbitron']">{option.description}</p>
                </div>
              </div>
              
              {/* Price */}
              <div className={`
                absolute right-5 bottom-5 font-['Orbitron'] font-bold transition-all duration-300
                ${selectedOptions.includes(option.id) 
                  ? 'text-white' 
                  : 'text-cyan-400'}
              `}>
                ${option.price}
              </div>
              
              {/* Checkbox */}
              <div className={`
                w-5 h-5 border rounded-md flex items-center justify-center absolute top-5 right-5 transition-all duration-300
                ${selectedOptions.includes(option.id) 
                  ? 'border-cyan-400 bg-cyan-400 text-black' 
                  : 'border-gray-600'}
              `}>
                {selectedOptions.includes(option.id) && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Price Summary */}
        <div className="mt-10 backdrop-blur-sm bg-black/50 p-6 rounded-lg border border-blue-900/30 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden group">
          {/* Luminous glow effect on hover */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 pointer-events-none"></div>
          
          <div className="relative">
            <h3 className="text-lg text-cyan-400 font-['Orbitron'] mb-4 flex items-center">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></span>
              {t('priceSummary')}
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-['Orbitron'] text-sm">
                  {t('baseRate').replace('{price}', car.price).replace('{days}', bookingDetails.totalDays)}
                </span>
                <span className="text-white font-['Orbitron']">${basePrice}</span>
              </div>
              
              {selectedOptions.length > 0 && (
                <>
                  <div className="h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent w-full my-3"></div>
                  
                  {selectedOptions.map(optionId => {
                    const option = availableOptions.find(opt => opt.id === optionId);
                    return (
                      <div key={optionId} className="flex justify-between items-center">
                        <span className="text-gray-400 font-['Orbitron'] text-sm flex items-center">
                          <span className="w-1 h-1 bg-cyan-400 rounded-full mr-2 opacity-60"></span>
                          {option.name}
                        </span>
                        <span className="text-white font-['Orbitron']">${option.price}</span>
                      </div>
                    );
                  })}
                </>
              )}
              
              <div className="h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent w-full my-3"></div>
              
              <div className="flex justify-between items-center font-medium">
                <span className="text-cyan-400 font-['Orbitron']">{t('totalAmount')}</span>
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron']">
                  ${totalPrice}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={onPreviousStep}
            className="px-6 py-3 bg-black/50 border border-blue-900/30 hover:border-cyan-500/50 text-cyan-400 font-medium font-['Orbitron'] rounded-md transition-all duration-300 flex items-center group cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('backToLocation')}
          </button>
          
          <button
            onClick={handleContinue}
            className="px-6 py-3 bg-gradient-to-r from-white to-cyan-400 text-black font-semibold font-['Orbitron'] rounded-md flex items-center justify-center hover:from-cyan-400 hover:to-white transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-blue-500/20 cursor-pointer"
          >
            {t('continueToSummary')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingOption;
