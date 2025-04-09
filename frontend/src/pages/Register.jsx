import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import '../styles/animations.css';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const { register } = useAuth();
  const navigate = useNavigate();
  
  // Loading State for Submit Button
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    agreeTerms: false
  });
  
  // Error State
  const [errors, setErrors] = useState({});
  
  // Success State
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear Error when User Types
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  // Validate form with Translated Error Messages
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = language === 'fr' ? 'Le prénom est requis' : 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = language === 'fr' ? 'Le nom est requis' : 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = language === 'fr' ? 'L\'email est requis' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = language === 'fr' ? 'L\'adresse email est invalide' : 'Email address is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = language === 'fr' ? 'Le mot de passe est requis' : 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = language === 'fr' ? 'Le mot de passe doit contenir au moins 8 caractères' : 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = language === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = language === 'fr' ? 'Le numéro de téléphone est requis' : 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = language === 'fr' ? 'Le numéro de téléphone doit comporter 10 chiffres' : 'Phone number must be 10 digits';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = language === 'fr' ? 'Vous devez accepter les conditions d\'utilisation' : 'You must agree to the terms and conditions';
    }
    
    return newErrors;
  };

  // Handle form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    // Set loading state
    setIsLoading(true);
    
    // Use auth context to register
    try {
      const result = await register({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        phone_number: formData.phoneNumber,
        address: formData.address,
        city: formData.city,
        zip_code: formData.zipCode,
        country: formData.country
      });
      
      if (result.success) {
        setIsSuccess(true);
        
        // Redirect to login page after successful registration
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrors({
          general: result.error || (language === 'fr' ? 'Échec de l\'inscription' : 'Registration failed')
        });
      }
    } catch (error) {
      setErrors({
        general: error.message || (language === 'fr' ? 'Échec de l\'inscription' : 'Registration failed')
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Common Input Styling
  const inputClassName = (name) => `w-full bg-black/40 border ${
    errors[name] ? 'border-red-500' : 'border-cyan-900/40'
  } rounded-md px-4 h-12 text-white 
    focus:outline-none focus:ring-2 focus:ring-cyan-500/50
    font-['Orbitron'] 
    text-sm
    transition-all duration-300
    group-hover:border-cyan-400/30
    group-hover:bg-black/60
    placeholder-gray-500
    shadow-inner shadow-cyan-900/5`;

  return (
    <div className="bg-black text-white min-h-screen font-['Orbitron'] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-black" />
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-20"
        >
          <source src={assets.hero.loginbg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 py-10">

        <div className="w-full max-w-xl bg-gradient-to-b from-black/90 via-black/80 to-black/90 backdrop-blur-xl rounded-xl p-8 shadow-2xl border border-cyan-900/20 relative z-10 animate-fade-in-up overflow-hidden">
          
          {/* Glowing Borders */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
          <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>
          <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>
          
          {/* Form Header */}
          <div className="text-center mb-8 relative">
            <h1 className="text-3xl md:text-4xl font-regular mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
              {t('createYourAccount')}
            </h1>
            <p className="text-sm md:text-base text-gray-300 font-['Orbitron']">
              {t('joinPremiumService')}
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-4"></div>
          </div>

          {/* Success Message */}
          {isSuccess && (
            <div className="mb-6 p-4 bg-gradient-to-r from-cyan-500/10 to-green-500/10 border border-cyan-500/30 rounded-md text-center animate-fade-in">
              <p className="text-cyan-300">{language === 'fr' 
                ? 'Inscription réussie ! Vous allez être redirigé vers la page de connexion.' 
                : 'Registration successful! You will be redirected to the login page.'}</p>
            </div>
          )}

          {/* Error Message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-red-500/10 border border-red-500/30 rounded-md text-center animate-fade-in">
              <p className="text-red-400">{errors.general}</p>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="animate-fade-in relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <div className="mb-5 group">
                <label className="block text-sm font-medium text-cyan-300 mb-1.5 group-hover:text-white transition-colors">{t('firstName')}</label>
                <div className="relative">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder={t('enterFirstName')}
                    className={inputClassName('firstName')}
                    autoComplete="off"
                  />
                </div>
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>

              <div className="mb-5 group">
                <label className="block text-sm font-medium text-cyan-300 mb-1.5 group-hover:text-white transition-colors">{t('lastName')}</label>
                <div className="relative">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder={t('enterLastName')}
                    className={inputClassName('lastName')}
                    autoComplete="off"
                  />
                </div>
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="mb-5 group">
              <label className="block text-sm font-medium text-cyan-300 mb-1.5 group-hover:text-white transition-colors">{t('emailAddress')}</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('enterEmail')}
                  className={inputClassName('email')}
                  autoComplete="off"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <div className="mb-5 group">
                <label className="block text-sm font-medium text-cyan-300 mb-1.5 group-hover:text-white transition-colors">{t('password')}</label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('enterPassword')}
                    className={inputClassName('password')}
                    autoComplete="off"
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="mb-5 group">
                <label className="block text-sm font-medium text-cyan-300 mb-1.5 group-hover:text-white transition-colors">{t('confirmPassword')}</label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t('confirmYourPassword')}
                    className={inputClassName('confirmPassword')}
                    autoComplete="off"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="mb-5 group">
              <label className="block text-sm font-medium text-cyan-300 mb-1.5 group-hover:text-white transition-colors">{t('phoneNumber')}</label>
              <div className="relative">
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder={t('enterPhoneNumber')}
                  className={inputClassName('phoneNumber')}
                  autoComplete="off"
                />
              </div>
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>

            <div className="mb-5 group">
              <label className="block text-sm font-medium text-cyan-300 mb-1.5 group-hover:text-white transition-colors">{t('address')}</label>
              <div className="relative">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder={t('enterAddress')}
                  className={inputClassName('address')}
                  autoComplete="off"
                />
              </div>
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
              <div className="mb-5 group">
                <label className="block text-sm font-medium text-cyan-300 mb-1.5 group-hover:text-white transition-colors">{t('city')}</label>
                <div className="relative">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder={t('enterCity')}
                    className={inputClassName('city')}
                    autoComplete="off"
                  />
                </div>
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>

              <div className="mb-5 group">
                <label className="block text-sm font-medium text-cyan-300 mb-1.5 group-hover:text-white transition-colors">{t('zipCode')}</label>
                <div className="relative">
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder={t('enterZipCode')}
                    className={inputClassName('zipCode')}
                    autoComplete="off"
                  />
                </div>
                {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
              </div>

              <div className="mb-5 group">
                <label className="block text-sm font-medium text-cyan-300 mb-1.5 group-hover:text-white transition-colors">{t('country')}</label>
                <div className="relative">
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder={t('enterCountry')}
                    className={inputClassName('country')}
                    autoComplete="off"
                  />
                </div>
                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="w-4 h-4 bg-transparent border-cyan-800 rounded focus:ring-cyan-500 text-cyan-500 cursor-pointer"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeTerms" className="text-gray-300 hover:text-cyan-300 transition-colors duration-300">
                    {t('agreeToTerms')}
                  </label>
                </div>
              </div>
              {errors.agreeTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeTerms}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3.5 text-base font-medium text-black bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white rounded-md transform transition-all duration-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none cursor-pointer relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-10 transition-opacity"></span>
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/10"></span>
              
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {language === 'fr' ? 'Traitement...' : 'Processing...'}
                </span>
              ) : (
                t('signUp')
              )}
            </button>

            {/* Link to Login */}
            <div className="text-center mt-8 relative">
              <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-800/30 to-transparent -z-10"></div>
              <span className="px-4 bg-black/60 backdrop-blur-sm relative inline-block">
                <p className="text-sm text-gray-400">
                  {t('alreadyHaveAccount')} 
                  <Link to="/login" className="ml-2 text-cyan-400 hover:text-white transition-colors duration-300 relative group">
                    {t('signIn')}
                    <span className="absolute left-0 bottom-0 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </p>
              </span>
            </div>
          </form>
        </div>
      </div>
      
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
};

export default RegisterPage;