import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

// Calendar icon component
const CalendarIconSmall = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path className="stroke-current stroke-1" strokeLinecap="round" d="M6 2v4M18 2v4" strokeWidth="1.2" />
    <rect x="2" y="4" width="20" height="18" rx="2" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M2 10h20" className="stroke-current stroke-1" strokeWidth="1.2" />
    <circle cx="8" cy="15" r="1.5" fill="currentColor" />
    <circle cx="16" cy="15" r="1.5" fill="currentColor" />
    <circle cx="8" cy="19" r="1.5" fill="currentColor" />
    <circle cx="16" cy="19" r="1.5" fill="currentColor" />
  </svg>
);

const BookingCalendar = ({ car, onDateSelection }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 3)));
  
  // Get tomorrow's date for min start date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Calculate total days for preview
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const differenceInTime = endDate.getTime() - startDate.getTime();
    return Math.ceil(differenceInTime / (1000 * 3600 * 24)) || 1;
  };

  const totalDays = calculateDays();
  
  // Handle continue button click
  const handleContinue = () => {
    onDateSelection(startDate, endDate);
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
          {t('selectRentalDates')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative">
            <h3 className="text-lg text-cyan-400 font-['Orbitron'] mb-4 flex items-center">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></span>
              {t('whenStartJourney')}
            </h3>
            
            <div className="space-y-6">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-['Orbitron']">
                  {t('pickupDate')}
                </label>
                <div className="relative group">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                      // If end date is before new start date, adjust it
                      if (endDate < date) {
                        const newEndDate = new Date(date);
                        newEndDate.setDate(date.getDate() + 1);
                        setEndDate(newEndDate);
                      }
                    }}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    minDate={tomorrow}
                    dateFormat="MMMM d, yyyy"
                    className="w-full px-4 py-3 bg-black/80 border border-blue-500/30 rounded-lg text-white font-['Orbitron'] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-300 group-hover:text-cyan-400">
                    <CalendarIconSmall />
                  </div>
                </div>
              </div>
              
              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-['Orbitron']">
                  {t('returnDate')}
                </label>
                <div className="relative group">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={new Date(startDate.getTime() + 86400000)} // +1 day from start date
                    dateFormat="MMMM d, yyyy"
                    className="w-full px-4 py-3 bg-black/80 border border-blue-500/30 rounded-lg text-white font-['Orbitron'] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-300 group-hover:text-cyan-400">
                    <CalendarIconSmall />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Preview Section */}
          <div className="backdrop-blur-sm bg-black/50 p-6 rounded-lg border border-blue-900/30 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden group">
            {/* Luminous glow effect on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 pointer-events-none"></div>
            
            <div className="relative">
              <h3 className="text-lg text-cyan-400 font-['Orbitron'] mb-4 flex items-center">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></span>
                {t('rentalSummary')}
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-['Orbitron'] text-sm">{t('vehicle')}</span>
                  <span className="text-white font-['Orbitron']">{car.name}</span>
                </div>
                
                <div className="h-px bg-gradient-to-r from-transparent via-blue-900/30 to-transparent w-full"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-['Orbitron'] text-sm">{t('pickupDate')}</span>
                  <span className="text-white font-['Orbitron']">
                    {startDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-['Orbitron'] text-sm">{t('returnDate')}</span>
                  <span className="text-white font-['Orbitron']">
                    {endDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                
                <div className="h-px bg-gradient-to-r from-transparent via-blue-900/30 to-transparent w-full"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-['Orbitron'] text-sm">{t('totalDays')}</span>
                  <span className="text-white font-['Orbitron']">{totalDays}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-['Orbitron'] text-sm">{t('dailyRate')}</span>
                  <span className="text-white font-['Orbitron']">${car.price}</span>
                </div>
                
                <div className="h-px bg-gradient-to-r from-transparent via-blue-900/30 to-transparent w-full"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-cyan-400 font-['Orbitron'] font-medium">{t('estimatedTotal')}</span>
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron']">
                    ${car.price * totalDays}
                  </span>
                </div>
                
                <p className="text-gray-500 text-xs font-['Orbitron'] mt-2">
                  {t('finalPriceChange')}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Continue Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleContinue}
            className="px-6 py-3 bg-gradient-to-r from-white to-cyan-400 text-black font-semibold font-['Orbitron'] rounded-md flex items-center justify-center mx-auto hover:from-cyan-400 hover:to-white transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-blue-500/20 cursor-pointer"
          >
            {t('continueToLocation')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
