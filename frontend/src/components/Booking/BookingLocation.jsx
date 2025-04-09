import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

// Location icon
const LocationPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <circle cx="12" cy="9" r="3" className="fill-current" />
  </svg>
);

// Destination icon
const DestinationPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <path d="M12 7L12 11M12 11L14 9M12 11L10 9" className="stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="12" cy="14" r="1" className="fill-current" />
  </svg>
);

// Location coordinates
const LOCATIONS_COORDINATES = {
  'casablanca': { lat: 33.5731, lng: -7.5898 },
  'marrakech': { lat: 31.6295, lng: -7.9811 },
  'marrakesh': { lat: 31.6295, lng: -7.9811 }, 
  'rabat': { lat: 34.0209, lng: -6.8416 },
  'fes': { lat: 34.0181, lng: -5.0078 },
  'tangier': { lat: 35.7595, lng: -5.8340 },
  'agadir': { lat: 30.4278, lng: -9.5981 },
  'kenitra': { lat: 34.2610, lng: -6.5802 },
  'mohammedia': { lat: 33.6861, lng: -7.3828 }
};

// Interactive map component using OpenStreetMap with Leaflet
const InteractiveMap = ({ pickup, dropoff, sameLocation }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Loading Leaflet resources
  useEffect(() => {
    // Function to load necessary scripts and CSS
    const loadLeafletResources = async () => {
      // Check if Leaflet is already loaded
      if (window.L) {
        setMapLoaded(true);
        return;
      }

      try {
        // Load Leaflet CSS
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        linkElement.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        linkElement.crossOrigin = '';
        document.head.appendChild(linkElement);

        // Load Leaflet script
        const scriptElement = document.createElement('script');
        scriptElement.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        scriptElement.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        scriptElement.crossOrigin = '';
        document.body.appendChild(scriptElement);

        // Wait for the script to load
        scriptElement.onload = () => {
          setMapLoaded(true);
        };
      } catch (error) {
        console.error('Error loading Leaflet:', error);
      }
    };

    loadLeafletResources();

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Initialize map after Leaflet loads
  useEffect(() => {
    if (mapLoaded && mapContainerRef.current && !mapRef.current) {
      // Create map
      const map = window.L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false
      });

      // Replace dark theme with a lighter but still elegant theme
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      mapRef.current = map;
    }
  }, [mapLoaded]);

  // Update markers when pickup/dropoff change
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const map = mapRef.current;
    
    // Clean existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (pickup && LOCATIONS_COORDINATES[pickup]) {
      const pickupCoords = LOCATIONS_COORDINATES[pickup];
      
      // Create custom icon for pickup point
      const pickupIcon = window.L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-cyan-500/50">
            <div class="w-3 h-3 bg-white rounded-full"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      // Add pickup marker
      const pickupMarker = window.L.marker([pickupCoords.lat, pickupCoords.lng], { 
        icon: pickupIcon,
        title: `${pickup.charAt(0).toUpperCase() + pickup.slice(1)} Branch` 
      }).addTo(map);
      
      markersRef.current.push(pickupMarker);

      // If it's the only point, center on it
      if (sameLocation || !dropoff) {
        map.setView([pickupCoords.lat, pickupCoords.lng], 13);
      }
    }

    // Add dropoff marker if different
    if (!sameLocation && dropoff && LOCATIONS_COORDINATES[dropoff]) {
      const dropoffCoords = LOCATIONS_COORDINATES[dropoff];
      
      // Create custom icon for dropoff point
      const dropoffIcon = window.L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-purple-500/50">
            <div class="w-3 h-3 bg-white rounded-full"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      // Add dropoff marker
      const dropoffMarker = window.L.marker([dropoffCoords.lat, dropoffCoords.lng], { 
        icon: dropoffIcon,
        title: `${dropoff.charAt(0).toUpperCase() + dropoff.slice(1)} Branch` 
      }).addTo(map);
      
      markersRef.current.push(dropoffMarker);

      // If the two points are different, adjust view to see both
      if (pickup !== dropoff) {
        const bounds = window.L.latLngBounds(
          [LOCATIONS_COORDINATES[pickup].lat, LOCATIONS_COORDINATES[pickup].lng],
          [dropoffCoords.lat, dropoffCoords.lng]
        );
        map.fitBounds(bounds, { padding: [30, 30] });
      }
    }
  }, [mapLoaded, pickup, dropoff, sameLocation]);

  return (
    <div className="relative h-48 bg-black/60 rounded-lg mb-6 overflow-hidden border border-blue-900/20 group-hover:border-blue-900/40 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10 pointer-events-none"></div>
      
      {!mapLoaded && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20">
          <div className="text-gray-500 font-['Orbitron'] flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 text-cyan-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{t('loadingMap')}</span>
          </div>
        </div>
      )}
      
      <div ref={mapContainerRef} className="w-full h-full z-0"></div>
    </div>
  );
};

