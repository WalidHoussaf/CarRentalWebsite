const API_URL = 'http://127.0.0.1:8000/api';

// Helper function for making requests
const fetchWithHeaders = async (url, options = {}) => {
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('Using auth token:', token.substring(0, 10) + '...');
  } else if (!url.includes('/login') && !url.includes('/register')) {
    // If no token and not trying to login/register, throw an error
    throw new Error('Authentication required. Please log in.');
  }
  
  console.log(`API Request: ${options.method || 'GET'} ${url}`);
  console.log('Request Headers:', headers);
  if (options.body) {
    console.log('Request Body:', options.body);
  }
  
  try {
    // Add a small delay for debugging
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const response = await fetch(url, {
      ...options,
      headers,
      // Important: Include credentials to send cookies with the request
      credentials: 'include'
    });
    
    console.log(`Response Status:`, response.status, response.statusText);
    
    // Handle 401 Unauthorized specifically
    if (response.status === 401) {
      console.error('Authentication failed - token may be invalid or expired');
      // Clear token and user data from storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      throw new Error('Your session has expired. Please log in again.');
    }
    
    // Parse the JSON response (whether success or error)
    const data = await response.json().catch(() => {
      console.log('Response is not valid JSON');
      return {};
    });
    
    console.log('Response Data:', data);
    
    // If the response wasn't successful, throw an error with the message from the server
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
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
    try {
      return await fetchWithHeaders(`${API_URL}/login`, {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
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
    try {
      const data = await fetchWithHeaders(`${API_URL}/admin/users`);
      console.log('getAllUsers raw response:', data);
      
      // Check if the response has the expected structure
      if (!data.users && Array.isArray(data)) {
        // If the API is returning an array directly instead of {users: [...]}
        return { users: data };
      }
      
      return data;
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw error;
    }
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
};

export default {
  auth: authService,
  admin: adminService,
}; 