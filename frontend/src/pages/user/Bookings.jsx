import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../context/BookingContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';
import PageTitle from '../../components/common/PageTitle';
import Modal from '../../components/common/Modal';
import { assets } from '../../assets/assets';

// Map car names to image paths in the assets
const getCarImage = (carName) => {
  const carNameToImageMap = {
    'Mercedes-Benz S-Class': assets.cars.car1,
    'Rolls-Royce Boat Tail': assets.cars.car2,
    'Audi A8 L': assets.cars.car3,
    'Porsche 911 Carrera': assets.cars.car4,
    'Range Rover Sport': assets.cars.car5,
    'McLaren 720S': assets.cars.car6,
    'Ferrari Roma': assets.cars.car7,
    'Lamborghini Huracán': assets.cars.car8,
    'Bentley Continental GT': assets.cars.car9,
    'Mercedes-AMG GT': assets.cars.car10,
    'BMW M5': assets.cars.car11,
    'Aston Martin DB11': assets.cars.car12,
    'Lexus LC 500': assets.cars.car13,
    'Bugatti Veyron': assets.cars.car14,
    'Maserati GranTurismo': assets.cars.car15,
    'Jaguar F-Type': assets.cars.car16
  };
  
  // Return the matched image or a fallback image if not found
  return carNameToImageMap[carName] || assets.cars.car1;
};

