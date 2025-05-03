export const API_URL = 'http://127.0.0.1:8000/api';

// Helper function for making requests
export const fetchWithHeaders = async (url, options = {}) => {
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (!url.includes('/login') && !url.includes('/register') && 
             !url.includes('/cars/available') && !url.includes('/cars/category') && 
             !url.includes('/cars/') && !url.includes('/api/cars')) {
    // If no token and not trying to access public endpoints, throw an error
    throw new Error('Authentication required. Please log in.');
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
    // Important: Include credentials to send cookies with the request
    credentials: 'include'
  });
  
  // Handle 401 Unauthorized specifically
  if (response.status === 401) {
    // Clear token and user data from storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    throw new Error('Your session has expired. Please log in again.');
  }
  
  // Get the raw text first
  const responseText = await response.text();
  
  // Try to parse as JSON
  let data;
  try {
    // Only try to parse as JSON if we have content
    if (responseText.trim()) {
      data = JSON.parse(responseText);
    } else {
      data = {};
    }
  } catch (error) {
    // Return the raw text if JSON parsing fails
    data = { success: false, message: 'Failed to parse response: ' + error.message, rawText: responseText };
  }
  
  // If the response wasn't successful, throw an error with the message from the server
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// Auth services
export const authService = {
  // Register a new user
  register: async (userData) => {
    return fetchWithHeaders(`${API_URL}/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  // Login a user
  login: async (credentials) => {
    return fetchWithHeaders(`${API_URL}/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  // Logout a user
  logout: async () => {
    return fetchWithHeaders(`${API_URL}/logout`, {
      method: 'POST',
    });
  },
};

// Admin services
export const adminService = {
  // Get all users
  getAllUsers: async () => {
    const data = await fetchWithHeaders(`${API_URL}/admin/users`);
    
    // Check if the response has the expected structure
    if (!data.users && Array.isArray(data)) {
      // If the API is returning an array directly instead of {users: [...]}
      return { users: data };
    }
    
    return data;
  },
  
  // Get a specific user
  getUser: async (userId) => {
    return fetchWithHeaders(`${API_URL}/admin/users/${userId}`);
  },
  
  // Create a new user
  createUser: async (userData) => {
    return fetchWithHeaders(`${API_URL}/admin/users`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  // Update a user
  updateUser: async (userId, userData) => {
    return fetchWithHeaders(`${API_URL}/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  
  // Delete a user
  deleteUser: async (userId) => {
    return fetchWithHeaders(`${API_URL}/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },
  
  // Admin Booking Management
  getAllBookings: async () => {
    const data = await fetchWithHeaders(`${API_URL}/admin/bookings`);
    
    // Check if the response has the expected structure
    if (!data.bookings && Array.isArray(data)) {
      // If the API is returning an array directly instead of {bookings: [...]}
      return { bookings: data };
    }
    
    return data;
  },
  
  // Get a specific booking
  getBooking: async (bookingId) => {
    return fetchWithHeaders(`${API_URL}/admin/bookings/${bookingId}`);
  },
  
  // Update a booking's status
  updateBookingStatus: async (bookingId, status) => {
    return fetchWithHeaders(`${API_URL}/admin/bookings/${bookingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
  
  // Delete a booking
  deleteBooking: async (bookingId) => {
    return fetchWithHeaders(`${API_URL}/admin/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  },

  // Admin Car Management
  getAllCars: async () => {
    const data = await fetchWithHeaders(`${API_URL}/admin/cars`);
    
    // Check if the response has the expected structure
    if (!data.data && Array.isArray(data)) {
      // If the API is returning an array directly
      return { data: data };
    }
    
    return data;
  },
  
  // Get a specific car
  getCar: async (carId) => {
    return fetchWithHeaders(`${API_URL}/admin/cars/${carId}`);
  },
  
  // Create a new car
  createCar: async (carData) => {
    // Check if we have an image file to upload
    if (carData.image instanceof File) {
      const formData = new FormData();
      
      // Add all other car data to the form
      Object.keys(carData).forEach(key => {
        if (key === 'image') {
          formData.append(key, carData[key]);
        } else {
          formData.append(key, carData[key]);
        }
      });
      
      // Use fetch directly for multipart/form-data
      const token = localStorage.getItem('auth_token');
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/admin/cars`, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create car');
      }
      
      return response.json();
    }
    
    // Regular JSON request if no file is being uploaded
    return fetchWithHeaders(`${API_URL}/admin/cars`, {
      method: 'POST',
      body: JSON.stringify(carData),
    });
  },
  
  // Update a car
  updateCar: async (carId, carData) => {
    // Check if we have an image file to upload
    if (carData.image instanceof File) {
      const formData = new FormData();
      
      // Add all other car data to the form
      Object.keys(carData).forEach(key => {
        if (key === 'image') {
          formData.append(key, carData[key]);
        } else {
          formData.append(key, carData[key]);
        }
      });
      
      // Use fetch directly for multipart/form-data
      const token = localStorage.getItem('auth_token');
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/admin/cars/${carId}`, {
        method: 'POST', // Laravel requires POST for form data
        headers,
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update car');
      }
      
      return response.json();
    }
    
    // Regular JSON request if no file is being uploaded
    return fetchWithHeaders(`${API_URL}/admin/cars/${carId}`, {
      method: 'PUT',
      body: JSON.stringify(carData),
    });
  },
  
  // Delete a car
  deleteCar: async (carId) => {
    return fetchWithHeaders(`${API_URL}/admin/cars/${carId}`, {
      method: 'DELETE',
    });
  },
  
  // Toggle car availability
  toggleCarAvailability: async (carId) => {
    return fetchWithHeaders(`${API_URL}/admin/cars/${carId}/toggle-availability`, {
      method: 'PATCH',
    });
  },
};

// Booking services
export const bookingService = {
  // Create a new booking
  createBooking: async (bookingData) => {
    return fetchWithHeaders(`${API_URL}/bookings`, {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },
  
  // Get all bookings for the current user
  getUserBookings: async () => {
    return fetchWithHeaders(`${API_URL}/bookings`);
  },
  
  // Get a specific booking
  getBooking: async (bookingId) => {
    return fetchWithHeaders(`${API_URL}/bookings/${bookingId}`);
  },
  
  // Update a booking
  updateBooking: async (bookingId, bookingData) => {
    return fetchWithHeaders(`${API_URL}/bookings/${bookingId}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
  },
  
  // Cancel a booking
  cancelBooking: async (bookingId) => {
    return fetchWithHeaders(`${API_URL}/bookings/${bookingId}/cancel`, {
      method: 'PUT',
    });
  },
};

export const Api = {
  post: async (endpoint, data) => {
    const token = localStorage.getItem('auth_token');
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      credentials: 'include'
    });
    
    const responseText = await response.text();
    
    // Try to parse as JSON
    let parsedData;
    if (responseText.trim()) {
      try {
        parsedData = JSON.parse(responseText);
      } catch {
        // Silently handle parse error
        parsedData = { success: false, message: 'Failed to parse response' };
      }
    } else {
      parsedData = {};
    }
    
    return parsedData;
  }
};

