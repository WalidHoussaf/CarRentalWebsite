import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

// SVG Icons
const LocationPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <circle cx="12" cy="9" r="3" className="fill-current" />
  </svg>
);

const DestinationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M12 7L12 11M12 11L14 9M12 11L10 9" className="stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="12" cy="14" r="1" className="fill-current" />
  </svg>
);

const SummaryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M8 2h8v4H8z" />
    <path d="M12 11h4" />
    <path d="M12 16h4" />
    <path d="M8 11h.01" />
    <path d="M8 16h.01" />
  </svg>
);

const CreditCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h.01M11 15h2" />
    <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth={1.5} />
  </svg>
);

const PayPalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 7h7c1.7 0 3 1.3 3 3s-1.3 3-3 3h-7" />
    <path d="M9.5 10h7c1.7 0 3 1.3 3 3s-1.3 3-3 3h-7" />
    <path d="M6.5 7v9" />
    <path d="M9.5 10v6" />
  </svg>
);

// Function to resolve image paths
const resolvePath = (path) => {
  if (!path || typeof path !== 'string') return null;
  
  console.log('Resolving path:', path);
  
  // If it's a reference to assets (format: "cars.tesla")
  if (path.includes('.')) {
    const parts = path.split('.');
    if (parts.length === 2) {
      const category = parts[0];
      const key = parts[1];
      console.log('Trying to resolve from assets:', category, key);
      const result = assets[category] && assets[category][key];
      console.log('Result:', result);
      return result;
    }
  }
  
  return path;
};

