import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';
import { assets } from '../../assets/assets';

// Car Edit Form Component
const CarEditForm = ({ car, onSubmit, processing, onCancel, t }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    daily_rate: '',
    description: '',
    category: 'luxury',
    color: '',
    transmission: '',
    seats: '',
    doors: '',
    air_conditioning: true,
    gps: true,
    bluetooth: true,
    usb: true,
    fuel_type: '',
    license_plate: '',
    is_available: true,
    image: null
  });
  
  // Preview image state
  const [imagePreview, setImagePreview] = useState(null);
  
  // Initialize form with car data if editing
  useEffect(() => {
    if (car) {
      setFormData({
        name: car.name || '',
        brand: car.brand || '',
        model: car.model || '',
        year: car.year || new Date().getFullYear(),
        daily_rate: car.daily_rate || '',
        description: car.description || '',
        category: car.category || 'luxury',
        color: car.color || '',
        transmission: car.transmission || '',
        seats: car.seats || '',
        doors: car.doors || '',
        air_conditioning: car.air_conditioning === undefined ? true : car.air_conditioning,
        gps: car.gps === undefined ? true : car.gps,
        bluetooth: car.bluetooth === undefined ? true : car.bluetooth,
        usb: car.usb === undefined ? true : car.usb,
        fuel_type: car.fuel_type || '',
        license_plate: car.license_plate || '',
        is_available: car.is_available === undefined ? true : car.is_available,
        image: null
      });
      
      // Set image preview for existing cars
      if (car.id >= 1 && car.id <= 16) {
        setImagePreview(assets.cars[`car${car.id}`]);
      } else if (car.image) {
        setImagePreview(
          car.image.startsWith('http') 
            ? car.image 
            : `http://127.0.0.1:8000/storage/${car.image}`
        );
      }
    }
  }, [car]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      // Handle file upload
      const file = files[0];
      if (file) {
        setFormData(prev => ({ ...prev, image: file }));
        
        // Create a preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert fields to appropriate types
    const processedData = {
      ...formData,
      year: String(formData.year),
      daily_rate: parseFloat(formData.daily_rate),
      seats: formData.seats ? parseInt(formData.seats, 10) : null,
      doors: formData.doors ? parseInt(formData.doors, 10) : null
    };
    
    onSubmit(processedData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info Section */}
        <div className="space-y-4">
          <h3 className="text-cyan-400 font-medium font-['Orbitron']">{t('basicInfo') || "Basic Information"}</h3>
          
          <div className="space-y-2">
            <label className="block text-gray-400">{t('carName') || "Car Name"}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-black/60 border border-cyan-900/30 rounded-lg focus:outline-none focus:border-cyan-500 transition-all text-white"
              placeholder="Mercedes-Benz S-Class"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-gray-400">{t('brand') || "Brand"}</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-black/60 border border-cyan-900/30 rounded-lg focus:outline-none focus:border-cyan-500 transition-all text-white"
              placeholder="Mercedes-Benz"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-gray-400">{t('model') || "Model"}</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-black/60 border border-cyan-900/30 rounded-lg focus:outline-none focus:border-cyan-500 transition-all text-white"
              placeholder="S-Class"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-gray-400">{t('year') || "Year"}</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min="1900"
                max="2100"
                className="w-full px-4 py-2 bg-black/60 border border-cyan-900/30 rounded-lg focus:outline-none focus:border-cyan-500 transition-all text-white"
                placeholder="2023"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-gray-400">{t('dailyRate') || "Daily Rate"}</label>
              <input
                type="number"
                name="daily_rate"
                value={formData.daily_rate}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 bg-black/60 border border-cyan-900/30 rounded-lg focus:outline-none focus:border-cyan-500 transition-all text-white"
                placeholder="350.00"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-gray-400">{t('category') || "Category"}</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-black/60 border border-cyan-900/30 rounded-lg focus:outline-none focus:border-cyan-500 transition-all text-white"
            >
              <option value="luxury">{t('luxury') || "Luxury"}</option>
              <option value="sport">{t('sport') || "Sport"}</option>
              <option value="suv">{t('suv') || "SUV"}</option>
              <option value="economy">{t('economy') || "Economy"}</option>
              <option value="compact">{t('compact') || "Compact"}</option>
              <option value="midsize">{t('midsize') || "Midsize"}</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-gray-400">{t('description') || "Description"}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 bg-black/60 border border-cyan-900/30 rounded-lg focus:outline-none focus:border-cyan-500 transition-all text-white"
              placeholder="Experience ultimate luxury with the Mercedes-Benz S-Class..."
            ></textarea>
          </div>
        </div>
        
        {/* Specifications Section */}
        <div className="space-y-4">
          <h3 className="text-cyan-400 font-medium font-['Orbitron']">{t('specifications') || "Specifications"}</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-gray-400">{t('color') || "Color"}</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/60 border border-cyan-900/30 rounded-lg focus:outline-none focus:border-cyan-500 transition-all text-white"
                placeholder="Silver"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-gray-400">{t('licensePlate') || "License Plate"}</label>
              <input
                type="text"
                name="license_plate"
                value={formData.license_plate}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/60 border border-cyan-900/30 rounded-lg focus:outline-none focus:border-cyan-500 transition-all text-white"
                placeholder="MB-12345"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-gray-400">{t('transmission') || "Transmission"}</label>
            <input
              type="text"
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-black/60 border border-cyan-900/30 rounded-lg focus:outline-none focus:border-cyan-500 transition-all text-white"
              placeholder="9-Speed Automatic"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-gray-400">{t('fuel') || "Fuel Type"}</label>
            <input
              type="text"
              name="fuel_type"
              value={formData.fuel_type}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-black/60 border border-cyan-900/30 rounded-lg focus:outline-none focus:border-cyan-500 transition-all text-white"
              placeholder="Gasoline"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-gray-400">{t('seats') || "Seats"}</label>
              <input
                type="number"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                min="1"
                max="20"
                className="w-full px-4 py-2 bg-black/60 border border-cyan-900/30 rounded-lg focus:outline-none focus:border-cyan-500 transition-all text-white"
                placeholder="5"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-gray-400">{t('doors') || "Doors"}</label>
              <input
                type="number"
                name="doors"
                value={formData.doors}
                onChange={handleChange}
                min="1"
                max="10"
                className="w-full px-4 py-2 bg-black/60 border border-cyan-900/30 rounded-lg focus:outline-none focus:border-cyan-500 transition-all text-white"
                placeholder="4"
              />
            </div>
          </div>
          
          <h3 className="text-cyan-400 font-medium font-['Orbitron'] mt-6">{t('features') || "Features"}</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="air_conditioning"
                checked={formData.air_conditioning}
                onChange={handleChange}
                className="w-4 h-4 bg-black border border-cyan-900/30 rounded focus:ring-cyan-500 focus:ring-offset-gray-900"
              />
              <label className="text-gray-200">{t('airConditioning') || "Air Conditioning"}</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="gps"
                checked={formData.gps}
                onChange={handleChange}
                className="w-4 h-4 bg-black border border-cyan-900/30 rounded focus:ring-cyan-500 focus:ring-offset-gray-900"
              />
              <label className="text-gray-200">{t('gps') || "GPS Navigation"}</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="bluetooth"
                checked={formData.bluetooth}
                onChange={handleChange}
                className="w-4 h-4 bg-black border border-cyan-900/30 rounded focus:ring-cyan-500 focus:ring-offset-gray-900"
              />
              <label className="text-gray-200">{t('bluetooth') || "Bluetooth"}</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="usb"
                checked={formData.usb}
                onChange={handleChange}
                className="w-4 h-4 bg-black border border-cyan-900/30 rounded focus:ring-cyan-500 focus:ring-offset-gray-900"
              />
              <label className="text-gray-200">{t('usb') || "USB Ports"}</label>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4">
            <input
              type="checkbox"
              name="is_available"
              checked={formData.is_available}
              onChange={handleChange}
              className="w-4 h-4 bg-black border border-cyan-900/30 rounded focus:ring-cyan-500 focus:ring-offset-gray-900"
            />
            <label className="text-gray-200">{t('isAvailable') || "Available for Rent"}</label>
          </div>
          
          <div className="space-y-2 mt-6">
            <label className="block text-gray-400">{t('image') || "Car Image"}</label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                  className="w-full px-4 py-2 bg-black/60 border border-cyan-900/30 rounded-lg focus:outline-none focus:border-cyan-500 transition-all text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-900/30 file:text-cyan-300 hover:file:bg-cyan-900/50"
                />
                <p className="text-xs text-gray-500 mt-1">{t('imageNote') || "Leave empty to keep current image when editing"}</p>
              </div>
              {imagePreview && (
                <div className="w-16 h-16 rounded bg-gray-800 overflow-hidden flex items-center justify-center border border-cyan-900/30">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-4 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-700 text-gray-300 rounded-md hover:bg-gray-800 transition-colors font-['Orbitron'] cursor-pointer"
          disabled={processing}
        >
          {t('cancel') || "Cancel"}
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors font-['Orbitron'] cursor-pointer"
          disabled={processing}
        >
          {processing ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2 inline-block"></div>
              {t('processing') || "Processing..."}
            </>
          ) : (
            car ? (t('updateCar') || "Update Car") : (t('createCar') || "Create Car")
          )}
        </button>
      </div>
    </form>
  );
};

// Page title component (reused from other admin pages)
const PageTitle = ({ title, subtitle, actions }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
    <div>
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron']">
        {title}
      </h1>
      {subtitle && <p className="text-gray-400 mt-1 font-['Rationale']">{subtitle}</p>}
    </div>
    {actions && <div className="mt-4 md:mt-0">{actions}</div>}
  </div>
);

const CarManagement = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { language } = useLanguage();
  const t = useTranslations(language);
  const navigate = useNavigate();
  
  // State
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Ref for dropdown
  const dropdownButtonRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownButtonRef.current && !dropdownButtonRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);
  
  // Fetch cars on component mount
  useEffect(() => {
    const fetchCars = async () => {
      if (!isAuthenticated || !isAdmin()) {
        setErrorMessage('You do not have permission to access this page');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await adminService.getAllCars();
        
        // Check if we have cars data
        if (response.data) {
          setCars(response.data);
        } else if (Array.isArray(response)) {
          setCars(response);
        } else if (response.success && Array.isArray(response.data)) {
          setCars(response.data);
        } else {
          // Error handling for unexpected response format
          setErrorMessage('Unexpected response format');
        }
      } catch (err) {
        console.error('Error fetching cars:', err);
        setErrorMessage(err.message || 'Failed to load cars');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [isAuthenticated, isAdmin]);

  // Filter cars based on search term and category filter
  const filteredCars = useMemo(() => {
    // Skip filtering if no cars yet
    if (!cars || cars.length === 0) {
      return [];
    }
    
    return cars.filter(car => {
      // Search term filtering
      const searchMatches = !searchTerm || 
                            car.id?.toString().includes(searchTerm) ||
                            car.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            car.year?.toString().includes(searchTerm);
      
      // If search doesn't match, no need to check category
      if (!searchMatches) return false;
      
      // Category filtering (only if a category is selected)
      if (!categoryFilter) {
        return true; // No category filter applied, include all
      }
      
      // Special case for sports/sport category to handle both singular and plural forms
      if (categoryFilter.toLowerCase() === 'sports' && car.category?.toLowerCase() === 'sport') {
        return true;
      }
      
      // Check if the car category matches the filter
      return car.category?.toLowerCase() === categoryFilter.toLowerCase();
    });
  }, [cars, searchTerm, categoryFilter]);

  // Handler for viewing car details
  const handleViewDetails = (car) => {
    setSelectedCar(car);
    setShowDetailsModal(true);
  };
  
  // Handler for editing a car
  const handleEditCar = (car) => {
    setSelectedCar(car);
    setShowEditModal(true);
  };
  
  // Handler for opening delete confirmation modal
  const handleDeleteConfirm = (car) => {
    setSelectedCar(car);
    setShowDeleteModal(true);
  };
  
  // Handler for toggling car availability
  const handleToggleAvailability = async (carId) => {
    try {
      setProcessing(true);
      await adminService.toggleCarAvailability(carId);
      
      // Update the cars state with the updated availability
      setCars(cars.map(car => 
        car.id === carId ? { ...car, is_available: !car.is_available } : car
      ));
      
      // Show success message
      setMessage({
        type: 'success',
        text: t('carAvailabilityUpdated') || 'Car availability updated successfully'
      });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error toggling car availability:', err);
      setMessage({
        type: 'error',
        text: err.message || 'Failed to update car availability'
      });
    } finally {
      setProcessing(false);
    }
  };
  
  // Handler for deleting a car
  const handleDelete = async () => {
    if (!selectedCar) return;
    
    try {
      setProcessing(true);
      await adminService.deleteCar(selectedCar.id);
      
      // Update the cars state by removing the deleted car
      setCars(cars.filter(car => car.id !== selectedCar.id));
      
      // Show success message
      setMessage({
        type: 'success',
        text: t('carDeleted') || 'Car deleted successfully'
      });
      
      // Hide modal
      setShowDeleteModal(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting car:', err);
      setMessage({
        type: 'error',
        text: err.message || 'Failed to delete car'
      });
    } finally {
      setProcessing(false);
    }
  };

  // Render loading state
  if (loading && cars.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }
  
  // Render error state
  if (errorMessage || !isAuthenticated || !isAdmin()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-black/80 backdrop-blur-lg p-8 rounded-lg shadow-lg border border-red-500/20 max-w-md w-full">
          <h2 className="text-red-500 text-2xl mb-4 font-['Orbitron']">Access Denied</h2>
          <p className="text-white mb-6 font-['Rationale']">{errorMessage || 'You do not have permission to access this page'}</p>
          <button 
            onClick={() => navigate('/')}
            className="block w-full text-center bg-gradient-to-r from-cyan-500 to-cyan-700 text-white py-2 rounded-md hover:from-cyan-600 hover:to-cyan-800 transition-all duration-300 font-['Orbitron'] cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen pt-20 pb-12 px-4 font-['Rationale']">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <PageTitle
          title={t('carManagement') || "Car Management"}
          subtitle={t('carManagementSubtitle') || "Manage your fleet of vehicles"}
          actions={
            <button
              onClick={() => {
                setSelectedCar(null);
                setShowEditModal(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white rounded-md hover:from-cyan-600 hover:to-cyan-800 transition-all duration-300 flex items-center font-['Orbitron'] cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              {t('addNewCar') || "Add New Car"}
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

        {/* Filters and Search */}
        <div className="bg-gray-900/50 border border-cyan-900/30 rounded-lg p-4 mb-6 backdrop-blur-sm relative" style={{ zIndex: 20 }}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <input
                type="text"
                placeholder={t('searchCars') || "Search cars by name, brand, model..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-black/60 border border-cyan-900/30 rounded-lg focus:outline-none focus:border-cyan-500 transition-all text-white font-['Orbitron']"
                style={{
                  boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)',
                  paddingLeft: '40px',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '10px center',
                  backgroundSize: '20px',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2306b6d4'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'%3E%3C/path%3E%3C/svg%3E")`
                }}
              />
            </div>
            <div>
              {/* Category filter dropdown */}
              <div className="relative" style={{ zIndex: 100 }}>
                <button
                  type="button"
                  ref={dropdownButtonRef}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`w-full md:w-48 flex items-center justify-between px-4 py-2 bg-black/60 border border-cyan-900/30 rounded-lg focus:outline-none hover:border-cyan-500/50 transition-all text-white font-['Orbitron'] relative ${dropdownOpen ? 'rounded-b-none border-b-0 border-cyan-900/50' : ''}`}
                  style={{
                    boxShadow: dropdownOpen ? 'none' : '0 0 10px rgba(6, 182, 212, 0.2)',
                    position: 'relative',
                    zIndex: 100,
                    minWidth: '12rem'
                  }}
                >
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
                    {!categoryFilter ? (t('allCategories') || "All Categories") : 
                     (t(categoryFilter) || categoryFilter)}
                  </span>
                  <svg
                    className={`w-4 h-4 ml-2 transition-transform duration-200 text-cyan-400 ${dropdownOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  
                  {dropdownOpen && (
                    <div className="absolute left-0 mt-0 w-full bg-black/80 backdrop-blur-md border border-cyan-900/50 rounded-b-md shadow-lg py-1 z-10"
                      style={{
                        top: 'calc(100% - 1px)',
                        borderTop: 'none',
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                        boxShadow: '0 5px 20px rgba(8, 145, 178, 0.3)'
                      }}
                    >
                      <button
                        onClick={() => {
                          setCategoryFilter('');
                          setDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm font-['Orbitron'] text-gray-200 hover:bg-cyan-900/20 hover:text-cyan-400 transition-colors flex items-center"
                        style={{ paddingLeft: '16px', paddingRight: '16px' }}
                      >
                        {!categoryFilter && <div className="w-2 h-2 rounded-full bg-cyan-400 mr-2"></div>}
                        <span className={!categoryFilter ? 'font-medium' : ''}>
                          {t('allCategories') || "All Categories"}
                        </span>
                      </button>
                      
                      {['economy', 'compact', 'midsize', 'suv', 'luxury', 'sports'].map(category => (
                        <button
                          key={category}
                          onClick={() => {
                            setCategoryFilter(category);
                            setDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm font-['Orbitron'] text-gray-200 hover:bg-cyan-900/20 hover:text-cyan-400 transition-colors flex items-center"
                          style={{ paddingLeft: '16px', paddingRight: '16px' }}
                        >
                          {categoryFilter === category && <div className="w-2 h-2 rounded-full bg-cyan-400 mr-2"></div>}
                          <span className={categoryFilter === category ? 'font-medium' : ''}>
                            {t(category) || category.charAt(0).toUpperCase() + category.slice(1)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cars Table */}
        <div className="bg-gray-900/50 border border-cyan-900/30 rounded-lg overflow-hidden backdrop-blur-sm relative" style={{ zIndex: 10 }}>
          {filteredCars.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              <p className="text-lg font-['Orbitron']">{t('noCarsFound') || "No cars found"}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-cyan-900/30 border-b border-cyan-900/50">
                    <th className="px-4 py-3 text-sm font-medium text-cyan-300 font-['Orbitron']">{t('carID') || "ID"}</th>
                    <th className="px-4 py-3 text-sm font-medium text-cyan-300 font-['Orbitron']">{t('image') || "Image"}</th>
                    <th className="px-4 py-3 text-sm font-medium text-cyan-300 font-['Orbitron']">{t('carName') || "Name"}</th>
                    <th className="px-4 py-3 text-sm font-medium text-cyan-300 font-['Orbitron']">{t('brand') || "Brand"}</th>
                    <th className="px-4 py-3 text-sm font-medium text-cyan-300 font-['Orbitron']">{t('model') || "Model"}</th>
                    <th className="px-4 py-3 text-sm font-medium text-cyan-300 font-['Orbitron']">{t('category') || "Category"}</th>
                    <th className="px-4 py-3 text-sm font-medium text-cyan-300 font-['Orbitron']">{t('dailyRate') || "Daily Rate"}</th>
                    <th className="px-4 py-3 text-sm font-medium text-cyan-300 font-['Orbitron']">{t('status') || "Status"}</th>
                    <th className="px-4 py-3 text-sm font-medium text-cyan-300 text-right font-['Orbitron']">{t('actions') || "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredCars.map((car) => (
                    <tr key={car.id} className="hover:bg-cyan-900/10 transition-colors duration-150">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-base text-cyan-100 font-['Orbitron']">#{car.id}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="h-12 w-12 rounded bg-gray-800 overflow-hidden flex items-center justify-center">
                          {(() => {
                            // Try to get image from assets based on car ID
                            let imageSource = null;
                            if (car.id >= 1 && car.id <= 16) {
                              imageSource = assets.cars[`car${car.id}`];
                            } else if (car.image) {
                              imageSource = car.image.startsWith('http') 
                                ? car.image 
                                : `http://127.0.0.1:8000/storage/${car.image}`;
                            }

                            return imageSource ? (
                              <img
                                src={imageSource}
                                alt={car.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = assets.cars.car1; // Fallback to first car if image fails
                                }}
                              />
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            )
                          })()}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-base font-medium text-white">{car.name}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-base text-gray-100">{car.brand}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-base text-gray-100">{car.model}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-base text-gray-100">
                          {t(car.category) || car.category.charAt(0).toUpperCase() + car.category.slice(1)}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-base font-medium text-cyan-100">
                          ${parseFloat(car.daily_rate).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full font-['Orbitron'] ${
                          car.is_available
                            ? 'bg-green-900/50 text-green-300 border border-green-800/50'
                            : 'bg-red-900/50 text-red-300 border border-red-800/50'
                        }`}>
                          {car.is_available ? (t('available') || 'Available') : (t('unavailable') || 'Unavailable')}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => handleViewDetails(car)}
                            className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                            title={t('viewDetails') || "View Details"}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleToggleAvailability(car.id)}
                            className={`p-2 rounded transition-colors cursor-pointer ${
                              car.is_available
                                ? 'bg-red-900/50 hover:bg-red-900 text-red-400 hover:text-red-300'
                                : 'bg-green-900/50 hover:bg-green-900 text-green-400 hover:text-green-300'
                            }`}
                            title={car.is_available ? (t('markAsUnavailable') || "Mark as Unavailable") : (t('markAsAvailable') || "Mark as Available")}
                          >
                            {car.is_available ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => handleEditCar(car)}
                            className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer"
                            title={t('editCar') || "Edit Car"}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteConfirm(car)}
                            className="p-2 bg-red-900/50 hover:bg-red-900 text-red-400 hover:text-red-300 rounded transition-colors cursor-pointer"
                            title={t('deleteCar') || "Delete Car"}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
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
      </div>
      
      {/* Car Details Modal */}
      {showDetailsModal && selectedCar && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50 pt-20 px-4 pb-4 overflow-y-auto">
          <div className="bg-gray-900/90 rounded-xl border border-cyan-800/30 p-6 max-w-3xl w-full mt-2 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-cyan-400 font-['Orbitron']">{t('carDetails') || "Car Details"}</h2>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Car Image */}
              <div className="bg-black/50 rounded-lg overflow-hidden border border-cyan-900/30 flex items-center justify-center">
                {(() => {
                  // Try to get image from assets based on car ID
                  let imageSource = null;
                  if (selectedCar.id >= 1 && selectedCar.id <= 16) {
                    imageSource = assets.cars[`car${selectedCar.id}`];
                  } else if (selectedCar.image) {
                    imageSource = selectedCar.image.startsWith('http') 
                      ? selectedCar.image 
                      : `http://127.0.0.1:8000/storage/${selectedCar.image}`;
                  }

                  return imageSource ? (
                    <img
                      src={imageSource}
                      alt={selectedCar.name}
                      className="w-full h-auto object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = assets.cars.car1; // Fallback to first car if image fails
                      }}
                    />
                  ) : (
                    <div className="h-48 w-full flex items-center justify-center bg-gray-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )
                })()}
              </div>
              
              {/* Car Basic Info */}
              <div className="bg-black/50 rounded-lg p-4 border border-cyan-900/30">
                <h3 className="text-cyan-400 font-medium mb-4 font-['Orbitron']">{t('basicInfo') || "Basic Information"}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('carName') || "Name"}:</span>
                    <span className="text-white">{selectedCar.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('brand') || "Brand"}:</span>
                    <span className="text-white">{selectedCar.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('model') || "Model"}:</span>
                    <span className="text-white">{selectedCar.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('year') || "Year"}:</span>
                    <span className="text-white">{selectedCar.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('category') || "Category"}:</span>
                    <span className="text-white">{t(selectedCar.category) || selectedCar.category.charAt(0).toUpperCase() + selectedCar.category.slice(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('dailyRate') || "Daily Rate"}:</span>
                    <span className="text-white">${parseFloat(selectedCar.daily_rate).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('status') || "Status"}:</span>
                    <span className={selectedCar.is_available ? 'text-green-400' : 'text-red-400'}>
                      {selectedCar.is_available ? (t('available') || "Available") : (t('unavailable') || "Unavailable")}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Car Specifications */}
              <div className="bg-black/50 rounded-lg p-4 border border-cyan-900/30">
                <h3 className="text-cyan-400 font-medium mb-4 font-['Orbitron']">{t('specifications') || "Specifications"}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('color') || "Color"}:</span>
                    <span className="text-white">{selectedCar.color || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('transmission') || "Transmission"}:</span>
                    <span className="text-white">{selectedCar.transmission || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('fuel') || "Fuel Type"}:</span>
                    <span className="text-white">{selectedCar.fuel_type || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('seats') || "Seats"}:</span>
                    <span className="text-white">{selectedCar.seats || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('doors') || "Doors"}:</span>
                    <span className="text-white">{selectedCar.doors || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('licensePlate') || "License Plate"}:</span>
                    <span className="text-white">{selectedCar.license_plate || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              {/* Features */}
              <div className="bg-black/50 rounded-lg p-4 border border-cyan-900/30">
                <h3 className="text-cyan-400 font-medium mb-4 font-['Orbitron']">{t('features') || "Features"}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`flex items-center space-x-2 ${selectedCar.air_conditioning ? 'text-green-300' : 'text-gray-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t('airConditioning') || "Air Conditioning"}</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${selectedCar.gps ? 'text-green-300' : 'text-gray-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t('gps') || "GPS Navigation"}</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${selectedCar.bluetooth ? 'text-green-300' : 'text-gray-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t('bluetooth') || "Bluetooth"}</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${selectedCar.usb ? 'text-green-300' : 'text-gray-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t('usb') || "USB Ports"}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Description */}
            {selectedCar.description && (
              <div className="mt-6 bg-black/50 rounded-lg p-4 border border-cyan-900/30">
                <h3 className="text-cyan-400 font-medium mb-2 font-['Orbitron']">{t('description') || "Description"}</h3>
                <p className="text-gray-300">{selectedCar.description}</p>
              </div>
            )}
            
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleEditCar(selectedCar);
                }}
                className="px-4 py-2 bg-yellow-600/30 text-yellow-300 rounded-md hover:bg-yellow-600/50 transition-colors font-['Orbitron'] cursor-pointer"
              >
                {t('editCar') || "Edit Car"}
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors font-['Orbitron'] cursor-pointer"
              >
                {t('close') || "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Car Edit/Create Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50 pt-10 px-4 pb-4 overflow-y-auto">
          <div className="bg-gray-900/90 rounded-xl border border-cyan-800/30 p-6 max-w-4xl w-full mt-2 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-cyan-400 font-['Orbitron']">
                {selectedCar ? (t('editCar') || "Edit Car") : (t('addNewCar') || "Add New Car")}
              </h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <CarEditForm 
              car={selectedCar} 
              onSubmit={async (carData) => {
                try {
                  setProcessing(true);
                  
                  if (selectedCar) {
                    // Update existing car
                    const response = await adminService.updateCar(selectedCar.id, carData);
                    
                    // Update the cars state with the updated car data
                    setCars(cars.map(car => 
                      car.id === selectedCar.id ? { ...response.data || response } : car
                    ));
                    
                    setMessage({
                      type: 'success',
                      text: t('carUpdated') || 'Car updated successfully'
                    });
                  } else {
                    // Create new car
                    const response = await adminService.createCar(carData);
                    
                    // Add the new car to the cars state
                    setCars([...cars, response.data || response]);
                    
                    setMessage({
                      type: 'success',
                      text: t('carCreated') || 'Car created successfully'
                    });
                  }
                  
                  // Hide modal
                  setShowEditModal(false);
                  
                  // Clear message after 3 seconds
                  setTimeout(() => setMessage(null), 3000);
                } catch (err) {
                  console.error('Error saving car:', err);
                  setMessage({
                    type: 'error',
                    text: err.message || 'Failed to save car'
                  });
                } finally {
                  setProcessing(false);
                }
              }}
              processing={processing}
              onCancel={() => setShowEditModal(false)}
              t={t}
            />
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCar && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50 pt-20 px-4 pb-4 overflow-y-auto">
          <div className="bg-gray-900/90 rounded-xl border border-red-800/30 p-6 max-w-md w-full mt-2 mb-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-900/20 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h2 className="text-xl text-center font-bold text-white mb-2 font-['Orbitron']">{t('confirmDelete') || "Confirm Delete"}</h2>
              <p className="text-gray-400 text-center mb-6">
                {t('confirmDeleteCar') || `Are you sure you want to delete ${selectedCar.name}? This action cannot be undone.`}
              </p>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2 border border-gray-700 text-gray-300 rounded-md hover:bg-gray-800 transition-colors font-['Orbitron'] cursor-pointer"
                disabled={processing}
              >
                {t('cancel') || "Cancel"}
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-['Orbitron'] cursor-pointer"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2 inline-block"></div>
                    {t('processing') || "Processing..."}
                  </>
                ) : (
                  <>{t('delete') || "Delete"}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarManagement; 