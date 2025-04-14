import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sampleCars } from '../assets/assets';
import BookingHeader from '../components/Booking/BookingHeader';
import BookingCalendar from '../components/Booking/BookingCalendar';
import BookingLocation from '../components/Booking/BookingLocation';
import BookingOption from '../components/Booking/BookingOption';
import BookingSummary from '../components/Booking/BookingSummary';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState(1); 
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  // Booking details state
  const [bookingDetails, setBookingDetails] = useState({
    startDate: null,
    endDate: null,
    pickupLocation: '',
    dropoffLocation: '',
    options: [],
    totalDays: 0,
    totalPrice: 0
  });
  
  // Load car data on component mount
  useEffect(() => {
    setLoading(true);
    
    setTimeout(() => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      const parsedId = parseInt(id);
      const foundCar = sampleCars.find(c => c.id === parsedId);
      
      if (foundCar) {
        // Clone the object to avoid reference issues
        const carWithResolvedImage = {...foundCar};
        
        // Process images that are references
        if (foundCar.image && typeof foundCar.image === 'string' && foundCar.image.includes('cars.')) {
          // Build a default image path
          const carNumber = foundCar.image.split('cars.car')[1];
          if (carNumber) {
            carWithResolvedImage.image = `/cars/car${carNumber}.png`;
          } else {
            // Fallback for unexpected format
            carWithResolvedImage.image = `/api/placeholder/500/300?text=${encodeURIComponent(foundCar.name)}`;
          }
        }
        
        setCar(carWithResolvedImage);
        
        // Initialize locations based on car availability
        const initialLocation = Array.isArray(foundCar.location) 
          ? foundCar.location[0] 
          : foundCar.location;
        
        setBookingDetails(prev => ({
          ...prev,
          pickupLocation: initialLocation,
          dropoffLocation: initialLocation
        }));
      }
      setLoading(false);
    }, 800);
  }, [id]);
  
  const handleDateSelection = (startDate, endDate) => {
    // Calculate total days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - start.getTime();
    const totalDays = Math.ceil(differenceInTime / (1000 * 3600 * 24)) || 1;
    
    // Calculate base price
    const basePrice = car ? car.price * totalDays : 0;
    
    setBookingDetails(prev => ({
      ...prev,
      startDate,
      endDate,
      totalDays,
      totalPrice: basePrice
    }));
    
    setBookingStep(2);
  };
  
  const handleLocationSelection = (pickup, dropoff) => {
    setBookingDetails(prev => ({
      ...prev,
      pickupLocation: pickup,
      dropoffLocation: dropoff
    }));
    
    setBookingStep(3);
  };
  
  const handleOptionSelection = (options, additionalPrice) => {
    const basePrice = car ? car.price * bookingDetails.totalDays : 0;
    
    setBookingDetails(prev => ({
      ...prev,
      options,
      optionsPrice: additionalPrice,
      totalPrice: basePrice + additionalPrice
    }));
    
    setBookingStep(4);
  };
  
  const handleBookingSubmit = () => {
    // Navigate to confirmation page with booking data
    navigate('/booking-confirmation', { 
      state: { 
        bookingDetails,
        carDetails: car
      } 
    });
  };
  
  // Navigation functions
  const goToNextStep = () => {
    setBookingStep(prev => Math.min(prev + 1, 4));
  };
  
  const goToPreviousStep = () => {
    setBookingStep(prev => Math.max(prev - 1, 1));
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!car) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-bold mb-4 font-['Orbitron']">{t('carNotFound')}</h1>
        <p className="text-gray-400 mb-8">{t('vehicleNotAvailable')}</p>
        <button 
          onClick={() => navigate('/cars')}
          className="px-6 py-3 bg-gradient-to-r from-white to-cyan-400 text-black font-medium rounded-md hover:opacity-90"
        >
          {t('viewAllCars')}
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white pb-10">
      <BookingHeader car={car} bookingStep={bookingStep} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-grow">
            {bookingStep === 1 && (
              <BookingCalendar 
                car={car}
                onDateSelection={handleDateSelection} 
                onNextStep={goToNextStep}
              />
            )}
            
            {bookingStep === 2 && (
              <BookingLocation 
                car={car}
                bookingDetails={bookingDetails}
                onLocationSelection={handleLocationSelection}
                onPreviousStep={goToPreviousStep}
                onNextStep={goToNextStep}
              />
            )}
            
            {bookingStep === 3 && (
              <BookingOption 
                car={car}
                bookingDetails={bookingDetails}
                onOptionSelection={handleOptionSelection}
                onPreviousStep={goToPreviousStep}
                onNextStep={goToNextStep}
              />
            )}
          </div>
          
          {/* Booking Summary */}
          <div className="lg:w-96 lg:min-w-[384px] lg:max-w-[384px] w-full">
            <BookingSummary 
              car={car}
              bookingDetails={bookingDetails}
              bookingStep={bookingStep}
              onSubmit={handleBookingSubmit}
              onPreviousStep={goToPreviousStep}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
