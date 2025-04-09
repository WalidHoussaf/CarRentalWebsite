import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

const AvailabilitySection = ({ carId }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [isAvailable, setIsAvailable] = useState(null);
  const [nextAvailableDate, setNextAvailableDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateError, setDateError] = useState(null);

  // Get today's date in YYYY-MM-DD format
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  const todayString = getTodayString();

  // Function to check if a date is valid (not in the past)
  const isValidDate = (dateString) => {
    const selectedDateObj = new Date(dateString);
    selectedDateObj.setHours(0, 0, 0, 0);
    
    const todayDateObj = new Date();
    todayDateObj.setHours(0, 0, 0, 0);
    
    return selectedDateObj >= todayDateObj;
  };

  // Function to check availability
  const checkAvailability = async (date) => {
    setLoading(true);
    setDateError(null);
    
    // Validate date is not in the past
    if (!isValidDate(date)) {
      setIsAvailable(false);
      setDateError(t('cannotSelectPastDate'));
      setLoading(false);
      return;
    }
    
    try {
      // Simulating API call with timeout
      // API call to the backend
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Simulate availability based on car ID and date
      // Replace with actual API call
      const available = Math.random() > 0.3; // 70% chance of being available
      
      setIsAvailable(available);
      
      if (!available && !dateError) {
        // If not available, set next available date to 3-7 days in the future
        const daysToAdd = Math.floor(Math.random() * 5) + 3;
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + daysToAdd);
        setNextAvailableDate(nextDate.toISOString().split('T')[0]);
      }
    } catch (error) {
      console.error("Error checking availability:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle date selection with validation
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    
    if (!isValidDate(newDate)) {
      setDateError(t('cannotSelectPastDate'));
      setIsAvailable(false);
    } else {
      setDateError(null);
      checkAvailability(newDate);
    }
    
    setIsCalendarOpen(false);
  };

  // Handle reservation button click
  const handleReserveNow = () => {
    // Navigate to booking page with car ID and selected date as URL parameters
    navigate(`/booking/${carId}?date=${selectedDate}`);
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', options);
  };

  // Check availability when component mounts or date changes
  useEffect(() => {
    if (isValidDate(selectedDate)) {
      checkAvailability(selectedDate);
    } else {
      setDateError(t('cannotSelectPastDate'));
      setIsAvailable(false);
    }
  }, [carId]);

  // Generate date buttons for the next 3 days
  const generateDateButtons = () => {
    const buttons = [];
    const today = new Date();
    
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      buttons.push(
        <button
          key={i}
          onClick={() => handleDateChange(dateString)}
          className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500/50 rounded-md p-2 text-center transition-colors duration-300 cursor-pointer"
        >
          <div className="text-xs text-gray-400 font-['Orbitron']">
            {date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'short' })}
          </div>
          <div className="text-lg text-white font-['Rationale']">
            {date.getDate()}
          </div>
        </button>
      );
    }
    
    return buttons;
  };

  return (
    <div className="bg-gradient-to-b from-gray-900/40 to-black/20 backdrop-blur-sm border border-gray-800 rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-6">
        {t('availability')}
      </h2>
      
      {/* Custom Date Selector */}
      <div className="mb-6">
        <label className="block text-gray-400 text-sm font-['Orbitron'] mb-2">
          {t('checkAvailabilityFor')}
        </label>
        <div className="relative">
          <div 
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="w-full bg-gray-900 border border-cyan-500/30 rounded-md px-4 py-3 text-white cursor-pointer flex items-center justify-between hover:border-cyan-400/50 hover:bg-gray-800 transition-all duration-300"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center mr-3 ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-['Rationale'] text-lg text-blue-100">
                {formatDateForDisplay(selectedDate)}
              </span>
            </div>
            <div className="text-cyan-400">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${isCalendarOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {/* Calendar Dropdown */}
          {isCalendarOpen && (
            <div className="absolute z-10 mt-2 w-full bg-gray-900 border border-cyan-500/30 rounded-lg shadow-lg shadow-cyan-500/10 overflow-hidden">
              <div className="p-3 border-b border-gray-800 flex justify-between items-center">
                <span className="font-['Orbitron'] text-cyan-400 text-sm">{t('selectDate')}</span>
                <button 
                  onClick={() => setIsCalendarOpen(false)}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-['Rationale']"
                  min={todayString}
                />
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {generateDateButtons()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Availability Status */}
      {loading ? (
        <div className="flex items-center space-x-3 py-4">
          <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-300 font-['Orbitron']">{t('checkingAvailability')}</span>
        </div>
      ) : isAvailable === null ? (
        <div className="py-4">
          <span className="text-gray-400 font-['Orbitron']">{t('selectDateToCheck')}</span>
        </div>
      ) : dateError ? (
        <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-800/30 rounded-lg p-4 flex items-center">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-4 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-red-400 font-['Orbitron'] font-bold">{t('invalidDate')}</p>
            <p className="text-gray-300 text-sm font-['Rationale']">{dateError}</p>
            <p className="text-cyan-400 text-sm font-['Rationale'] mt-1">
              {t('pleaseSelectFromToday')}
            </p>
          </div>
        </div>
      ) : isAvailable ? (
        <div className="bg-gradient-to-r from-green-900/30 to-green-800/20 border border-green-800/30 rounded-lg p-4 flex items-center">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-4 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-green-400 font-['Orbitron'] font-bold">{t('availableExclamation')}</p>
            <p className="text-gray-300 text-2xs font-['Rationale']">{t('vehicleAvailableOn')} {formatDateForDisplay(selectedDate)}</p>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-800/30 rounded-lg p-4 flex items-center">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-4 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p className="text-red-400 font-['Orbitron'] font-bold">{t('notAvailable')}</p>
            <p className="text-gray-300 text-2xs font-['Rationale']">{t('vehicleNotAvailable')}</p>
            {nextAvailableDate && (
              <p className="text-cyan-400 text-2xs font-['Rationale'] mt-1">
                {t('nextAvailableOn')} {formatDateForDisplay(nextAvailableDate)}
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <button 
          className={`px-4 py-2 rounded-md font-['Orbitron'] text-sm flex-1 ${
            isAvailable 
              ? 'bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black shadow-lg shadow-cyan-600/20 hover:shadow-cyan-500/30 cursor-pointer' 
              : 'bg-gray-800 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!isAvailable || loading || dateError}
          onClick={handleReserveNow}
        >
          {t('reserveNow')}
        </button>
        <button 
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-['Orbitron'] text-sm rounded-md flex-1 transition-colors duration-300 cursor-pointer"
          onClick={() => checkAvailability(selectedDate)}
        >
          {t('checkAgain')}
        </button>
      </div>
    </div>
  );
};

export default AvailabilitySection;