const BookingSummary = ({ car, bookingDetails, bookingStep, onSubmit, onPreviousStep }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [carImage, setCarImage] = useState(null);
  
  // Resolve car image on load and when car changes
  useEffect(() => {
    if (!car) return;
    
    console.log('Car data:', car);
    
    let image = null;
    
    // Attempt 1: Use car.image if it's an asset reference
    if (car.image && typeof car.image === 'string' && car.image.includes('.')) {
      console.log('Trying to resolve from car.image:', car.image);
      image = resolvePath(car.image);
    }
    
    // Attempt 2: Look up by ID (car1, car2, etc.)
    if (!image && car.id && assets.cars[`car${car.id}`]) {
      console.log('Resolving from car ID:', car.id);
      image = assets.cars[`car${car.id}`];
    }
    
    // Attempt 3: Look up by brand name
    if (!image && car.name) {
      const carBrand = car.name.toLowerCase().split(' ')[0];
      console.log('Trying to resolve by car brand:', carBrand);
      
      if (carBrand === 'tesla' && assets.cars.tesla) {
        image = assets.cars.tesla;
      } else if (carBrand === 'bmw' && assets.cars.bmw) {
        image = assets.cars.bmw;
      } else if (carBrand === 'mercedes' && assets.cars.mercedes) {
        image = assets.cars.mercedes;
      }
    }
    
    console.log('Final resolved image:', image);
    setCarImage(image);
  }, [car]);
  
  // Date formatting helper
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // List of available options with pricing
  const availableOptions = [
    { id: 'insurance', name: t('option_insurance'), price: 45 },
    { id: 'driver', name: t('option_driver'), price: 120 },
    { id: 'gps', name: t('option_gps'), price: 15 },
    { id: 'wifi', name: t('option_wifi'), price: 20 },
    { id: 'child_seat', name: t('option_child_seat'), price: 25 },
    { id: 'additional_driver', name: t('option_additional_driver'), price: 30 }
  ];
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      return; // Don't proceed if terms aren't accepted
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit();
      setIsSubmitting(false);
    }, 1500);
  };
  
  // Si pas de voiture, ne rien rendre
  if (!car) return null;
  
  return (
    <div className="relative rounded-xl p-6 overflow-hidden h-auto sticky top-24 mb-12">
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
      
      {/* Border Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-40 z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-40 z-10"></div>
      
      <div className="relative z-10 flex flex-col">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-4 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/30 to-blue-500/20 rounded-lg flex items-center justify-center text-cyan-400 mr-3">
            <SummaryIcon />
          </div>
          {t('bookingSummary')}
        </h2>
        
        {/* Car Info */}
        <div className="flex items-center mb-4 p-3 bg-black/40 rounded-lg border border-blue-900/20 transition-all duration-300 hover:border-cyan-500/30">
          <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 border border-blue-900/30 bg-black/50 flex items-center justify-center">
            {carImage ? (
              <img 
                src={carImage}
                alt={car.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log("Image failed to load:", carImage);
                  e.target.onerror = null;
                  e.target.src = `https://via.placeholder.com/100x100/0f172a/22d3ee?text=${encodeURIComponent(car.name.split(' ')[0])}`;
                }}
              />
            ) : (
              <img 
                src={`https://via.placeholder.com/100x100/0f172a/22d3ee?text=${encodeURIComponent(car.name.split(' ')[0])}`}
                alt={car.name} 
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <h3 className="text-white font-['Orbitron'] font-medium">{car.name}</h3>
            <div className="flex items-center text-sm">
              <span className="text-gray-400 uppercase font-['Orbitron']">{car.category}</span>
              <span className="mx-2 text-gray-600">•</span>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-white font-['Orbitron']">{car.rating}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          {/* Rental Dates */}
          <div className="p-3 bg-gradient-to-r from-black/50 to-blue-900/20 backdrop-blur-sm rounded-lg border-2 border-cyan-500/70 transition-all duration-300 hover:border-cyan-500/90 shadow-lg shadow-cyan-500/20">
            <h4 className="text-cyan-400 text-xs font-['Orbitron'] mb-2 flex items-center">
              <div className="w-1 h-1 bg-cyan-400 rounded-full mr-2"></div>
              {t('rentalPeriod').toUpperCase()}
            </h4>
            {bookingDetails.startDate ? (
              <div className="flex justify-between">
                <div className="text-white font-['Orbitron'] text-sm">
                  <span className="text-cyan-400 font-bold text-base">{formatDate(bookingDetails.startDate)} - {formatDate(bookingDetails.endDate)}</span>
                  <div className="text-cyan-400 text-xs mt-1 opacity-100">{bookingDetails.totalDays} {t('days')}</div>
                </div>
                <div className="text-white font-['Orbitron'] text-sm">
                  ${car.price * bookingDetails.totalDays}
                </div>
              </div>
            ) : (
              <div className="text-cyan-400 text-sm font-['Orbitron']">{t('notSelectedYet')}</div>
            )}
          </div>
          
          {/* Locations */}
          <div className="p-3 bg-black/30 backdrop-blur-sm rounded-lg border border-blue-900/20 transition-all duration-300 hover:border-cyan-500/30">
            <h4 className="text-cyan-400 text-xs font-['Orbitron'] mb-2 flex items-center">
              <div className="w-1 h-1 bg-cyan-400 rounded-full mr-2"></div>
              {t('pickupReturnTitle')}
            </h4>
            {bookingStep >= 2 && bookingDetails.pickupLocation ? (
              <div className="text-white font-['Orbitron'] text-sm">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 flex-shrink-0 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 mr-2">
                    <LocationPinIcon />
                  </div>
                  <span>{t('pickupLabel')}: {bookingDetails.pickupLocation?.charAt(0).toUpperCase() + bookingDetails.pickupLocation?.slice(1)}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 mr-2">
                    <DestinationIcon />
                  </div>
                  <span>{t('returnLabel')}: {bookingDetails.dropoffLocation?.charAt(0).toUpperCase() + bookingDetails.dropoffLocation?.slice(1)}</span>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm font-['Orbitron']">{t('notSelectedYet')}</div>
            )}
          </div>
          
          {/* Selected Options */}
          <div className="p-3 bg-black/30 backdrop-blur-sm rounded-lg border border-blue-900/20 transition-all duration-300 hover:border-cyan-500/30">
            <h4 className="text-cyan-400 text-xs font-['Orbitron'] mb-2 flex items-center">
              <div className="w-1 h-1 bg-cyan-400 rounded-full mr-2"></div>
              {t('selectedAddOns')}
            </h4>
            {bookingStep >= 3 && bookingDetails.options && bookingDetails.options.length > 0 ? (
              <div className="space-y-2">
                {bookingDetails.options.map((optionId, index) => {
                  // Afficher au maximum 3 options
                  if (index >= 3) return null;
                  
                  const option = availableOptions.find(opt => opt.id === optionId);
                  return option ? (
                    <div key={optionId} className="flex justify-between text-sm">
                      <span className="text-gray-300 font-['Orbitron'] flex items-center">
                        <span className="w-1 h-1 bg-cyan-400 rounded-full mr-2 opacity-60"></span>
                        {option.name}
                      </span>
                      <span className="text-white font-['Orbitron']">${option.price}</span>
                    </div>
                  ) : null;
                })}
                {bookingDetails.options.length > 3 && (
                  <div className="text-gray-400 text-xs text-right italic">
                    +{bookingDetails.options.length - 3} {t('moreOptions')}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500 text-sm font-['Orbitron']">{t('notSelectedYet')}</div>
            )}
          </div>
          
          {/* Map Preview */}
          <div className="backdrop-blur-sm bg-black/50 p-6 rounded-lg border border-blue-900/30 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden group">
            {/* Luminous glow effect on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 pointer-events-none"></div>
            
            <div className="relative">
              <h3 className="text-lg text-cyan-400 font-['Orbitron'] mb-4 flex items-center">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></span>
                {t('rentalSummary')}
              </h3>
              
              {/* ... existing code ... */}
            </div>
          </div>
        </div>
        
        <div className="h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent w-full my-3"></div>
        
        {/* Total */}
        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-black/60 to-blue-900/30 backdrop-blur-sm rounded-lg border border-blue-900/50 mb-4">
          <span className="text-cyan-400 font-['Orbitron'] font-medium">{t('totalAmount')}</span>
          <span className="text-2xl font-bold text-cyan-400 font-['Orbitron']">
            ${bookingDetails.totalPrice || (car.price * (bookingDetails.totalDays || 1))}
          </span>
        </div>
        
        {/* Action Buttons Based on Step */}
        <div className="mt-4">
          {bookingStep < 4 ? (
            <div className="text-center">
              <div className="px-6 py-3 bg-gradient-to-r from-black/60 to-blue-900/30 backdrop-blur-sm rounded-lg border border-cyan-400/30 text-cyan-400 text-sm font-['Orbitron'] shadow-lg shadow-cyan-500/10">
                {t('completeStepsToBook')}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Payment Method */}
              <div className="p-3 bg-black/30 backdrop-blur-sm rounded-lg border border-blue-900/20">
                <h4 className="text-cyan-400 text-xs font-['Orbitron'] mb-3 flex items-center">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full mr-2"></div>
                  {t('paymentMethod')}
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center p-2 rounded-lg border border-blue-900/20 bg-black/30 transition-all duration-300 hover:border-cyan-500/30">
                    <label htmlFor="creditCard" className="flex items-center cursor-pointer w-full">
                      <div className="relative flex items-center justify-center w-4 h-4">
                        <input
                          type="radio"
                          id="creditCard"
                          name="paymentMethod"
                          value="creditCard"
                          checked={paymentMethod === 'creditCard'}
                          onChange={() => setPaymentMethod('creditCard')}
                          className="w-4 h-4 opacity-0 absolute cursor-pointer"
                        />
                        <div className={`w-4 h-4 border border-gray-700 rounded-full ${paymentMethod === 'creditCard' ? 'border-cyan-400' : ''}`}></div>
                        {paymentMethod === 'creditCard' && (
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full absolute"></div>
                        )}
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/20 flex items-center justify-center text-cyan-400 mx-2">
                        <CreditCardIcon />
                      </div>
                      <span className="text-sm text-white font-['Orbitron']">
                        {t('creditCard')}
                      </span>
                    </label>
                  </div>
                  
                  <div className="flex items-center p-2 rounded-lg border border-blue-900/20 bg-black/30 transition-all duration-300 hover:border-cyan-500/30">
                    <label htmlFor="paypal" className="flex items-center cursor-pointer w-full">
                      <div className="relative flex items-center justify-center w-4 h-4">
                        <input
                          type="radio"
                          id="paypal"
                          name="paymentMethod"
                          value="paypal"
                          checked={paymentMethod === 'paypal'}
                          onChange={() => setPaymentMethod('paypal')}
                          className="w-4 h-4 opacity-0 absolute cursor-pointer"
                        />
                        <div className={`w-4 h-4 border border-gray-700 rounded-full ${paymentMethod === 'paypal' ? 'border-cyan-400' : ''}`}></div>
                        {paymentMethod === 'paypal' && (
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full absolute"></div>
                        )}
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/20 flex items-center justify-center text-cyan-400 mx-2">
                        <PayPalIcon />
                      </div>
                      <span className="text-sm text-white font-['Orbitron']">
                        PayPal
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Terms Checkbox */}
              <div className="flex items-start p-3 bg-black/30 backdrop-blur-sm rounded-lg border border-blue-900/20">
                <div className="relative mt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 appearance-none bg-black border border-gray-700 rounded checked:bg-cyan-400 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 cursor-pointer"
                  />
                  <div className={`absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-300 ${termsAccepted ? 'opacity-100' : 'opacity-0'}`}>
                    <svg className="w-3 h-3 text-black" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <label htmlFor="terms" className="ml-2 text-xs text-gray-400 font-['Orbitron']">
                  {t('agreeToTerms_booking')} <a href="#" className="text-cyan-400 hover:underline transition-all duration-300">{t('termsConditions')}</a> {t('andPrivacy')} <a href="#" className="text-cyan-400 hover:underline transition-all duration-300">{t('privacyPolicy')}</a>
                </label>
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex flex-col space-y-3 mb-8">
                <button
                  type="submit"
                  disabled={!termsAccepted || isSubmitting}
                  className={`
                    w-full px-6 py-3 bg-gradient-to-r from-white to-cyan-400 text-black font-semibold font-['Orbitron'] 
                    rounded-md transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-blue-500/20
                    flex items-center justify-center
                    ${!termsAccepted ? 'opacity-50 cursor-not-allowed' : 'hover:from-cyan-400 hover:to-white cursor-pointer'}
                    ${isSubmitting ? 'animate-pulse' : ''}
                  `}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('processing')}
                    </span>
                  ) : (
                    <>
                      {t('confirmAndBook_now')}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={onPreviousStep}
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-black/50 border border-blue-900/30 hover:border-cyan-500/50 text-cyan-400 font-medium font-['Orbitron'] rounded-md transition-all duration-300 flex items-center justify-center group cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {t('backToOptions')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
