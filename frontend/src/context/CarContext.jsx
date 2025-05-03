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

  // Fetch all available cars from the backend
  const fetchCars = useCallback(async () => {
    // If we already fetched available cars and there's data, don't fetch again
    if (lastFetched === 'available' && cars.length > 0) {
      return;
    }
    
    setLoading(true);
    try {
      console.log('Fetching available cars...');
      
      // Using direct fetch to bypass authentication issues
      const response = await fetch(`${API_URL}/cars/available`, {
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
      console.log('Car data received:', data);
      
      if (data.success && Array.isArray(data.data)) {
        setCars(data.data);
        setLastFetched('available');
      } else if (Array.isArray(data)) {
        setCars(data);
        setLastFetched('available');
      } else if (data.data && Array.isArray(data.data)) {
        setCars(data.data);
        setLastFetched('available');
      } else {
        console.error('Unexpected API response format:', data);
        setError('Unexpected response format');
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Failed to fetch cars: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [cars.length, lastFetched]);

  // Fetch cars by category
  const fetchCarsByCategory = useCallback(async (category) => {
    // If we already fetched this category and there's data, don't fetch again
    if (lastFetched === `category_${category}` && cars.length > 0) {
      return;
    }
    
    setLoading(true);
    try {
      console.log(`Fetching cars in category: ${category}`);
      
      // Using direct fetch to bypass authentication issues
      const response = await fetch(`${API_URL}/cars/category/${category}`, {
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
      console.log('Category car data received:', data);
      
      if (data.success && Array.isArray(data.data)) {
        setCars(data.data);
        setLastFetched(`category_${category}`);
      } else if (Array.isArray(data)) {
        setCars(data);
        setLastFetched(`category_${category}`);
      } else if (data.data && Array.isArray(data.data)) {
        setCars(data.data);
        setLastFetched(`category_${category}`);
      } else {
        console.error('Unexpected API response format:', data);
        setError('Unexpected response format');
      }
      
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${category} cars:`, err);
      setError(`Failed to fetch ${category} cars: ` + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [cars.length, lastFetched]);

  // Fetch cars by location
  const fetchCarsByLocation = useCallback(async (location) => {
    // If we already fetched this location and there's data, don't fetch again
    if (lastFetched === `location_${location}` && cars.length > 0) {
      return;
    }
    
    setLoading(true);
    try {
      console.log(`Fetching cars in location: ${location}`);
      
      // Using direct fetch to bypass authentication issues
      const response = await fetch(`${API_URL}/cars/location/${location}`, {
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
      console.log('Location car data received:', data);
      
      if (data.success && Array.isArray(data.data)) {
        setCars(data.data);
        setLastFetched(`location_${location}`);
      } else if (Array.isArray(data)) {
        setCars(data);
        setLastFetched(`location_${location}`);
      } else if (data.data && Array.isArray(data.data)) {
        setCars(data.data);
        setLastFetched(`location_${location}`);
      } else {
        console.error('Unexpected API response format:', data);
        setError('Unexpected response format');
      }
      
      setError(null);
    } catch (err) {
      console.error(`Error fetching cars in ${location}:`, err);
      setError(`Failed to fetch cars in ${location}: ` + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [cars.length, lastFetched]);

  // Get a specific car by ID
  const getCarById = async (carId) => {
    try {
      console.log(`Fetching car with ID: ${carId}`);
      
      // Using direct fetch to bypass authentication issues
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
      console.log('Car detail data received:', data);
      
      if (data.success && data.data) {
        return data.data;
      } else if (data.id) {
        return data;
      } else {
        console.error('Unexpected API response format for car details:', data);
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      console.error(`Error fetching car with ID ${carId}:`, err);
      throw err;
    }
  };

  // Initial data load on component mount
  useEffect(() => {
    if (cars.length === 0 && !loading && !lastFetched) {
      fetchCars();
    }
  }, [cars.length, fetchCars, loading, lastFetched]);

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