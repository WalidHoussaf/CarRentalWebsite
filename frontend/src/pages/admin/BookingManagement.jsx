import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';
import { format } from 'date-fns';
import { createPortal } from 'react-dom';

// Custom dropdown component that uses a portal
const PortalDropdown = ({ isOpen, buttonRef, children }) => {
  if (!isOpen || !buttonRef.current) return null;
  
  // Get exact button width
  const buttonRect = buttonRef.current.getBoundingClientRect();
  
  return createPortal(
    <div 
      className="absolute z-[99999] bg-black/80 backdrop-blur-md border border-cyan-900/50 rounded-b-md shadow-lg py-1"
      style={{
        top: 'calc(100% - 1px)',
        left: '-1px',
        width: `${buttonRect.width}px`,
        marginTop: '0px',
        borderTop: 'none',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        boxShadow: '0 5px 20px rgba(8, 145, 178, 0.3)'
      }}
    >
      {children}
    </div>,
    buttonRef.current
  );
};

// Component imports for consistent styling with UserManagement
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

const BookingManagement = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { language } = useLanguage();
  const t = useTranslations(language);
  const navigate = useNavigate();
  
  // State
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalDropdownOpen, setModalDropdownOpen] = useState(false);
  
  // Refs for dropdowns
  const dropdownButtonRef = useRef(null);
  const modalDropdownButtonRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownButtonRef.current && !dropdownButtonRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (modalDropdownButtonRef.current && !modalDropdownButtonRef.current.contains(event.target)) {
        setModalDropdownOpen(false);
      }
    };

    // Add event listener when dropdown is open
    if (dropdownOpen || modalDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen, modalDropdownOpen]);
  
  // Fetch bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated || !isAdmin()) {
        setErrorMessage('You do not have permission to access this page');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await adminService.getAllBookings();
        
        // Log the response to understand its structure
        console.log('API Response:', response);
        
        // Check if we have bookings data
        if (response.bookings) {
          console.log('Setting bookings from response.bookings:', response.bookings);
          setBookings(response.bookings);
        } else if (Array.isArray(response)) {
          console.log('Setting bookings from array response:', response);
          setBookings(response);
        } else if (response.success && Array.isArray(response.data)) {
          // Additional check for {success: true, data: [...]} structure
          console.log('Setting bookings from response.data:', response.data);
          setBookings(response.data);
        } else {
          // Error handling for unexpected response format
          console.error('Unexpected API response format:', response);
          setErrorMessage('Unexpected response format');
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setErrorMessage(err.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, isAdmin]);
  
  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // Format to show only the date without time
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (err) {
      console.error('Date formatting error:', err);
      return 'Invalid date';
    }
  };
  
  // Format price function
  const formatPrice = (amount) => {
    if (amount === undefined || amount === null) return 'N/A';
    
    // If it's a string, try to parse it first
    if (typeof amount === 'string') {
      // Check if the string already has a currency symbol
      if (amount.includes('$') || amount.includes('€')) {
        return amount;
      }
      
      // Try to parse the string as a number
      const parsed = parseFloat(amount);
      if (isNaN(parsed)) {
        return amount; // Return original if we can't parse it
      }
      amount = parsed;
    }
    
    // Handle objects with amount property
    if (typeof amount === 'object' && amount !== null) {
      // Try to find a property that looks like an amount
      for (const key of ['amount', 'value', 'total', 'price']) {
        if (amount[key] !== undefined && amount[key] !== null) {
          return formatPrice(amount[key]); // Recursively format the found property
        }
      }
      return 'N/A';
    }
    
    // Format the number with 2 decimal places
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  // Helper to get booking property with fallbacks for different property names
  const getBookingProperty = (booking, propertyNames) => {
    if (!booking) return null;
    
    for (const name of propertyNames) {
      if (booking[name] !== undefined && booking[name] !== null) {
        return booking[name];
      }
    }
    
    // Check for nested properties
    for (const name of propertyNames) {
      const parts = name.split('.');
      if (parts.length > 1) {
        let value = booking;
        let found = true;
        
        for (const part of parts) {
          if (value && value[part] !== undefined) {
            value = value[part];
          } else {
            found = false;
            break;
          }
        }
        
        if (found) {
          return value;
        }
      }
    }
    
    return null;
  };
  
  // Log bookings data when it changes
  useEffect(() => {
    if (bookings.length > 0) {
      console.log('First booking sample:', bookings[0]);
      
      // Check what date format properties are available
      const firstBooking = bookings[0];
      console.log('Date properties:',  {
        pickup_date: firstBooking.pickup_date,
        start_date: firstBooking.start_date,
        pickup_datetime: firstBooking.pickup_datetime,
        return_date: firstBooking.return_date,
        end_date: firstBooking.end_date
      });
      
      // Check what price properties are available
      console.log('Price properties:', {
        total_amount: firstBooking.total_amount,
        total_price: firstBooking.total_price,
        price: firstBooking.price,
        amount: firstBooking.amount,
        daily_rate: firstBooking.daily_rate
      });
      
      // Log available status values
      const uniqueStatuses = [...new Set(bookings.map(b => b.status))];
      console.log('Available status values:', uniqueStatuses);
    }
  }, [bookings]);
  
  // Handler for viewing booking details
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };
  
  // Handler for opening status update modal
  const handleUpdateStatus = (booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setShowStatusModal(true);
  };
  
  // Handler for updating booking status
  const handleStatusSubmit = async () => {
    if (!selectedBooking || !newStatus) return;
    
    try {
      setProcessing(true);
      await adminService.updateBookingStatus(selectedBooking.id, newStatus);
      
      // Update the bookings state with the updated booking
      setBookings(bookings.map(booking => 
        booking.id === selectedBooking.id ? { ...booking, status: newStatus } : booking
      ));
      
      // Show success message
      setMessage({
        type: 'success',
        text: t('bookingStatusUpdated')
      });
      
      // Hide modal
      setShowStatusModal(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error updating booking status:', err);
      setMessage({
        type: 'error',
        text: err.message || 'Failed to update booking status'
      });
    } finally {
      setProcessing(false);
    }
  };
  
  // Handler for opening delete confirmation modal
  const handleDeleteConfirm = (booking) => {
    setSelectedBooking(booking);
    setShowDeleteModal(true);
  };
  
  // Handler for deleting a booking
  const handleDelete = async () => {
    if (!selectedBooking) return;
    
    try {
      setProcessing(true);
      await adminService.deleteBooking(selectedBooking.id);
      
      // Update the bookings state by removing the deleted booking
      setBookings(bookings.filter(booking => booking.id !== selectedBooking.id));
      
      // Show success message
      setMessage({
        type: 'success',
        text: t('bookingDeleted')
      });
      
      // Hide modal
      setShowDeleteModal(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting booking:', err);
      setMessage({
        type: 'error',
        text: err.message || 'Failed to delete booking'
      });
    } finally {
      setProcessing(false);
    }
  };
  
  // Filter bookings based on search term and status filter
  const filteredBookings = useMemo(() => {
    // Skip filtering if no bookings yet
    if (!bookings || bookings.length === 0) {
      return [];
    }
    
    console.log('Filtering', bookings.length, 'bookings with statusFilter:', statusFilter ? `"${statusFilter}"` : 'none');
    
    return bookings.filter(booking => {
      // Search term filtering
      const searchMatches = !searchTerm || 
                            booking.id?.toString().includes(searchTerm) ||
                            booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (booking.car_name && booking.car_name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // If search doesn't match, no need to check status
      if (!searchMatches) return false;
      
      // Status filtering (only if a status is selected)
      if (!statusFilter) {
        return true; // No status filter applied, include all
      }
      
      // Handle potential data variations - ensure we get a string, handle null/undefined
      const bookingStatus = (booking.status || '').toString().toLowerCase().trim();
      const filterStatus = statusFilter.toLowerCase().trim();
      
      // Debug any mismatch for first few items
      if (booking.id < 5) {
        console.log(`Booking #${booking.id} - Status: "${bookingStatus}" vs Filter: "${filterStatus}" - Match: ${bookingStatus === filterStatus}`);
      }
      
      return bookingStatus === filterStatus;
    });
  }, [bookings, searchTerm, statusFilter]);
  
  // Debug effect for status filter changes
  useEffect(() => {
    if (statusFilter === '') {
      console.log('STATUS FILTER: All bookings (no filter)');
    } else {
      console.log(`STATUS FILTER CHANGED TO: "${statusFilter}"`);
    }
    
    // Check if any bookings match this status
    if (bookings.length > 0 && statusFilter !== '') {
      const matchingBookings = bookings.filter(b => 
        (b.status || '').toLowerCase() === statusFilter.toLowerCase()
      );
      console.log(`Bookings matching status "${statusFilter}": ${matchingBookings.length} of ${bookings.length}`);
      
      if (matchingBookings.length === 0 && bookings.length > 0) {
        console.log('Available statuses:');
        const uniqueStatuses = [...new Set(bookings.map(b => b.status))];
        console.log(uniqueStatuses);
      }
    }
    
    // Log filtered bookings
    console.log('Filtered bookings count after filter change:', filteredBookings.length);
  }, [statusFilter, bookings, filteredBookings.length]);
  
  // Render loading state
  if (loading && bookings.length === 0) {
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
  
  // Debug component defined inside the main component to access functions and state
  function DebugComponent() {
    const [showDebug, setShowDebug] = useState(false);
    const [selectedBookingIndex, setSelectedBookingIndex] = useState(0);
    
    // Always show in development
    const isDevelopment = true;
    
    if (!isDevelopment) {
      return null;
    }
    
    const currentBooking = bookings[selectedBookingIndex] || null;
    
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button 
          onClick={() => setShowDebug(!showDebug)}
          className="bg-gray-800 text-gray-300 px-3 py-1 rounded-md text-xs font-['Orbitron'] border border-cyan-900/30 hover:bg-gray-700 transition-colors cursor-pointer"
        >
          {showDebug ? 'Hide Debug' : 'Show Debug'}
        </button>
        
        {showDebug && (
          <div className="fixed bottom-12 right-4 w-96 max-h-96 overflow-auto bg-gray-900/90 text-green-400 p-4 rounded-md border border-cyan-800/30 text-xs font-mono backdrop-blur-sm">
            <h3 className="text-cyan-400 mb-2 font-['Orbitron']">Booking Data Structure:</h3>
            {bookings.length > 0 ? (
              <>
                <div className="mb-2 flex justify-between items-center">
                  <span>Booking {selectedBookingIndex + 1} of {bookings.length}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedBookingIndex(prev => Math.max(0, prev - 1))}
                      disabled={selectedBookingIndex === 0}
                      className="px-2 py-1 bg-gray-800 rounded disabled:opacity-50 hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      Prev
                    </button>
                    <button 
                      onClick={() => setSelectedBookingIndex(prev => Math.min(bookings.length - 1, prev + 1))}
                      disabled={selectedBookingIndex === bookings.length - 1}
                      className="px-2 py-1 bg-gray-800 rounded disabled:opacity-50 hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
                <pre className="bg-black/60 p-2 rounded-md overflow-auto text-xs border border-gray-800">
                  {JSON.stringify(currentBooking, null, 2)}
                </pre>
                <div className="mt-4 p-2 bg-gray-800 rounded">
                  <h4 className="font-bold mb-1 text-cyan-300">Key Properties:</h4>
                  <div>Pickup: {JSON.stringify(getBookingProperty(currentBooking, ['pickup_date', 'start_date']))}</div>
                  <div>Return: {JSON.stringify(getBookingProperty(currentBooking, ['return_date', 'end_date']))}</div>
                  <div>Total: {JSON.stringify(getBookingProperty(currentBooking, ['total_amount', 'total_price', 'price']))}</div>
                </div>
              </>
            ) : (
              <p>No bookings available</p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen pt-20 pb-12 px-4 font-['Rationale']">
      <div className="max-w-7xl mx-auto">
        {/* Status Messages */}
        {errorMessage && (
          <div className="p-4 mb-6 rounded-md bg-red-900/30 text-red-300 border border-red-800 backdrop-blur-sm">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Page Header */}
        <PageTitle
          title={t('bookingsManagement')}
          subtitle={t('bookingsManagementSubtitle')}
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
                placeholder={t('quickSearch')}
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
              {/* Custom styled dropdown */}
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
                    minWidth: '12rem' // Ensure minimum width
                  }}
                >
                  <span className={`
                    ${statusFilter === 'pending' ? 'text-yellow-300' : ''}
                    ${statusFilter === 'confirmed' ? 'text-green-300' : ''}
                    ${statusFilter === 'cancelled' ? 'text-red-300' : ''}
                    ${statusFilter === 'completed' ? 'text-blue-300' : ''}
                    ${!statusFilter ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400' : ''}
                  `}>
                    {!statusFilter ? t('allStatuses') : t(statusFilter)}
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
                  
                  <PortalDropdown isOpen={dropdownOpen} buttonRef={dropdownButtonRef}>
                    <div className="py-1 w-full">
                      <button
                        onClick={() => {
                          console.log('DIRECT: Setting filter to ALL');
                          setStatusFilter('');
                          setDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm font-['Orbitron'] text-gray-200 hover:bg-cyan-900/20 hover:text-cyan-400 transition-colors flex items-center"
                        style={{ paddingLeft: '16px', paddingRight: '16px' }}
                      >
                        {statusFilter === '' && <div className="w-2 h-2 rounded-full bg-cyan-400 mr-2"></div>}
                        <span className={statusFilter === '' ? 'font-medium' : ''}>
                          {t('allStatuses')}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          console.log('DIRECT: Setting filter to pending');
                          setStatusFilter('pending');
                          setDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm font-['Orbitron'] text-yellow-300 hover:bg-yellow-900/20 hover:text-yellow-200 transition-colors flex items-center"
                        style={{ paddingLeft: '16px', paddingRight: '16px' }}
                      >
                        {statusFilter === 'pending' && <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></div>}
                        <span className={statusFilter === 'pending' ? 'font-medium' : ''}>
                          {t('pending')}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          console.log('DIRECT: Setting filter to confirmed');
                          setStatusFilter('confirmed');
                          setDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm font-['Orbitron'] text-green-300 hover:bg-green-900/20 hover:text-green-200 transition-colors flex items-center"
                        style={{ paddingLeft: '16px', paddingRight: '16px' }}
                      >
                        {statusFilter === 'confirmed' && <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>}
                        <span className={statusFilter === 'confirmed' ? 'font-medium' : ''}>
                          {t('confirmed')}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          console.log('DIRECT: Setting filter to cancelled');
                          setStatusFilter('cancelled');
                          setDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm font-['Orbitron'] text-red-300 hover:bg-red-900/20 hover:text-red-200 transition-colors flex items-center"
                        style={{ paddingLeft: '16px', paddingRight: '16px' }}
                      >
                        {statusFilter === 'cancelled' && <div className="w-2 h-2 rounded-full bg-red-400 mr-2"></div>}
                        <span className={statusFilter === 'cancelled' ? 'font-medium' : ''}>
                          {t('cancelled')}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          console.log('DIRECT: Setting filter to completed');
                          setStatusFilter('completed');
                          setDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm font-['Orbitron'] text-blue-300 hover:bg-blue-900/20 hover:text-blue-200 transition-colors flex items-center"
                        style={{ paddingLeft: '16px', paddingRight: '16px' }}
                      >
                        {statusFilter === 'completed' && <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>}
                        <span className={statusFilter === 'completed' ? 'font-medium' : ''}>
                          {t('completed')}
                        </span>
                      </button>
                    </div>
                  </PortalDropdown>
                </button>
                
              </div>
            </div>
          </div>
        </div>
          
        {/* Bookings Table */}
        <div className="bg-gray-900/50 border border-cyan-900/30 rounded-lg overflow-hidden backdrop-blur-sm relative" style={{ zIndex: 10 }}>
          {filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-['Orbitron']">{t('noBookingsFound')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-cyan-900/30 border-b border-cyan-900/50">
                    <th className="px-4 py-3 text-sm font-medium text-cyan-300 font-['Orbitron']">{t('admin_bookingID')}</th>
                    <th className="px-4 py-3 text-sm font-medium text-cyan-300 font-['Orbitron']">{t('admin_customer')}</th>
                    <th className="px-4 py-3 text-sm font-medium text-cyan-300 font-['Orbitron']">{t('admin_car')}</th>
                    <th className="px-4 py-3 text-sm font-medium text-cyan-300 font-['Orbitron']">{t('admin_pickupDate')}</th>
                    <th className="px-4 py-3 text-sm font-medium text-cyan-300 font-['Orbitron']">{t('admin_returnDate')}</th>
                    <th className="px-4 py-3 text-sm font-medium text-cyan-300 font-['Orbitron']">{t('status')}</th>
                    <th className="px-4 py-3 text-sm font-medium text-cyan-300 font-['Orbitron']">{t('admin_totalAmount')}</th>
                    <th className="px-4 py-3 text-sm font-medium text-cyan-300 text-right font-['Orbitron']">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-cyan-900/10 transition-colors duration-150">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-base text-cyan-100 font-['Orbitron']">#{booking.id}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 mr-3 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-full flex items-center justify-center font-['Orbitron']">
                            {(booking.user?.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-white font-['Orbitron']">{booking.user?.name || 'N/A'}</div>
                            <div className="text-sm text-gray-400">{booking.user?.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-base font-medium text-cyan-100">{booking.car_name || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-base">
                          {formatDate(getBookingProperty(booking, [
                            'pickup_date', 
                            'start_date', 
                            'pickup_datetime',
                            'start_datetime',
                            'start',
                            'date.pickup',
                            'date.start',
                            'dates.pickup',
                            'dates.start'
                          ]))}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-base">
                          {formatDate(getBookingProperty(booking, [
                            'return_date', 
                            'end_date', 
                            'return_datetime',
                            'end_datetime',
                            'end',
                            'date.return',
                            'date.end',
                            'dates.return',
                            'dates.end'
                          ]))}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full font-['Orbitron']
                          ${booking.status === 'confirmed' ? 'bg-green-900/50 text-green-300 border border-green-800/50' : ''}
                          ${booking.status === 'pending' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-800/50' : ''}
                          ${booking.status === 'cancelled' ? 'bg-red-900/50 text-red-300 border border-red-800/50' : ''}
                          ${booking.status === 'completed' ? 'bg-blue-900/50 text-blue-300 border border-blue-800/50' : ''}
                        `}>
                          {t(booking.status)} 
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-base font-medium text-cyan-100">
                          {formatPrice(getBookingProperty(booking, [
                            'total_amount', 
                            'total_price', 
                            'price', 
                            'amount',
                            'price.total',
                            'payment.amount', 
                            'payment.total',
                            'payment'
                          ]))}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                            title={t('admin_viewBooking')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(booking)}
                            className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer"
                            title={t('admin_updateStatus')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteConfirm(booking)}
                            className="p-2 bg-red-900/50 hover:bg-red-900 text-red-400 hover:text-red-300 rounded transition-colors cursor-pointer"
                            title={t('delete')}
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
      
      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center z-50 pt-20 px-4 pb-4 overflow-y-auto">
          <div className="bg-gray-900/90 rounded-xl border border-cyan-800/30 p-6 max-w-3xl w-full mt-2 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-cyan-400 font-['Orbitron']">{t('admin_bookingDetails')}</h2>
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
              {/* Booking Info */}
              <div className="bg-black/50 rounded-lg p-4 border border-cyan-900/30">
                <h3 className="text-cyan-400 font-medium mb-4 font-['Orbitron']">{t('admin_bookingDetails')}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('admin_bookingID')}:</span>
                    <span className="text-white">{selectedBooking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('admin_bookingDate')}:</span>
                    <span className="text-white">{formatDate(selectedBooking.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('admin_pickupDate')}:</span>
                    <span className="text-white">{formatDate(getBookingProperty(selectedBooking, [
                      'pickup_date', 
                      'start_date', 
                      'pickup_datetime',
                      'start_datetime',
                      'start',
                      'date.pickup',
                      'date.start',
                      'dates.pickup',
                      'dates.start'
                    ]))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('admin_returnDate')}:</span>
                    <span className="text-white">{formatDate(getBookingProperty(selectedBooking, [
                      'return_date', 
                      'end_date', 
                      'return_datetime',
                      'end_datetime',
                      'end',
                      'date.return',
                      'date.end',
                      'dates.return',
                      'dates.end'
                    ]))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('status')}:</span>
                    <span className={`
                      ${selectedBooking.status === 'confirmed' ? 'text-green-400' : ''}
                      ${selectedBooking.status === 'pending' ? 'text-yellow-400' : ''}
                      ${selectedBooking.status === 'cancelled' ? 'text-red-400' : ''}
                      ${selectedBooking.status === 'completed' ? 'text-blue-400' : ''}
                    `}>
                      {t(selectedBooking.status)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('admin_totalAmount')}:</span>
                    <span className="text-white">{formatPrice(getBookingProperty(selectedBooking, [
                      'total_amount', 
                      'total_price', 
                      'price', 
                      'amount',
                      'price.total',
                      'payment.amount', 
                      'payment.total',
                      'payment'
                    ]))}</span>
                  </div>
                </div>
              </div>
              
              {/* Customer Info */}
              <div className="bg-black/50 rounded-lg p-4 border border-cyan-900/30">
                <h3 className="text-cyan-400 font-medium mb-4 font-['Orbitron']">{t('admin_customerDetails')}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('name')}:</span>
                    <span className="text-white">{selectedBooking.user?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('email')}:</span>
                    <span className="text-white">{selectedBooking.user?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('phoneNumber')}:</span>
                    <span className="text-white">{selectedBooking.user?.phone_number || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              {/* Car Info */}
              <div className="bg-black/50 rounded-lg p-4 border border-cyan-900/30">
                <h3 className="text-cyan-400 font-medium mb-4 font-['Orbitron']">{t('admin_carDetails')}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('carName')}:</span>
                    <span className="text-white">{selectedBooking.car_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('dailyRate')}:</span>
                    <span className="text-white">{formatPrice(selectedBooking.daily_rate || selectedBooking.car_daily_rate)}</span>
                  </div>
                </div>
              </div>
              
              {/* Booking Options */}
              <div className="bg-black/50 rounded-lg p-4 border border-cyan-900/30">
                <h3 className="text-cyan-400 font-medium mb-4 font-['Orbitron']">{t('admin_bookingOptions')}</h3>
                {selectedBooking.options && selectedBooking.options.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-400 border-b border-gray-800 pb-1">{t('admin_optionName')}</div>
                    <div className="text-gray-400 border-b border-gray-800 pb-1">{t('admin_optionPrice')}</div>
                    {selectedBooking.options.map((option, i) => (
                      <React.Fragment key={i}>
                        <div className="text-white">{option.name}</div>
                        <div className="text-white">{formatPrice(option.price)}</div>
                      </React.Fragment>
                    ))}
                      </div>
                ) : (
                  <p className="text-gray-400">{t('admin_noOptionsSelected')}</p>
                )}
              </div>
              
              {/* Status History */}
              <div className="bg-black/50 rounded-lg p-4 border border-cyan-900/30">
                <h3 className="text-cyan-400 font-medium mb-4 font-['Orbitron']">{t('admin_bookingStatusHistory')}</h3>
                {selectedBooking.status_history && selectedBooking.status_history.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-400 border-b border-gray-800 pb-1">{t('admin_statusDate')}</div>
                    <div className="text-gray-400 border-b border-gray-800 pb-1">{t('admin_statusValue')}</div>
                    {selectedBooking.status_history.map((history, i) => (
                      <React.Fragment key={i}>
                        <div className="text-white">{formatDate(history.date)}</div>
                        <div className={`
                          ${history.status === 'confirmed' ? 'text-green-400' : ''}
                          ${history.status === 'pending' ? 'text-yellow-400' : ''}
                          ${history.status === 'cancelled' ? 'text-red-400' : ''}
                          ${history.status === 'completed' ? 'text-blue-400' : ''}
                        `}>
                          {t(history.status)}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">{t('noStatusHistory')}</p>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  handleUpdateStatus(selectedBooking);
                }}
                className="px-4 py-2 bg-yellow-600/30 text-yellow-300 rounded-md hover:bg-yellow-600/50 transition-colors font-['Orbitron'] cursor-pointer"
              >
                {t('updateStatus')}
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors font-['Orbitron'] cursor-pointer"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Update Status Modal */}
      {showStatusModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900/90 rounded-xl border border-cyan-800/30 p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4 font-['Orbitron']">{t('admin_updateBookingStatus')}</h2>
            
            <div className="mb-4">
              <label className="block text-gray-400 mb-2">{t('status')}</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 bg-black/60 border border-cyan-900/30 rounded-lg focus:outline-none focus:border-cyan-500 transition-all text-white"
              >
                <option value="pending">{t('admin_pending')}</option>
                <option value="confirmed">{t('admin_confirmed')}</option>
                <option value="cancelled">{t('admin_cancelled')}</option>
                <option value="completed">{t('admin_completed')}</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition-colors font-['Orbitron']"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleStatusSubmit}
                className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors font-['Orbitron']"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2 inline-block"></div>
                    {t('processing')}
                  </>
                ) : (
                  t('update')
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900/90 rounded-xl border border-red-800/30 p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-red-400 mb-4 font-['Orbitron']">{t('confirmDelete')}</h2>
            
            <p className="text-gray-300 mb-6">
              {t('admin_confirmDeleteBooking')}
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition-colors font-['Orbitron']"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-['Orbitron']"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2 inline-block"></div>
                    {t('processing')}
                  </>
                ) : (
                  t('delete')
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Debug component */}
      <DebugComponent />
    </div>
  );
};

export default BookingManagement; 