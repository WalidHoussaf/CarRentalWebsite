import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { user, updateUserData, logout } = useAuth();
  const { language } = useLanguage();
  const t = useTranslations(language);
  const navigate = useNavigate();
  const { t: i18nextt } = useTranslation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
    city: '',
    zip_code: '',
    country: '',
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        city: user.city || '',
        zip_code: user.zip_code || '',
        country: user.country || '',
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = language === 'fr' ? 'Le nom est requis' : 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = language === 'fr' ? 'L\'email est requis' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = language === 'fr' ? 'L\'adresse email est invalide' : 'Email address is invalid';
    }
    
    if (formData.new_password) {
      if (!formData.current_password) {
        newErrors.current_password = language === 'fr' ? 'Le mot de passe actuel est requis' : 'Current password is required';
      }
      
      if (formData.new_password.length < 8) {
        newErrors.new_password = language === 'fr' 
          ? 'Le mot de passe doit contenir au moins 8 caractères' 
          : 'Password must be at least 8 characters';
      }
      
      if (formData.new_password !== formData.new_password_confirmation) {
        newErrors.new_password_confirmation = language === 'fr' 
          ? 'Les mots de passe ne correspondent pas' 
          : 'Passwords do not match';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      setMessage({
        type: 'success',
        text: t('profileUpdatedSuccessfully')
      });
      
      // Update the user data using the AuthContext function
      const updatedUser = { ...user, ...data.user };
      updateUserData(updatedUser);
      
      // Instead of refreshing the page, just stop editing mode
      setIsEditing(false);
      
      // Clear the success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
      
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message
      });
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setErrors({});
  };

  // Handle account deletion confirmation
  const showDeleteConfirmation = () => {
    setShowDeleteConfirm(true);
  };

  // Cancel account deletion
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Process account deletion
  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      
      // Use the correct API endpoint that matches your backend
      const token = localStorage.getItem('auth_token');
      await axios.delete('http://localhost:8000/api/user/delete', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Clear user data and redirect
      logout();
      navigate('/');
      
      // Optional: Show success message before redirect
      // (This might not be visible due to the redirect)
      setMessage({
        text: i18nextt('accountDeletedSuccess'),
        type: 'success'
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage({
        text: error.response?.data?.message || i18nextt('accountDeleteError'),
        type: 'error'
      });
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Common input style classes
  const inputClassName = (name) => `w-full bg-black/40 border ${
    errors[name] ? 'border-red-500' : 'border-cyan-900/40'
  } rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 ${
    errors[name] ? 'focus:ring-red-500/50' : 'focus:ring-cyan-500/50'
  } transition-all duration-300 hover:border-cyan-400/30 font-['Orbitron'] text-sm`;

  return (
    <div className="relative bg-black text-white min-h-screen pt-20 pb-12 font-['Orbitron']">
      {/* Simplified Background - Reduced number of elements and animations */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900/5 to-black pointer-events-none"></div>
      
      {/* Simplified Grid Lines - Lower opacity and larger grid size */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(to right, #3B82F6 1px, transparent 1px), linear-gradient(to bottom, #3B82F6 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}></div>
      </div>
      
      {/* Single static glow instead of multiple animated ones */}
      <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px]"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-sm rounded-xl p-8 border border-blue-900/20 shadow-lg">
          <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
            {t('myProfile')}
          </h1>
          
          {/* Tabs */}
          <div className="mb-8 border-b border-cyan-900/20">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('profile')}
                className={`pb-2 px-1 transition-all duration-300 ${
                  activeTab === 'profile' 
                    ? 'text-cyan-400 border-b-2 border-cyan-400' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {t('personalInformation')}
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`pb-2 px-1 transition-all duration-300 ${
                  activeTab === 'security' 
                    ? 'text-cyan-400 border-b-2 border-cyan-400' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {t('security')}
              </button>
            </div>
          </div>
          
          {message.text && (
            <div className={`mb-6 p-4 rounded-md animate-fade-in ${
              message.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}>
              {message.text}
            </div>
          )}
          
          {/* Delete Account Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
              <div className="w-full max-w-md bg-black border border-red-800/50 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-bold text-red-400 mb-4">
                  {t('confirmDeleteAccount')}
                </h3>
                <p className="text-gray-300 mb-6 font-['Rationale'] text-justify">
                  {t('deleteAccountConfirmMessage')}
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={cancelDelete}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-900/40 hover:bg-red-800/50 border border-red-700/60 rounded-md text-red-400 hover:text-red-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isDeleting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {language === 'fr' ? 'Suppression...' : 'Deleting...'}
                      </span>
                    ) : (
                      t('confirmDelete')
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'profile' && (
            <form onSubmit={handleSubmit}>
              <div className="mb-8 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-cyan-300">
                    {t('personalInformation')}
                  </h2>
                  <p className="text-gray-400 text-sm font-['Rationale']">
                    {isEditing ? t('updateYourPersonalInformation') : t('viewYourPersonalInformation')}
                  </p>
                </div>
                
                <button 
                  type="button"
                  onClick={toggleEdit}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-900/40 to-cyan-800/20 hover:from-cyan-700/40 hover:to-cyan-600/20 border border-cyan-900/40 hover:border-cyan-400/30 rounded-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  {isEditing ? t('cancel') : t('edit')}
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-1">
                      {t('name')}
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={inputClassName('name')}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                    ) : (
                      <p className="bg-black/30 px-4 py-2 rounded-md border border-cyan-900/20">
                        {user?.name || '–'}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-1">
                      {t('emailAddress')}
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={inputClassName('email')}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                    ) : (
                      <p className="bg-black/30 px-4 py-2 rounded-md border border-cyan-900/20">
                        {user?.email || '–'}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-1">
                      {t('phoneNumber')}
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          type="tel"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleChange}
                          className={inputClassName('phone_number')}
                        />
                        {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
                      </div>
                    ) : (
                      <p className="bg-black/30 px-4 py-2 rounded-md border border-cyan-900/20">
                        {user?.phone_number || '–'}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-1">
                      {t('userRole')}
                    </label>
                    <p className="bg-black/30 px-4 py-2 rounded-md border border-cyan-900/20">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-['Orbitron'] ${user?.role === 'admin' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-gray-500/20 text-gray-300'}`}>
                        {user?.role === 'admin' ? t('adminRole') : t('userRole')}
                      </span>
                    </p>
                  </div>
                </div>
                
                {/* Address Information */}
                <div className="pt-6 border-t border-cyan-900/20">
                  <h3 className="text-lg font-semibold text-cyan-300 mb-4">
                    {t('addressInformation')}
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-cyan-300 mb-1">
                        {t('address')}
                      </label>
                      {isEditing ? (
                        <div>
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={inputClassName('address')}
                          />
                          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>
                      ) : (
                        <p className="bg-black/30 px-4 py-2 rounded-md border border-cyan-900/20">
                          {user?.address || '–'}
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-cyan-300 mb-1">
                          {t('city')}
                        </label>
                        {isEditing ? (
                          <div>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              className={inputClassName('city')}
                            />
                            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                          </div>
                        ) : (
                          <p className="bg-black/30 px-4 py-2 rounded-md border border-cyan-900/20">
                            {user?.city || '–'}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-cyan-300 mb-1">
                          {t('zipCode')}
                        </label>
                        {isEditing ? (
                          <div>
                            <input
                              type="text"
                              name="zip_code"
                              value={formData.zip_code}
                              onChange={handleChange}
                              className={inputClassName('zip_code')}
                            />
                            {errors.zip_code && <p className="text-red-500 text-xs mt-1">{errors.zip_code}</p>}
                          </div>
                        ) : (
                          <p className="bg-black/30 px-4 py-2 rounded-md border border-cyan-900/20">
                            {user?.zip_code || '–'}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-cyan-300 mb-1">
                          {t('country')}
                        </label>
                        {isEditing ? (
                          <div>
                            <input
                              type="text"
                              name="country"
                              value={formData.country}
                              onChange={handleChange}
                              className={inputClassName('country')}
                            />
                            {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                          </div>
                        ) : (
                          <p className="bg-black/30 px-4 py-2 rounded-md border border-cyan-900/20">
                            {user?.country || '–'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Submit button - Only visible in edit mode */}
                {isEditing && (
                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-700 hover:from-cyan-600 hover:to-cyan-800 text-white rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105 cursor-pointer"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {language === 'fr' ? 'Enregistrement...' : 'Saving...'}
                        </span>
                      ) : (
                        t('saveChanges')
                      )}
                    </button>
                  </div>
                )}
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <>
              {/* Password Change Form */}
              <form onSubmit={handleSubmit} className="mb-12">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-cyan-300">
                    {t('changePassword')}
                  </h2>
                  <p className="text-gray-400 text-sm font-['Rationale']">
                    {t('updateYourPassword')}
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-1">
                      {t('currentPassword')}
                    </label>
                    <div>
                      <input
                        type="password"
                        name="current_password"
                        value={formData.current_password}
                        onChange={handleChange}
                        className={inputClassName('current_password')}
                      />
                      {errors.current_password && <p className="text-red-500 text-xs mt-1">{errors.current_password}</p>}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-cyan-300 mb-1">
                        {t('newPassword')}
                      </label>
                      <div>
                        <input
                          type="password"
                          name="new_password"
                          value={formData.new_password}
                          onChange={handleChange}
                          className={inputClassName('new_password')}
                        />
                        {errors.new_password && <p className="text-red-500 text-xs mt-1">{errors.new_password}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-cyan-300 mb-1">
                        {t('confirmNewPassword')}
                      </label>
                      <div>
                        <input
                          type="password"
                          name="new_password_confirmation"
                          value={formData.new_password_confirmation}
                          onChange={handleChange}
                          className={inputClassName('new_password_confirmation')}
                        />
                        {errors.new_password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.new_password_confirmation}</p>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-700 hover:from-cyan-600 hover:to-cyan-800 text-white rounded-md transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105 cursor-pointer"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {language === 'fr' ? 'Enregistrement...' : 'Saving...'}
                        </span>
                      ) : (
                        t('saveChanges')
                      )}
                    </button>
                  </div>
                </div>
              </form>
        
              {/* Danger Zone */}
              <div className="pt-6 border-t border-red-900/20">
                <h3 className="text-lg font-semibold text-red-400 mb-4">
                  {t('dangerZone')}
                </h3>
                
                <div className="bg-red-950/10 border border-red-800/20 rounded-md p-4">
                  <h4 className="text-white mb-2">{t('deleteAccount')}</h4>
                  <p className="text-gray-400 text-2xs mb-4 font-['Rationale']">
                    {t('deleteAccountWarning')}
                  </p>
                  
                  <div className="pt-6">
                    <button 
                      type="button"
                      onClick={showDeleteConfirmation}
                      className="px-5 py-2.5 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/40 rounded-md transition-all duration-300 cursor-pointer"
                    >
                      {t('deleteMyAccount')}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 