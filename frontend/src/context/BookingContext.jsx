import React, { createContext, useContext, useState } from 'react';

// Create the context
const BookingContext = createContext();

// Custom hook to use the booking context
export const useBooking = () => {
  return useContext(BookingContext);
};

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create a new booking
  const createBooking = async (bookingData) => {
    setLoading(true);
    try {
      // Placeholder for API call
      // In a real app, you would make an API call here
      const newBooking = {
        id: Math.random().toString(36).substr(2, 9),
        ...bookingData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      setCurrentBooking(newBooking);
      setBookings([...bookings, newBooking]);
      setError(null);
      return { success: true, booking: newBooking };
    } catch (err) {
      setError('Failed to create booking');
      return { success: false, message: err.message || 'Failed to create booking' };
    } finally {
      setLoading(false);
    }
  };

  // Fetch user bookings
  const fetchUserBookings = async (userId) => {
    setLoading(true);
    try {
      // Placeholder for API call
      // In a real app, you would make an API call here
      setBookings([]);
      setError(null);
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  // Update booking status
  const updateBookingStatus = async (bookingId, status) => {
    setLoading(true);
    try {
      // Placeholder for API call
      // In a real app, you would make an API call here
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status } 
          : booking
      );
      
      setBookings(updatedBookings);
      
      if (currentBooking && currentBooking.id === bookingId) {
        setCurrentBooking({ ...currentBooking, status });
      }
      
      setError(null);
      return { success: true };
    } catch (err) {
      setError('Failed to update booking');
      return { success: false, message: err.message || 'Failed to update booking' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    bookings,
    currentBooking,
    loading,
    error,
    createBooking,
    fetchUserBookings,
    updateBookingStatus,
    setCurrentBooking
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;