const Bookings = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { bookings: contextBookings, loading: bookingsLoading, error: bookingsError, fetchUserBookings, updateBookingStatus } = useBooking();
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  // Local state to handle loading and bookings
  const [localBookings, setLocalBookings] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(null);
  
  // Modal state for booking details
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Booking cancellation
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  
  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Helper to format currency
  const formatCurrency = (amount) => {
    return typeof amount === 'number' 
      ? amount.toFixed(2) 
      : parseFloat(amount || 0).toFixed(2);
  };
  
  // Helper to safely parse and handle options
  const parseOptions = (options) => {
    if (!options) return [];
    
    // Option definitions with prices - exact values from the screenshot with only the 6 options shown
    const optionDefinitions = {
      'roadside_assistance': { id: 'roadside_assistance', name: 'Roadside Assistance', price: 25.00 },
      'wifi': { id: 'wifi', name: 'WiFi Hotspot', price: 20.00 },
      'child_seat': { id: 'child_seat', name: 'Child Seat', price: 15.00 },
      'gps': { id: 'gps', name: 'GPS Navigation', price: 15.00 },
      'insurance': { id: 'insurance', name: 'Premium Insurance', price: 45.00 },
      'driver': { id: 'driver', name: 'Professional Driver', price: 120.00 }
    };
    
    // If options is a string, try to parse it
    if (typeof options === 'string') {
      try {
        options = JSON.parse(options);
        console.log('Successfully parsed options JSON:', options);
      } catch {
        // If not valid JSON, it might be a comma-separated list
        if (options.includes(',')) {
          options = options.split(',').map(opt => opt.trim());
          console.log('Parsed options as comma-separated list:', options);
        } else {
          // Single option as string
          options = [options];
          console.log('Using single option as array:', options);
        }
      }
    }
    
    // If options is already an array, process it
    if (Array.isArray(options)) {
      return options
        .map(option => {
          // If the option is just a string ID, map it to the full option object
          if (typeof option === 'string' && optionDefinitions[option]) {
            return optionDefinitions[option];
          }
          // If it's an object with just an ID but no price/name, enhance it
          else if (typeof option === 'object' && option.id && optionDefinitions[option.id]) {
            return {
              ...option,
              name: option.name || optionDefinitions[option.id].name,
              price: option.price || optionDefinitions[option.id].price
            };
          }
          // If it's not one of our 6 defined options, skip it
          else if (typeof option === 'string' || (typeof option === 'object' && option.id)) {
            const id = typeof option === 'string' ? option : option.id;
            if (!optionDefinitions[id]) {
              console.log('Skipping unknown option:', id);
              return null;
            }
          }
          // Return as is for any other case
          return option;
        })
        .filter(Boolean); // Filter out null values (skipped options)
    }
    
    // If options is an object but not an array, convert it to array
    if (typeof options === 'object') {
      // Map object entries to options with proper names and prices
      return Object.entries(options)
        .map(([key, value]) => {
          // If the value is a string ID and we have a definition for it
          if (typeof value === 'string' && optionDefinitions[value]) {
            return optionDefinitions[value];
          }
          // If the key is a valid option ID, use its definition
          else if (optionDefinitions[key]) {
            return {
              ...optionDefinitions[key],
              ...(typeof value === 'object' ? value : {})
            };
          }
          // Skip if not one of our 6 defined options
          return null;
        })
        .filter(Boolean); // Filter out null values
    }
    
    return [];
  };
  
  // Calculate options price safely
  const calculateOptionsPrice = (options) => {
    if (!options) return 0;
    
    // Get parsed options
    const parsedOptions = Array.isArray(options) ? options : parseOptions(options);
    
    // Calculate total
    const total = parsedOptions.reduce((total, option) => {
      // Try to parse price as number
      const price = parseFloat(option.price || 0);
      return total + (isNaN(price) ? 0 : price);
    }, 0);
    
    return total;
  };
  
  // Function to force refresh bookings from the database
  const handleRefreshBookings = async () => {
    setLocalLoading(true);
    try {
      // Clear any local bookings first to ensure we fetch fresh data
      setLocalBookings([]);
      // Fetch bookings directly from the API
      const apiBookings = await fetchUserBookings();
      if (apiBookings && apiBookings.length > 0) {
        setLocalBookings(apiBookings);
      }
    } catch (error) {
      console.error('Error refreshing bookings:', error);
      setLocalError(`Failed to refresh bookings: ${error.message}`);
    } finally {
      setLocalLoading(false);
    }
  };
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Load bookings from the database
  useEffect(() => {
    const loadBookings = async () => {
      console.log('Loading bookings effect triggered');
      setLocalLoading(true);
      
      try {
        if (isAuthenticated && user) {
          console.log('Fetching bookings from API');
          const apiBookings = await fetchUserBookings();
          
          if (apiBookings) {
            console.log('Successfully loaded bookings from API:', apiBookings.length);
            setLocalBookings(apiBookings);
          }
        }
      } catch (error) {
        console.error('Error loading bookings:', error);
        setLocalError('Error loading bookings from database.');
      } finally {
        setLocalLoading(false);
      }
    };
    
    if (isAuthenticated && user) {
      loadBookings();
    }
  }, [isAuthenticated, user]); 

  // Handle booking details view
  const handleViewDetails = (booking) => {
    console.log('Viewing booking details:', booking);
    console.log('Raw booking options before processing:', booking.options);
    
    // Process options if they exist
    if (booking.options) {
      let options = booking.options;
      
      // Handle options if they're stored as a string in the database
      if (typeof options === 'string') {
        try {
          // Try parsing as JSON first
          options = JSON.parse(options);
          console.log('Successfully parsed options JSON:', options);
        } catch {
          // If not valid JSON, it might be a comma-separated list
          if (options.includes(',')) {
            options = options.split(',').map(opt => opt.trim());
            console.log('Parsed options as comma-separated list:', options);
          } else {
            // Single option as string
            options = [options];
            console.log('Using single option as array:', options);
          }
        }
      }
      
      // Parse and enhance options with proper names and prices
      let parsedOptions = parseOptions(options);
      booking.options = parsedOptions;
      
      // Always recalculate options price based on our defined prices
      booking.options_price = calculateOptionsPrice(parsedOptions);
      console.log('Calculated options price:', booking.options_price);
      
      // Update the total_price to include the car_price * total_days + options_price
      const basePrice = booking.car_price * booking.total_days;
      booking.total_price = basePrice + booking.options_price;
      console.log('Updated total price:', booking.total_price, '(Base:', basePrice, '+ Options:', booking.options_price, ')');
      
      console.log('Processed options with proper names:', parsedOptions);
    } else {
      // Ensure options is an array and options_price is 0 if no options
      booking.options = [];
      booking.options_price = 0;
    }
    
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };
  
  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };
  
  // Initiate booking cancellation
  const handleCancelBooking = (bookingId) => {
    console.log('Initiating cancellation for booking:', bookingId);
    setCancellingBookingId(bookingId);
    setShowCancelConfirm(true);
  };
  
  // Confirm booking cancellation
  const confirmCancelBooking = async () => {
    if (!cancellingBookingId) return;
    
    console.log('Confirming cancellation for booking:', cancellingBookingId);
    try {
      const result = await updateBookingStatus(cancellingBookingId, 'cancelled');
      if (result.success) {
        console.log('Booking cancelled successfully through API');
        setCancelSuccess(true);
        setCancelError(null);
        
        // Close the modal if the canceled booking is currently being viewed
        if (selectedBooking && selectedBooking.id === cancellingBookingId) {
          setSelectedBooking(result.booking);
        }
        
        // Refresh bookings after cancellation
        handleRefreshBookings();
      } else {
        throw new Error(result.message || 'Failed to cancel booking');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setCancelSuccess(false);
      setCancelError(err.message || 'An error occurred while cancelling the booking');
    } finally {
      // Close confirmation dialog after a short delay
      setTimeout(() => {
        setShowCancelConfirm(false);
        setCancellingBookingId(null);
        // Reset success/error state after a bit longer
        setTimeout(() => {
          setCancelSuccess(false);
          setCancelError(null);
        }, 3000);
      }, 1500);
    }
  };
  
  // Get status badge styling based on status
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-500 border-green-500/30';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-500 border-red-500/30';
      case 'completed':
        return 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-500 border-blue-500/30';
      case 'pending':
      default:
        return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-500 border-yellow-500/30';
    }
  };

  // Determine if we should show loading
  const isLoading = localLoading || (bookingsLoading && !localBookings.length);
  
  // Display debug info if there's an error
  const showDebugInfo = localError || bookingsError;
  
  // Use local bookings or context bookings, prioritizing local
  const displayBookings = localBookings.length > 0 ? localBookings : contextBookings;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white pb-16 pt-24">
      <div className="container mx-auto px-4">
        {/* Page Title */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] tracking-widest leading-relaxed">{t('myBookings')}</h1>
          <p className="text-gray-400 mt-2 font-['Rationale'] text-lg">{t('viewBookingHistory')}</p>
          <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-blue-500 mt-4 rounded"></div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end mb-8 space-x-3">
          <button
            onClick={handleRefreshBookings}
            disabled={isLoading}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-800/70 to-blue-800/70 hover:from-cyan-700/80 hover:to-blue-700/80 text-white rounded-md shadow-lg transition-all duration-300 flex items-center font-['Orbitron'] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isLoading ? t('refreshing') || 'Refreshing...' : t('refreshBookings') || 'Refresh Bookings'}
          </button>
        </div>
        
        {/* Debug Info */}
        {showDebugInfo && (
          <div className="bg-gray-900/60 p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-lg text-cyan-400 font-['Orbitron'] mb-2">Debug Information</h3>
            <p className="text-gray-300 font-['Rationale'] mb-2">
              {localError || bookingsError}
            </p>
            <p className="text-gray-400 font-['Rationale'] text-sm">
              Using temporary data while database connection is being fixed. Your bookings will be displayed from localStorage.
            </p>
          </div>
        )}
        
        {/* Authentication Check */}
        {!isAuthenticated && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-gray-900/60 p-8 rounded-lg shadow-xl text-center max-w-md border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 font-['Orbitron']">{t('pleaseLogin')}</h2>
              <p className="text-gray-400 mb-6 font-['Rationale']">{t('loginToViewBookings')}</p>
              <Link 
                to="/login" 
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded cursor-pointer font-['Orbitron'] hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
              >
                {t('login')}
              </Link>
            </div>
          </div>
        )}
        
        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-cyan-400 font-['Orbitron'] mt-4">{t('loadingBookings')}</p>
          </div>
        )}
        
        {/* Error Message */}
        {(bookingsError && !isLoading) && (
          <div className="bg-red-900/30 border border-red-900/50 rounded-lg p-6 mb-8 shadow-lg">
            <p className="text-red-400 font-['Orbitron']">{bookingsError}</p>
          </div>
        )}
        
        {/* No Bookings Found */}
        {!isLoading && isAuthenticated && displayBookings.length === 0 && (
          <div className="bg-gradient-to-b from-gray-900/50 to-black/60 backdrop-blur-sm border border-gray-800 rounded-lg p-10 text-center shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-600 mb-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 6h-4m4 0a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h18Zm0 0V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v1M8 12h8m-4-4v8"></path>
            </svg>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 mb-4 font-['Orbitron'] tracking-wide">
              {t('noBookingsFound')}
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto font-['Rationale'] text-lg">
              {t('noBookingsDescription')}
            </p>
            <Link
              to="/cars"
              className="relative px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white transition-all duration-300 shadow-lg hover:shadow-cyan-700/20 rounded-md cursor-pointer overflow-hidden group font-['Orbitron']"
            >
              <span className="relative z-10">{t('exploreCars')}</span>
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></span>
            </Link>
          </div>
        )}
        
        {/* Display Bookings */}
        {!isLoading && isAuthenticated && displayBookings.length > 0 && (
          <div>
            {/* Success/Error Messages */}
            {cancelSuccess && (
              <div className="bg-green-900/30 border border-green-900/50 rounded-lg p-4 mb-8 shadow-lg">
                <p className="text-green-400 font-['Orbitron']">{t('bookingCancelledSuccess')}</p>
              </div>
            )}
            
            {cancelError && (
              <div className="bg-red-900/30 border border-red-900/50 rounded-lg p-4 mb-8 shadow-lg">
                <p className="text-red-400 font-['Orbitron']">{cancelError}</p>
              </div>
            )}
            
            {/* Bookings Table */}
            <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-800/50">
              <table className="min-w-full bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-sm overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
                    <th className="py-4 px-6 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider font-['Orbitron']">
                      {t('car')}
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider font-['Orbitron']">
                      {t('dates')}
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider font-['Orbitron']">
                      {t('location')}
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider font-['Orbitron']">
                      {t('price')}
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-cyan-300 uppercase tracking-wider font-['Orbitron']">
                      {t('status')}
                    </th>
                    <th className="py-4 px-6 text-right text-xs font-medium text-cyan-300 uppercase tracking-wider font-['Orbitron']">
                      {t('actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {displayBookings.map((booking) => (
                    <tr 
                      key={booking.id} 
                      className="hover:bg-gray-900/60 transition-colors duration-200"
                    >
                      {/* Car */}
                      <td className="py-5 px-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-14 w-14 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                            {booking.car_name ? (
                              <img 
                                src={getCarImage(booking.car_name)} 
                                alt={booking.car_name} 
                                className="h-14 w-14 object-cover"
                              />
                            ) : (
                              <div className="h-14 w-14 flex items-center justify-center text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3a1 1 0 00.8-.4l3-4a1 1 0 00.2-.6V5a1 1 0 00-1-1H3z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white font-['Orbitron']">
                              {booking.car_name}
                            </div>
                            <div className="text-xs text-gray-400 font-['Rationale'] mt-1">
                              {booking.car_category}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Dates */}
                      <td className="py-5 px-6">
                        <div className="text-lg text-white font-['Rationale']">
                          {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                        </div>
                        <div className="text-sm text-cyan-400 font-['Rationale'] mt-1">
                          {booking.total_days} {booking.total_days === 1 ? t('day') : t('days')}
                        </div>
                      </td>
                      
                      {/* Location */}
                      <td className="py-5 px-6">
                        <div className="text-lg text-white font-['Rationale']">
                          {booking.pickup_location.charAt(0).toUpperCase() + booking.pickup_location.slice(1)}
                        </div>
                        {booking.pickup_location !== booking.dropoff_location && (
                          <div className="text-sm text-gray-400 font-['Rationale'] mt-1">
                            {t('dropoff')}: {booking.dropoff_location.charAt(0).toUpperCase() + booking.dropoff_location.slice(1)}
                          </div>
                        )}
                      </td>
                      
                      {/* Price */}
                      <td className="py-5 px-6">
                        <div className="text-base font-medium text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron']">
                          ${formatCurrency(booking.total_price)}
                        </div>
                      </td>
                      
                      {/* Status */}
                      <td className="py-5 px-6">
                        <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadgeClass(booking.status)} font-['Orbitron']`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      
                      {/* Actions */}
                      <td className="py-5 px-6 text-right text-sm">
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-md border border-cyan-800/50 hover:border-cyan-600/50 transition-colors duration-200 cursor-pointer font-['Orbitron']"
                        >
                          {t('viewDetails')}
                        </button>
                        
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-red-400 hover:text-red-300 cursor-pointer font-['Orbitron'] ml-3 px-3 py-1.5 rounded-md border border-red-800/50 hover:border-red-600/50 transition-colors duration-200"
                          >
                            {t('cancel')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {/* Modals Section */}
      {/* Booking Details Modal */}
      {selectedBooking && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={`${t('bookingDetails')} #${selectedBooking.id.toString().substring(0, 8)}`}
        >
          {/* Modal content */}
          <div className="divide-y divide-gray-800">
            {/* Car Information */}
            <div className="py-5">
              <h3 className="text-lg font-medium text-cyan-400 mb-4 font-['Orbitron']">{t('car')}</h3>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-20 w-20 bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                  {selectedBooking.car_name ? (
                    <img 
                      src={getCarImage(selectedBooking.car_name)} 
                      alt={selectedBooking.car_name} 
                      className="h-20 w-20 object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 flex items-center justify-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3a1 1 0 00.8-.4l3-4a1 1 0 00.2-.6V5a1 1 0 00-1-1H3z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="ml-5">
                  <div className="text-xl font-medium text-white font-['Orbitron']">
                    {selectedBooking.car_name}
                  </div>
                  <div className="text-sm text-gray-400 font-['Rationale'] mt-1">
                    {selectedBooking.car_category}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Dates & Location */}
            <div className="py-5">
              <h3 className="text-lg font-medium text-cyan-400 mb-4 font-['Orbitron']">{t('dates')}</h3>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="text-sm text-gray-400 font-['Rationale'] mb-1">{t('pickupDate')}</p>
                  <p className="text-white font-['Rationale'] text-xl">{formatDate(selectedBooking.start_date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-['Rationale'] mb-1">{t('returnDate')}</p>
                  <p className="text-white font-['Rationale'] text-xl">{formatDate(selectedBooking.end_date)}</p>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-400 font-['Rationale'] mb-1">{t('pickupLocation')}</p>
                  <p className="text-white font-['Rationale'] text-xl">{selectedBooking.pickup_location.charAt(0).toUpperCase() + selectedBooking.pickup_location.slice(1)}</p>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-400 font-['Rationale'] mb-1">{t('dropoffLocation')}</p>
                  <p className="text-white font-['Rationale'] text-xl">{selectedBooking.dropoff_location.charAt(0).toUpperCase() + selectedBooking.dropoff_location.slice(1)}</p>
                </div>
              </div>
            </div>
            
            {/* Options & Pricing */}
            <div className="py-5">
              <h3 className="text-lg font-medium text-cyan-400 mb-4 font-['Orbitron']">{t('priceDetails')}</h3>
              <div className="space-y-3 bg-gray-900/40 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-['Rationale']">{t('carRental')} ({selectedBooking.total_days} {selectedBooking.total_days === 1 ? t('day') : t('days')})</span>
                  <span className="text-white font-['Orbitron']">${formatCurrency(selectedBooking.car_price * selectedBooking.total_days)}</span>
                </div>
                
                {/* Parse and display options */}
                {(() => {
                  // Use the options directly since they've already been processed
                  const parsedOptions = selectedBooking.options || [];
                  const optionsPrice = selectedBooking.options_price || 0;
                  
                  if (parsedOptions && parsedOptions.length > 0) {
                    return (
                      <>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-gray-300 font-['Rationale']">{t('additionalOptions')}</span>
                          <span className="text-white font-['Orbitron']">${formatCurrency(optionsPrice)}</span>
                        </div>
                        
                        <div className="pl-5 text-sm space-y-2 pt-2">
                          {parsedOptions.map((option, index) => (
                            <div key={index} className="flex justify-between text-gray-300 font-['Rationale'] border-b border-gray-700/30 pb-1">
                              <span className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {option.name || option.id || `Option ${index + 1}`}
                              </span>
                              <span className="text-cyan-400">${formatCurrency(option.price || 0)}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    );
                  }
                  
                  return null;
                })()}
                
                <div className="border-t border-gray-700 mt-3 pt-3 flex justify-between font-bold items-center">
                  <span className="text-gray-300 font-['Rationale'] text-base">{t('total')}</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] text-lg">${formatCurrency(selectedBooking.total_price)}</span>
                </div>
              </div>
            </div>
            
            {/* Status & Actions */}
            <div className="py-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-cyan-400 mb-3 font-['Orbitron']">{t('status')}</h3>
                  <span className={`px-3 py-1.5 inline-flex text-sm leading-5 font-semibold rounded-full border ${getStatusBadgeClass(selectedBooking.status)} font-['Orbitron']`}>
                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                  </span>
                </div>
                
                {selectedBooking.status === 'confirmed' && (
                  <button
                    onClick={() => {
                      handleCancelBooking(selectedBooking.id);
                      handleCloseModal();
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-800/50 to-red-600/50 hover:from-red-700/60 hover:to-red-600/60 text-white rounded-md cursor-pointer transition-all duration-200 font-['Orbitron'] shadow-lg"
                  >
                    {t('cancel')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
      
      {/* Cancellation Confirmation Modal */}
      {showCancelConfirm && (
        <Modal
          isOpen={showCancelConfirm}
          onClose={() => setShowCancelConfirm(false)}
          title={t('cancelBookingConfirmation')}
          centerContent={true}
        >
          <div className="py-5">
            <p className="text-gray-300 mb-8 font-['Rationale'] text-base text-center">
              {t('cancelBookingWarning')}
            </p>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-md cursor-pointer transition-colors duration-200 font-['Orbitron'] shadow-md"
              >
                {t('no')}
              </button>
              <button
                onClick={confirmCancelBooking}
                className="px-5 py-2.5 bg-gradient-to-r from-red-800/50 to-red-600/50 hover:from-red-700/60 hover:to-red-600/60 text-white rounded-md cursor-pointer transition-all duration-200 font-['Orbitron'] shadow-lg"
              >
                {t('yesCancelBooking')}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Bookings; 