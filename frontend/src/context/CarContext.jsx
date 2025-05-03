import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { API_URL } from '../services/api';

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
  const [lastFetched, setLastFetched] = useState('');

  // Generic fetch function to handle all car-related API calls
  const fetchCarData = useCallback(async (endpoint, cacheKey) => {
    // Skip fetching if we already have data for this request type
    if (lastFetched === cacheKey && cars.length > 0) {
      return cars;
    }
    
    setLoading(true);
    try {      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      let carData;
      if (data.success && Array.isArray(data.data)) {
        carData = data.data;
      } else if (Array.isArray(data)) {
        carData = data;
      } else if (data.data && Array.isArray(data.data)) {
        carData = data.data;
      } else {
        throw new Error('Unexpected response format');
      }
      
      setCars(carData);
      setLastFetched(cacheKey);
      setError(null);
      return carData;
    } catch (err) {
      setError(`Failed to fetch cars: ${err.message || 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cars.length, lastFetched]);

  // Fetch all available cars
  const fetchCars = useCallback(async () => {
    try {
      return await fetchCarData('/cars/available', 'available');
    } catch (err) {
      setError(`Failed to fetch available cars: ${err.message}`);
    }
  }, [fetchCarData]);

  // Fetch cars by category
  const fetchCarsByCategory = useCallback(async (category) => {
    try {
      return await fetchCarData(`/cars/category/${category}`, `category_${category}`);
    } catch (err) {
      setError(`Failed to fetch ${category} cars: ${err.message}`);
    }
  }, [fetchCarData]);

  // Fetch cars by location
  const fetchCarsByLocation = useCallback(async (location) => {
    try {
      return await fetchCarData(`/cars/location/${location}`, `location_${location}`);
    } catch (err) {
      setError(`Failed to fetch cars in ${location}: ${err.message}`);
    }
  }, [fetchCarData]);

  // Get a specific car by ID
  const getCarById = async (carId) => {
    try {
      const response = await fetch(`${API_URL}/cars/${carId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        return data.data;
      } else if (data.id) {
        return data;
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      setError(`Error fetching car with ID ${carId}: ${err.message}`);
      throw err;
    }
  };

  // Initial data load on component mount
  useEffect(() => {
    if (cars.length === 0 && !loading && !lastFetched) {
      fetchCars();
    }
  }, [cars.length, fetchCars, loading, lastFetched]);

  // Provide all the required values and functions
  const value = {
    cars,
    loading,
    error,
    fetchCars,
    fetchCarsByCategory,
    fetchCarsByLocation,
    getCarById
  };

  return (
    <CarContext.Provider value={value}>
      {children}
    </CarContext.Provider>
  );
};

export default CarContext; 