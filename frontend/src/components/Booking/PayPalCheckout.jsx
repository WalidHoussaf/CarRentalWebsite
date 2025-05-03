import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';
import { createPayPalPayment, executePayPalPayment } from '../../services/paypalService';

const PayPalCheckout = ({ bookingDetails, carDetails, onSuccess, onCancel }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [formFocus, setFormFocus] = useState(null);
  
  // Animation effects
  useEffect(() => {
    const elements = document.querySelectorAll('.animate-in');
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('show');
      }, 100 * index);
    });
  }, []);
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!email.trim()) {
      setError(t('email') + ' ' + t('is required'));
      return;
    }
    
    if (!password.trim()) {
      setError(t('password') + ' ' + t('is required'));
      return;
    }
    
    // Clear error
    setError(null);
    
    // Show processing state
    setIsProcessing(true);
    
    try {
      // 1. Create the PayPal payment
      const paymentData = {
        amount: bookingDetails.totalPrice,
        currency: 'USD',
        description: `Car Rental: ${carDetails.name} - ${bookingDetails.totalDays} days`,
        bookingId: `booking-${Date.now()}`,
        items: [
          {
            name: carDetails.name,
            description: `${bookingDetails.totalDays} days rental`,
            amount: carDetails.price * bookingDetails.totalDays
          },
          ...(bookingDetails.options?.length > 0 
            ? [{ 
                name: 'Additional Options', 
                description: `${bookingDetails.options.length} options`, 
                amount: bookingDetails.optionsPrice || 0 
              }] 
            : []
          )
        ]
      };
      
      const paymentCreationResponse = await createPayPalPayment(paymentData);
      
      // 2. Execute the payment
      const paymentExecutionData = {
        paymentId: paymentCreationResponse.paymentId,
        email: email,
        payerId: `PAYERID-${Date.now()}`
      };
      
      const paymentExecutionResponse = await executePayPalPayment(paymentExecutionData);
      
      // 3. Handle successful payment
      onSuccess({
        payment_id: paymentExecutionResponse.paymentId,
        transaction_id: paymentExecutionResponse.transactionId,
        payment_method: 'paypal',
        payment_status: paymentExecutionResponse.status,
        payer_email: email,
        amount: bookingDetails.totalPrice,
        currency: 'USD',
        completed_at: paymentExecutionResponse.completedAt
      });
      
    } catch (err) {
      console.error('Payment error:', err);
      setError(t('paymentError') || 'Error processing payment. Please try again.');
      setIsProcessing(false);
    }
  };
  
  // Handle focus state
  const handleFocus = (field) => {
    setFormFocus(field);
  };
  
  const handleBlur = () => {
    setFormFocus(null);
  };
  
  // Handle cancel
  const handleCancel = () => {
    onCancel();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black text-blue-100 pt-16 pb-16 px-4 relative overflow-hidden font-['Orbitron']">
      
      {/* Enhanced Glowing Circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-blue-700 to-blue-600 rounded-full opacity-4 blur-3xl z-0 animate-pulse-slow"></div>
      <div className="absolute top-1/3 -left-20 w-40 h-40 bg-gradient-to-tr from-blue-600 to-teal-600 rounded-full opacity-4 blur-2xl z-0 animate-float-slow"></div>      
      
      <div className="max-w-xl mx-auto relative z-10">
        {/* PayPal Header */}
        <div className="text-center mb-12 relative animate-in">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-40 absolute bottom-0 left-0"></div>
          
          <div className="flex justify-center mb-5 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700/20 to-blue-600/20 blur-xl"></div>
            <div className="relative flex transform hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="bg-gradient-to-br from-[#253b80] to-[#1a2a56] px-4 py-2 rounded-l-md text-3xl font-bold shadow-lg">Pay</div>
              <div className="bg-gradient-to-br from-[#179bd7] to-[#0e6b96] px-4 py-2 rounded-r-md text-3xl font-bold shadow-lg">Pal</div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 mb-2 shadow-text-subtle">
            {t('completeYourPayment')}
          </h1>
          
          <p className="text-gray-500 text-lg">
            {t('securePaymentProcessing')}
          </p>
        </div>
        
        {/* Order Summary - Enhanced Card with 3D effect */}
        <div className="card-3d-container mb-8 animate-in">
          <div className="card-3d-wrapper">
            <div className="card-3d bg-gradient-to-br from-gray-900/90 via-blue-950/50 to-gray-900/80 backdrop-blur-sm rounded-xl border border-blue-900/30 p-6 shadow-[0_0_15px_rgba(30,64,175,0.15)]">
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 mb-5 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-700/40 to-blue-800/30 rounded-lg flex items-center justify-center text-blue-400 mr-3 shadow-glow-subtle transform hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <path d="M8 2h8v4H8z" />
                    <path d="M12 11h4" />
                    <path d="M12 16h4" />
                    <path d="M8 11h.01" />
                    <path d="M8 16h.01" />
                  </svg>
                </div>
                {t('orderSummary')}
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between mb-2 items-center p-4 bg-black/70 backdrop-blur-md rounded-lg border border-blue-900/20 transition-all duration-300 hover:border-blue-700/40 hover:translate-x-1 hover:shadow-glow-subtle cursor-pointer">
                  <span className="text-gray-400 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13" rx="2" />
                      <path d="M16 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-2" />
                      <circle cx="5.5" cy="13.5" r="1.5" />
                      <circle cx="11.5" cy="13.5" r="1.5" />
                    </svg>
                    {carDetails?.name} - {bookingDetails?.totalDays} {t('days')}
                  </span>
                  <span className="text-blue-300 font-medium">
                    {formatCurrency(carDetails?.price * bookingDetails?.totalDays)}
                  </span>
                </div>
                
                {bookingDetails?.options && bookingDetails.options.length > 0 && (
                  <div className="flex justify-between mb-2 items-center p-4 bg-black/70 backdrop-blur-md rounded-lg border border-blue-900/20 transition-all duration-300 hover:border-blue-700/40 hover:translate-x-1 hover:shadow-glow-subtle cursor-pointer">
                    <span className="text-gray-400 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 12h8" />
                        <path d="M12 8v8" />
                      </svg>
                      {t('additionalOptions')}
                    </span>
                    <span className="text-blue-300 font-medium">
                      {formatCurrency(bookingDetails?.optionsPrice || 0)}
                    </span>
                  </div>
                )}
                
                <div className="p-4 bg-gradient-to-r from-blue-950/80 to-blue-900/30 backdrop-blur-md rounded-lg border border-blue-800/30 mt-4 cursor-pointer">
                  <div className="flex justify-between font-bold items-center">
                    <span className="text-blue-200 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4" />
                        <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                        <path d="M18 12a2 2 0 000 4h4v-4z" />
                      </svg>
                      {t('total')}
                    </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 text-xl">
                      {formatCurrency(bookingDetails?.totalPrice || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* PayPal Login Form - Enhanced */}
        <div className="bg-gradient-to-br from-gray-900/90 via-blue-950/40 to-gray-900/80 backdrop-blur-sm rounded-xl border border-blue-900/30 p-6 shadow-[0_0_20px_rgba(30,64,175,0.15)] animate-in hover:shadow-[0_0_25px_rgba(30,64,175,0.2)] transition-all duration-500">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-gradient-to-r from-red-900/60 to-red-950/60 border border-red-800/30 text-red-400 px-5 py-4 rounded-lg text-sm flex items-center shadow-glow-error-subtle animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
            
            <div className="animate-in">
              <label htmlFor="email" className="block text-base font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 mb-2">
                {t('email')}
              </label>
              <div className={`relative transition-all duration-300 ${formFocus === 'email' ? 'transform scale-[1.02]' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors duration-300 ${formFocus === 'email' ? 'text-blue-400' : 'text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  className="w-full pl-12 pr-4 py-4 bg-black/80 border border-gray-800 focus:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700/30 text-blue-100 transition-all duration-300 shadow-inner"
                  placeholder="email@example.com"
                />
                {formFocus === 'email' && (
                  <div className="absolute inset-0 -z-10 rounded-lg bg-blue-600/10 blur-md animate-pulse-slow"></div>
                )}
              </div>
            </div>
            
            <div className="animate-in">
              <label htmlFor="password" className="block text-base font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 mb-2">
                {t('paypalPassword')}
              </label>
              <div className={`relative transition-all duration-300 ${formFocus === 'password' ? 'transform scale-[1.02]' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-colors duration-300 ${formFocus === 'password' ? 'text-blue-400' : 'text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => handleFocus('password')}
                  onBlur={handleBlur}
                  className="w-full pl-12 pr-4 py-4 bg-black/80 border border-gray-800 focus:border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700/30 text-blue-100 transition-all duration-300 shadow-inner"
                  placeholder="••••••••••"
                />
                {formFocus === 'password' && (
                  <div className="absolute inset-0 -z-10 rounded-lg bg-blue-600/10 blur-md animate-pulse-slow"></div>
                )}
              </div>
            </div>
            
            <div className="pt-6 flex flex-col space-y-4 animate-in">
              <button
                type="submit"
                disabled={isProcessing}
                className="neon-button w-full px-6 py-4 bg-gradient-to-r from-[#0070ba] to-[#1546a0] hover:from-[#0078c8] hover:to-[#1a51b8] rounded-lg font-medium transition-all duration-300 flex items-center justify-center shadow-[0_0_15px_rgba(0,112,186,0.2)] hover:shadow-[0_0_20px_rgba(0,112,186,0.3)] relative overflow-hidden group cursor-pointer"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                {isProcessing ? (
                  <div className="flex items-center">
                    <svg className="animate-spin h-6 w-6 mr-3 text-blue-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-lg">{t('processing')}</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="text-lg">{t('payNow')}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="w-full px-6 py-3 bg-transparent border border-gray-700 hover:border-blue-700/40 hover:bg-black/40 rounded-lg font-medium transition-all duration-300 text-gray-400 hover:text-blue-200 group cursor-pointer"
              >
                <span className="inline-block group-hover:translate-x-[-2px] transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </span>
                {t('cancel')}
              </button>
              
              <div className="text-center text-sm text-gray-500 mt-4 animate-in">
                <div className="bg-gradient-to-r from-blue-950/80 to-blue-900/30 border border-blue-900/30 rounded-lg p-5 mt-2 transform transition-transform duration-300 hover:scale-[1.02] cursor-pointer">
                  <div className="flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-blue-400 text-center">{t('paypalSandboxMode')}</p>
                  </div>
                  <p className="text-gray-500 text-center">{t('anyEmailPasswordWillWork')}</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PayPalCheckout; 