const BookingLocation = ({ car, bookingDetails, onLocationSelection, onPreviousStep }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [pickup, setPickup] = useState(bookingDetails.pickupLocation || '');
  const [dropoff, setDropoff] = useState(bookingDetails.dropoffLocation || '');
  const [sameLocation, setSameLocation] = useState(true);
  
  // Available locations based on car availability
  const availableLocations = Array.isArray(car.location) 
    ? car.location.map(loc => ({ value: loc, label: loc.charAt(0).toUpperCase() + loc.slice(1) }))
    : [{ value: car.location, label: car.location.charAt(0).toUpperCase() + car.location.slice(1) }];
  
  // When component mounts, initialize with bookingDetails
  useEffect(() => {
    if (bookingDetails.pickupLocation && bookingDetails.dropoffLocation) {
      setPickup(bookingDetails.pickupLocation);
      setDropoff(bookingDetails.dropoffLocation);
      setSameLocation(bookingDetails.pickupLocation === bookingDetails.dropoffLocation);
    }
  }, [bookingDetails]);
  
  // When sameLocation changes, update dropoff
  useEffect(() => {
    if (sameLocation) {
      setDropoff(pickup);
    }
  }, [sameLocation, pickup]);
  
  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: state.isFocused ? '#22d3ee' : 'rgba(59, 130, 246, 0.3)',
      borderRadius: '0.5rem',
      padding: '0.25rem',
      fontFamily: 'Orbitron, sans-serif',
      boxShadow: state.isFocused ? '0 0 0 1px #22d3ee' : 'none',
      '&:hover': {
        borderColor: '#22d3ee',
      },
      transition: 'all 0.3s ease'
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '0.5rem',
      padding: '0.5rem',
      zIndex: 50,
      boxShadow: '0 4px 12px rgba(0, 200, 255, 0.15)'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? 'rgba(34, 211, 238, 0.2)' 
        : state.isFocused 
          ? 'rgba(34, 211, 238, 0.1)' 
          : 'transparent',
      color: state.isSelected ? '#22d3ee' : '#ffffff',
      fontFamily: 'Orbitron, sans-serif',
      fontSize: '0.875rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#ffffff',
      fontFamily: 'Orbitron, sans-serif',
    }),
    input: (provided) => ({
      ...provided,
      color: '#ffffff',
      fontFamily: 'Orbitron, sans-serif',
    }),
  };
  
  const handleContinue = () => {
    onLocationSelection(pickup, dropoff);
  };
  
  return (
    <div className="relative rounded-xl p-6 md:p-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950/70 to-black z-0"></div>
      
      {/* Animated Grid Lines */}
      <div className="absolute inset-0 opacity-15 z-0 bg-grid-scan"></div>
      
      {/* Tech Lines */}
      <div className="absolute inset-0 opacity-10 z-0 bg-tech-lines"></div>
      
      {/* Data Stream */}
      <div className="absolute inset-0 opacity-8 z-0 bg-data-stream"></div>
      
      {/* Glowing Circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full opacity-8 blur-xl z-0 floating-light"></div>
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-500 rounded-full opacity-8 blur-xl z-0 floating-light-slow"></div>
      
      {/* Digital Circuit Lines */}
      <div className="absolute bottom-0 left-0 w-full h-32 opacity-15 bg-circuit-pattern z-0"></div>
      
      {/* Border Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-40 z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-40 z-10"></div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-6">
          {t('selectPickupDropoff')}
        </h2>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative">
            <h3 className="text-lg text-cyan-400 font-['Orbitron'] mb-4 flex items-center">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></span>
              {t('chooseYourLocations')}
            </h3>
            
            <div className="space-y-6">
              {/* Pickup Location */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-['Orbitron']">
                  {t('pickupLocation')}
                </label>
                <div className="relative">
                  <Select
                    options={availableLocations}
                    value={availableLocations.find(loc => loc.value === pickup)}
                    onChange={(selected) => setPickup(selected.value)}
                    styles={selectStyles}
                    isSearchable={false}
                  />
                  <p className="mt-2 text-xs text-gray-500 font-['Orbitron']">
                    {t('vehicleOnlySelectLocations')}
                  </p>
                </div>
              </div>
              
              {/* Same Location Toggle */}
              <div className="flex items-center p-3 bg-black/40 rounded-lg border border-blue-900/20 transition-all duration-300 hover:border-cyan-500/30">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="same-location"
                    checked={sameLocation}
                    onChange={(e) => setSameLocation(e.target.checked)}
                    className="w-4 h-4 appearance-none bg-black border border-gray-700 rounded checked:bg-cyan-400 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 cursor-pointer"
                  />
                  <div className={`absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-300 ${sameLocation ? 'opacity-100' : 'opacity-0'}`}>
                    <svg className="w-3 h-3 text-black" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <label htmlFor="same-location" className="ml-2 text-sm text-gray-300 font-['Orbitron']">
                  {t('returnSameLocation')}
                </label>
              </div>
              
              {/* Dropoff Location (if not same) */}
              {!sameLocation && (
                <div className="transition-all duration-500 animate-fade-in">
                  <label className="block text-sm font-medium text-gray-300 mb-2 font-['Orbitron']">
                    {t('dropoffLocation')}
                  </label>
                  <Select
                    options={availableLocations}
                    value={availableLocations.find(loc => loc.value === dropoff)}
                    onChange={(selected) => setDropoff(selected.value)}
                    styles={selectStyles}
                    isSearchable={false}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Map Preview */}
          <div className="backdrop-blur-sm bg-black/50 p-6 rounded-lg border border-blue-900/30 shadow-lg hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden group">
            {/* Luminous glow effect on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 pointer-events-none"></div>
            
            <div className="relative">
              <h3 className="text-lg text-cyan-400 font-['Orbitron'] mb-4 flex items-center">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></span>
                {t('locationDetails')}
              </h3>
              
              {/* Interactive Map Component */}
              <InteractiveMap 
                pickup={pickup} 
                dropoff={dropoff} 
                sameLocation={sameLocation} 
              />
              
              <div className="space-y-4">
                <div className="flex items-start p-3 bg-black/40 rounded-lg border border-blue-900/20 transition-all duration-300 hover:border-cyan-500/30 group">
                  <div className="w-8 h-8 flex-shrink-0 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 mt-1 transition-all duration-300 group-hover:bg-cyan-500/30">
                    <LocationPin />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-white font-['Orbitron']">
                      {pickup.charAt(0).toUpperCase() + pickup.slice(1)} {language === 'fr' ? 'Agence' : 'Branch'}
                    </h4>
                    <p className="text-xs text-gray-400 font-['Orbitron']">
                      {t('branchAddress', { location: pickup.charAt(0).toUpperCase() + pickup.slice(1) })}
                    </p>
                    <p className="text-xs text-cyan-400 font-['Orbitron'] mt-1">
                      {t('branchOpeningHours')}
                    </p>
                  </div>
                </div>
                
                {!sameLocation && (
                  <div className="flex items-start p-3 bg-black/40 rounded-lg border border-blue-900/20 transition-all duration-300 hover:border-purple-500/30 group">
                    <div className="w-8 h-8 flex-shrink-0 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 mt-1 transition-all duration-300 group-hover:bg-purple-500/30">
                      <DestinationPin />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-white font-['Orbitron']">
                        {dropoff.charAt(0).toUpperCase() + dropoff.slice(1)} {language === 'fr' ? 'Agence' : 'Branch'}
                      </h4>
                      <p className="text-xs text-gray-400 font-['Orbitron']">
                        {t('branchAddress', { location: dropoff.charAt(0).toUpperCase() + dropoff.slice(1) })}
                      </p>
                      <p className="text-xs text-purple-400 font-['Orbitron'] mt-1">
                        {t('branchOpeningHours')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={onPreviousStep}
            className="px-6 py-3 bg-black/50 border border-blue-900/30 hover:border-cyan-500/50 text-cyan-400 font-medium font-['Orbitron'] rounded-md transition-all duration-300 flex items-center group cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('backToDates')}
          </button>
          
          <button
            onClick={handleContinue}
            className="px-6 py-3 bg-gradient-to-r from-white to-cyan-400 text-black font-semibold font-['Orbitron'] rounded-md flex items-center justify-center hover:from-cyan-400 hover:to-white transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-blue-500/20 cursor-pointer"
          >
            {t('continueToOptions')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingLocation;
