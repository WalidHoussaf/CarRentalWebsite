import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PayPalCheckout from '../components/Booking/PayPalCheckout';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';

const PayPalCheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Retrieve booking data from location state
  const { bookingDetails, carDetails } = location.state || {};
  
  // Check if booking data is available on mount
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!bookingDetails || !carDetails) {
        setError('Missing booking information');
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [bookingDetails, carDetails]);
  
  // Handle successful payment
  const handlePaymentSuccess = (paymentData) => {
    // Show a brief success message before redirecting
    setIsLoading(true);
    
    setTimeout(() => {
      // Navigate to booking confirmation with payment data
      navigate('/booking-confirmation', { 
        state: { 
          bookingDetails: {
            ...bookingDetails,
            payment: paymentData
          },
          carDetails
        } 
      });
    }, 1000);
  };
  
  // Handle cancel payment
  const handleCancel = () => {
    // Go back to the booking page
    navigate(-1);
  };
  
  // Handle redirect to home if error
  const handleRedirectHome = () => {
    navigate('/');
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-8"></div>
        <h2 className="text-xl font-['Orbitron'] text-cyan-400">{t('processing')}</h2>
      </div>
    );
  }
  
  // Show error state
  if (error || !bookingDetails || !carDetails) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4 font-['Orbitron']">{t('error')}</h2>
        <p className="text-gray-400 mb-8 text-center">{t('paymentSessionExpired')}</p>
        <button 
          onClick={handleRedirectHome}
          className="px-6 py-3 bg-gradient-to-r from-white to-cyan-400 text-black font-medium rounded-md hover:opacity-90 transition-all duration-300"
        >
          {t('backToHome')}
        </button>
      </div>
    );
  }
  
  // Render PayPal checkout
  return (
    <PayPalCheckout 
      bookingDetails={bookingDetails}
      carDetails={carDetails}
      onSuccess={handlePaymentSuccess}
      onCancel={handleCancel}
    />
  );
};

export default PayPalCheckoutPage; 