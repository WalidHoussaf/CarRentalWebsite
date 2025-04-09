import React, { createContext, useContext, useState } from 'react';

// Create the context
const CarContext = createContext();

// Custom hook to use the car context
export const useCar = () => {
  return useContext(CarContext);
};

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add basic functionality later
  const fetchCars = async () => {
    // Implementation will come later
    setLoading(true);
    try {
      // Placeholder for API call
      setCars([]);
      setError(null);
    } catch (err) {
      setError('Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cars,
    loading,
    error,
    fetchCars
  };

  return (
    <CarContext.Provider value={value}>
      {children}
    </CarContext.Provider>
  );
};

export default CarContext;