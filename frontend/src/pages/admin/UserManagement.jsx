import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

// Component imports
import Modal from '../../components/common/Modal';
import PageTitle from '../../components/common/PageTitle';

// This is the UserManagement component that should be accessible at /admin/users
const UserManagement = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  // States
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form States
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'user',
    phone_number: '',
    address: '',
    city: '',
    zip_code: '',
    country: ''
  });

  // Validation Error State
  const [formErrors, setFormErrors] = useState({});
  
  // UI States
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [message, setMessage] = useState(null);
  
  // Debug info
  const [debugInfo, setDebugInfo] = useState(null);

  // Extract fetchUsers function for reuse
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Direct API call without custom helpers
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }

      // Make API request directly like the login process does
      const API_URL = 'http://127.0.0.1:8000/api';
      
      const response = await fetch(`${API_URL}/admin/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      // Check if unauthorized
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setError('Your session has expired. Please log in again.');
        setLoading(false);
        return;
      }

      // Safe JSON parsing with error handling
      let data;
      try {
        const text = await response.text(); // Get raw response text
        
        // Clean the response by removing BOM and other common issues
        let cleanedText = text.trim();
        
        // Remove BOM if present
        if (cleanedText.charCodeAt(0) === 0xFEFF) {
          cleanedText = cleanedText.substring(1);
        }
        
        // Find where the JSON object/array ends
        const lastBrace = Math.max(cleanedText.lastIndexOf('}'), cleanedText.lastIndexOf(']'));
        if (lastBrace !== -1 && lastBrace < cleanedText.length - 1) {
          cleanedText = cleanedText.substring(0, lastBrace + 1);
        }
        
        // Try parsing the cleaned text
        data = JSON.parse(cleanedText);
      } catch (parseError) {
        setError(`Failed to parse server response: ${parseError.message}`);
        setLoading(false);
        return;
      }
      
      // Handle data directly as array
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data && data.users && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        setError('Received invalid data format from server');
      }
      
      setError(null);
    } catch (error) {
      setError(error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all users on component mount
  useEffect(() => {
    // Debug auth information
    setDebugInfo({
      isAuthenticated: isAuthenticated,
      isAdmin: isAdmin(),
      user: user
    });

    if (!isAuthenticated) {
      setError('You must be logged in to view this page');
      setLoading(false);
      return;
    }

    // Don't attempt to fetch if not admin
    if (!isAdmin()) {
      setError('You do not have admin privileges to access this page');
      setLoading(false);
      return;
    }

    fetchUsers();
  }, [isAuthenticated, isAdmin, user]);

  // Form reset function
  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role: 'user',
      phone_number: '',
      address: '',
      city: '',
      zip_code: '',
      country: ''
    });
    setFormErrors({});
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Initialize edit form with user data
  const handleEditClick = (user) => {
    // Split name into first and last name if possible
    let firstName = '';
    let lastName = '';
    
    if (user.name) {
      const nameParts = user.name.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }
    
    setFormData({
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      email: user.email || '',
      password: '', // Don't populate password
      role: user.role || 'user',
      phone_number: user.phone_number || '',
      address: user.address || '',
      city: user.city || '',
      zip_code: user.zip_code || '',
      country: user.country || ''
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  // Handle create click
  const handleCreateClick = () => {
    setIsCreating(true);
    setIsEditing(false);
  };

  // Cancel editing/creating
  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    resetForm();
  };

  // Handle creating a new user
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    let formErrors = {};
    if (!formData.first_name?.trim()) formErrors.first_name = 'First name is required';
    if (!formData.last_name?.trim()) formErrors.last_name = 'Last name is required';
    if (!formData.email?.trim()) formErrors.email = 'Email is required';
    if (!formData.password?.trim()) formErrors.password = 'Password is required';
    if (!formData.role) formErrors.role = 'Role is required';
    
    if (Object.keys(formErrors).length > 0) {
      setFormErrors(formErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      // Create full name from first and last name
      const userData = {
        ...formData,
        name: `${formData.first_name} ${formData.last_name}`.trim()
      };
      
      // Direct API approach (matches login/register pattern)
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }
      
      const API_URL = 'http://127.0.0.1:8000/api';
      
      const response = await fetch(`${API_URL}/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData),
        credentials: 'include'
      });
      
      // Safe JSON parsing
      let data;
      try {
        const text = await response.text();
        
        if (text) {
          // Clean the response
          let cleanedText = text.trim();
          
          // Remove BOM if present
          if (cleanedText.charCodeAt(0) === 0xFEFF) {
            cleanedText = cleanedText.substring(1);
          }
          
          // Find where the JSON object/array ends
          const lastBrace = Math.max(cleanedText.lastIndexOf('}'), cleanedText.lastIndexOf(']'));
          if (lastBrace !== -1 && lastBrace < cleanedText.length - 1) {
            cleanedText = cleanedText.substring(0, lastBrace + 1);
          }
          
          data = JSON.parse(cleanedText);
        } else {
          data = {};
        }
      } catch (parseError) {
        throw new Error(`Failed to parse server response: ${parseError.message}`);
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create user');
      }
      
      // Success handling
      setMessage({
        type: 'success',
        text: 'User created successfully'
      });
      
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'user',
        phone_number: '',
        address: '',
        city: '',
        zip_code: '',
        country: ''
      });
      
      // Close modal
      setIsCreating(false);
      
      // Refresh user list
      fetchUsers();
      
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to create user'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle updating a user
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    let formErrors = {};
    if (!formData.first_name?.trim()) formErrors.first_name = 'First name is required';
    if (!formData.last_name?.trim()) formErrors.last_name = 'Last name is required';
    if (!formData.email?.trim()) formErrors.email = 'Email is required';
    if (!formData.role) formErrors.role = 'Role is required';
    
    if (Object.keys(formErrors).length > 0) {
      setFormErrors(formErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      // Create full name from first and last name
      const userData = {
        ...formData,
        name: `${formData.first_name} ${formData.last_name}`.trim()
      };
      
      // Direct API approach (matches login/register pattern)
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }
      
      const API_URL = 'http://127.0.0.1:8000/api';
      
      const response = await fetch(`${API_URL}/admin/users/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData),
        credentials: 'include'
      });
      
      // Safe JSON parsing
      let data;
      try {
        const text = await response.text();
        
        if (text) {
          // Clean the response
          let cleanedText = text.trim();
          
          // Remove BOM if present
          if (cleanedText.charCodeAt(0) === 0xFEFF) {
            cleanedText = cleanedText.substring(1);
          }
          
          // Find where the JSON object/array ends
          const lastBrace = Math.max(cleanedText.lastIndexOf('}'), cleanedText.lastIndexOf(']'));
          if (lastBrace !== -1 && lastBrace < cleanedText.length - 1) {
            cleanedText = cleanedText.substring(0, lastBrace + 1);
          }
          
          data = JSON.parse(cleanedText);
        } else {
          data = {};
        }
      } catch (parseError) {
        throw new Error(`Failed to parse server response: ${parseError.message}`);
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user');
      }
      
      // Success handling
      setMessage({
        type: 'success',
        text: 'User updated successfully'
      });
      
      // Close modal
      setIsEditing(false);
      resetForm();
      
      // Refresh user list
      fetchUsers();
      
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update user'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (user) => {
    setConfirmDelete(user);
  };

  // Cancel delete confirmation
  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  // Handle deleting a user
  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;

    try {
      setLoading(true);
      
      const API_URL = 'http://127.0.0.1:8000/api';
      
      const response = await fetch(`${API_URL}/admin/users/${confirmDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        credentials: 'include'
      });
      
      // Check for failure response
      if (!response.ok) {
        // Try to parse error message
        let errorData = {};
        try {
          const text = await response.text();
          
          if (text) {
            // Clean the response
            let cleanedText = text.trim();
            
            // Remove BOM if present
            if (cleanedText.charCodeAt(0) === 0xFEFF) {
              cleanedText = cleanedText.substring(1);
            }
            
            // Find where the JSON object/array ends
            const lastBrace = Math.max(cleanedText.lastIndexOf('}'), cleanedText.lastIndexOf(']'));
            if (lastBrace !== -1 && lastBrace < cleanedText.length - 1) {
              cleanedText = cleanedText.substring(0, lastBrace + 1);
            }
            
            errorData = JSON.parse(cleanedText);
          }
        } catch {
          // Error parsing response - continue with generic error message
        }
        throw new Error(errorData.message || `Failed to delete user (${response.status})`);
      }
      
      // Remove the user from the users list
      setUsers(prev => prev.filter(user => user.id !== confirmDelete.id));
      
      // Clear confirm dialog and show success message
      setConfirmDelete(null);
      setMessage({ type: 'success', text: 'User deleted successfully' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
      
      // Refresh user list
      fetchUsers();
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete user' });
      setConfirmDelete(null);
    } finally {
      setLoading(false);
    }
  };

  // Debug view
  if (debugInfo) {
    // Check if authentication data looks good
    if (debugInfo.isAuthenticated && debugInfo.isAdmin) {
      // Don't show debug view if authenticated and admin
      // Continue to the actual component
    } else {
      return (
        <div className="min-h-screen bg-black text-white pt-20 pb-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-6">Debug Authentication</h1>
            
            <div className="bg-gray-900/50 border border-cyan-900/30 rounded-lg p-6 mb-8">
              <h2 className="text-xl text-cyan-400 mb-4">Auth State:</h2>
              <pre className="bg-black/60 p-4 rounded-md overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
            
            <div className="flex flex-col gap-4">
              {!debugInfo.isAuthenticated && (
                <div className="bg-red-900/30 text-red-300 border border-red-800 p-4 rounded-md">
                  <h3 className="font-bold mb-2">Not Authenticated</h3>
                  <p>You are not logged in. Please log in first.</p>
                </div>
              )}
              
              {debugInfo.isAuthenticated && !debugInfo.isAdmin && (
                <div className="bg-red-900/30 text-red-300 border border-red-800 p-4 rounded-md">
                  <h3 className="font-bold mb-2">Not Admin</h3>
                  <p>Your account does not have admin privileges.</p>
                  <p className="mt-2">Current role: {debugInfo.user?.role || 'undefined'}</p>
                </div>
              )}
              
              <div className="bg-yellow-900/30 text-yellow-300 border border-yellow-800 p-4 rounded-md">
                <h3 className="font-bold mb-2">To Fix:</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Make sure you are logged in</li>
                  <li>Check that your user has role="admin" in the database</li>
                  <li>Log out and log back in to refresh your session</li>
                  <li>Clear your browser cache and local storage</li>
                </ol>
              </div>
              
              <Link 
                to="/login" 
                className="self-start px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 rounded-md text-white transition-all duration-300 cursor-pointer"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  if (loading && users.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  // Return auth error view with login button
  if (error && (error.includes('session has expired') || error.includes('must be logged in'))) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-black/80 backdrop-blur-lg p-8 rounded-lg shadow-lg border border-red-500/20 max-w-md w-full">
          <h2 className="text-red-500 text-2xl mb-4">{t('authenticationError')}</h2>
          <p className="text-white mb-6">{error}</p>
          <Link 
            to="/login" 
            className="block w-full text-center bg-gradient-to-r from-cyan-500 to-cyan-700 text-white py-2 rounded-md hover:from-cyan-600 hover:to-cyan-800 transition-all duration-300 cursor-pointer"
          >
            {t('logInAgain')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen pt-20 pb-12 px-4 font-['Rationale']">
      <div className="max-w-7xl mx-auto">
        {/* Status Messages */}
        {error && (
          <div className="p-4 mb-6 rounded-md bg-red-900/30 text-red-300 border border-red-800 backdrop-blur-sm">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {/* Page Header */}
        <PageTitle
          title={t('manageUsers')}
          subtitle={t('userManagementSubtitle')}
          actions={
            <button
              onClick={handleCreateClick}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 rounded-md text-white font-['Orbitron'] transition-all duration-300 flex items-center cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              {t('addNewUser')}
            </button>
          }
        />

        {/* Status Messages */}
        {message && (
          <div className={`p-4 mb-6 rounded-md flex items-center ${
            message.type === 'success' 
              ? 'bg-green-900/30 text-green-300 border border-green-800' 
              : 'bg-red-900/30 text-red-300 border border-red-800'
          } backdrop-blur-sm`}>
            {message.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-gray-900/50 border border-cyan-900/30 rounded-lg overflow-hidden backdrop-blur-sm">
          {loading && users.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-lg font-['Orbitron']">{t('noUsersFound')}</p>
              <button 
                onClick={handleCreateClick}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 rounded-md text-white font-['Orbitron'] transition-all duration-300 cursor-pointer"
              >
                {t('addFirstUser')}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-cyan-900/30 border-b border-cyan-900/50">
                    <th className="px-4 py-3 text-sm font-medium text-cyan-300 font-['Orbitron']">{t('name')}</th>
                    <th className="px-4 py-3 text-sm font-medium text-cyan-300 font-['Orbitron']">{t('email')}</th>
                    <th className="px-4 py-3 text-sm font-medium text-cyan-300 font-['Orbitron']">{t('role')}</th>
                    <th className="px-4 py-3 text-sm font-medium text-cyan-300 font-['Orbitron']">{t('status')}</th>
                    <th className="px-4 py-3 text-sm font-medium text-cyan-300 text-right font-['Orbitron']">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.map(user => (
                    <tr 
                      key={user.id} 
                      className="hover:bg-cyan-900/10 transition-colors duration-150"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 mr-3 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-full flex items-center justify-center font-['Orbitron']">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-white font-['Orbitron']">{user.name}</div>
                            {user.phone_number && (
                              <div className="text-sm text-gray-400">{user.phone_number}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-base font-medium text-cyan-100">{user.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-900/50 text-purple-300 border border-purple-800/50' 
                            : 'bg-blue-900/50 text-blue-300 border border-blue-800/50'
                        } font-['Orbitron']`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-900/50 text-green-300 border border-green-800/50 font-['Orbitron']">
                          {t('active')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-cyan-400 hover:text-cyan-300 transition-colors font-['Orbitron'] text-sm flex items-center cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            {t('edit')}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="px-3 py-1 bg-red-900/50 hover:bg-red-900 text-red-400 hover:text-red-300 rounded transition-colors font-['Orbitron'] text-sm flex items-center cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            {t('delete')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create/Edit Form */}
        {(isCreating || isEditing) && (
          <Modal 
            isOpen={isCreating || isEditing} 
            onClose={handleCancel}
            title={isCreating ? t('createNewUser') : t('editUser')}
          >
            <form onSubmit={isCreating ? handleCreateSubmit : handleUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-cyan-300 font-['Orbitron']">
                    {t('firstName')}
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className={`w-full bg-black/60 border ${formErrors.first_name ? 'border-red-500' : 'border-cyan-900/40'} rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50`}
                  />
                  {formErrors.first_name && <p className="text-red-500 text-xs mt-1">{formErrors.first_name}</p>}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-cyan-300 font-['Orbitron']">
                    {t('lastName')}
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className={`w-full bg-black/60 border ${formErrors.last_name ? 'border-red-500' : 'border-cyan-900/40'} rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50`}
                  />
                  {formErrors.last_name && <p className="text-red-500 text-xs mt-1">{formErrors.last_name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-cyan-300 font-['Orbitron']">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full bg-black/60 border ${formErrors.email ? 'border-red-500' : 'border-cyan-900/40'} rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50`}
                  />
                  {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-cyan-300 font-['Orbitron']">
                    {t('password')} {isEditing && <span className="text-gray-500 text-xs font-['Rationale']">({t('leaveBlankToKeepCurrent')})</span>}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full bg-black/60 border ${formErrors.password ? 'border-red-500' : 'border-cyan-900/40'} rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50`}
                  />
                  {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-cyan-300 font-['Orbitron']">
                    {t('role')}
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`w-full bg-black/60 border ${formErrors.role ? 'border-red-500' : 'border-cyan-900/40'} rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer`}
                  >
                    <option value="user">{t('userRole')}</option>
                    <option value="admin">{t('adminRole')}</option>
                  </select>
                  {formErrors.role && <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>}
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium mb-1 text-cyan-300 font-['Orbitron']">
                  {t('contactInformation')}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Phone */}
                  <div className="col-span-2">
                    <input
                      type="text"
                      name="phone_number"
                      placeholder={t('phoneNumber')}
                      value={formData.phone_number || ''}
                      onChange={handleInputChange}
                      className="w-full bg-black/60 border border-cyan-900/40 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>

                  {/* City & Country in same row */}
                  <div>
                    <input
                      type="text"
                      name="city"
                      placeholder={t('city')}
                      value={formData.city || ''}
                      onChange={handleInputChange}
                      className="w-full bg-black/60 border border-cyan-900/40 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>

                  {/* Zip Code */}
                  <div>
                    <input
                      type="text"
                      name="zip_code"
                      placeholder={t('zipCode')}
                      value={formData.zip_code || ''}
                      onChange={handleInputChange}
                      className="w-full bg-black/60 border border-cyan-900/40 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>

                  {/* Address & Country */}
                  <div className="col-span-2 md:col-span-3">
                    <input
                      type="text"
                      name="address"
                      placeholder={t('address')}
                      value={formData.address || ''}
                      onChange={handleInputChange}
                      className="w-full bg-black/60 border border-cyan-900/40 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <input
                      type="text"
                      name="country"
                      placeholder={t('country')}
                      value={formData.country || ''}
                      onChange={handleInputChange}
                      className="w-full bg-black/60 border border-cyan-900/40 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-800 transition-colors font-['Orbitron'] cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 rounded-md text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-['Orbitron'] cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      {t('processing')}
                    </>
                  ) : isCreating ? (
                    <>{t('createUser')}</>
                  ) : (
                    <>{t('updateUser')}</>
                  )}
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <Modal
            isOpen={!!confirmDelete}
            onClose={handleCancelDelete}
            title={t('confirmDelete')}
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-900/20 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <p className="text-white mb-2 text-lg font-medium font-['Orbitron']">{t('deleteUser')}</p>
              <p className="text-gray-400 mb-6">
                {t('deleteUserConfirmation', { name: <span className="text-white font-medium font-['Orbitron']">{confirmDelete.name}</span> })}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleCancelDelete}
                  className="px-5 py-2.5 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-800 transition-colors font-['Orbitron'] cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 rounded-md text-white transition-colors disabled:opacity-50 flex items-center font-['Orbitron'] cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      {t('processing')}
                    </>
                  ) : (
                    <>{t('delete')}</>
                  )}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default UserManagement; 