import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sampleCars, resolveImagePaths, categoryTranslations } from '../assets/assets'; 
import Select from 'react-select';
import HeroSection from '../components/Cars/HeroSection';
import StatsSection from '../components/Cars/StatsSection';
import CallToAction from '../components/Cars/CallToAction';
import FiltersSidebar from '../components/Cars/Filters/FiltersSidebar';
import { selectStyles } from '../styles/selectStyles';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';

const CarsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const locationParam = queryParams.get('location');
  const searchParam = queryParams.get('search');
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  // State for Search
  const [searchQuery, setSearchQuery] = useState(searchParam || '');
  
  // Scroll to the of the Page
  useEffect(() => {
    if (!location.search) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.search]);
  
  // Reference to Store Current Scroll Position
  const scrollPositionRef = useRef(0);
  
  // Reference for the Cars Section
  const carsSectionRef = useRef(null);
  
  // State for Filters
  const [filters, setFilters] = useState({
    location: locationParam || 'all',
    category: 'all',
    priceRange: [0, 1000],
    features: []
  });
  
  // State for Cars Data
  const [carsData, setCarsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recommended');
  
  // Update Search when the URL Changes
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get('search');
    setSearchQuery(search || '');
  }, [location.search]);
  
  // Function to Update the URL with the Search
  const handleSearchUpdate = useCallback((query) => {
    setSearchQuery(query);
    
    const newParams = new URLSearchParams(location.search);
    if (query) {
      newParams.set('search', query);
    } else {
      newParams.delete('search');
    }
    
    // URL Update
    navigate(`/cars?${newParams.toString()}`, { replace: true });
  }, [location.search, navigate]);
  
  // Event Listener for Updating the Search from the Navbar
  useEffect(() => {
    const handleSearchEvent = (event) => {
      handleSearchUpdate(event.detail.query);
    };
    
    window.addEventListener('update-search', handleSearchEvent);
    return () => {
      window.removeEventListener('update-search', handleSearchEvent);
    };
  }, [handleSearchUpdate]);
  
  // Initialize the Search from the URL on Page Load
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, []);
  
  // Initialize Cars Data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const processedCars = resolveImagePaths(sampleCars, 'image');
      setCarsData(processedCars);
      setLoading(false);
    }, 800);
  }, []);
  
  // Handle Scroll to Cars Section
  const scrollToCarsSection = () => {
    if (carsSectionRef.current) {
      carsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Handle Navigation to About Us Page
  const navigateToAboutUs = () => {
    navigate('/about');
  };
  
  // Function to Navigate to a Page with Scrolling to the Top
  const navigateWithScroll = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };
  
  // Handle Filter Changes
  const handleFilterChange = (filterType, value) => {
    // Save Current Scroll Position before Navigation
    scrollPositionRef.current = window.pageYOffset;
    
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    
    // Update URL if Location Filter Changes
    if (filterType === 'location' && value !== 'all') {
      navigate(`/cars?location=${value}`, { replace: true });
    } else if (filterType === 'location' && value === 'all') {
      navigate('/cars', { replace: true });
    }
  };
  
  // Toggle Feature Filter
  const toggleFeature = (feature) => {
    // Save Current Scroll Position before Navigation
    scrollPositionRef.current = window.pageYOffset;
    
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    
    handleFilterChange('features', newFeatures);
  };
  
  // Reset Filters
  const resetFilters = () => {
    // Save Current Scroll Position before Navigation
    scrollPositionRef.current = window.pageYOffset;
    
    setFilters({
      location: 'all',
      category: 'all',
      priceRange: [0, 1000],
      features: []
    });
    navigate('/cars', { replace: true });
  };
  
  // Filter Cars Based on Current Filters
  const filteredCars = carsData.filter(car => {
    // Filter by Location
    if (filters.location !== 'all') {
      // Handle Both String and Array Locations
      if (Array.isArray(car.location)) {
        if (!car.location.includes(filters.location)) {
          return false;
        }
      } else if (car.location !== filters.location) {
        return false;
      }
    }
    
    // Filter by Category
    if (filters.category !== 'all' && car.category !== filters.category) {
      return false;
    }
    
    // Filter by Price Range
    if (car.price < filters.priceRange[0] || car.price > filters.priceRange[1]) {
      return false;
    }
    
    // Filter by Features
    if (filters.features.length > 0 && !filters.features.some(feature => 
      car.features.some(carFeature => carFeature.toLowerCase().includes(feature.toLowerCase()))
    )) {
      return false;
    }
    
    // Filter by Search Query
    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      
      // List of Car Brands, Including Full and Partial Matches
      const carBrands = {
        simple: ["audi", "bmw", "mercedes", "tesla", "porsche", "bentley", "ferrari", 
                 "lamborghini", "maserati", "lexus", "cadillac", "mclaren"],
        composed: ["rolls royce", "rolls-royce", "range rover", "aston martin"],
        parts: ["range", "rover", "rolls", "royce", "aston", "martin"]
      };

      // Case 1: Exact Search for a Composite Brand (e.g., 'range rover')
      if (carBrands.composed.includes(query)) {
        return car.name.toLowerCase().includes(query);
      }
      // Case 2: Search for a Part of a Composite Brand (e.g., 'range' or 'rover')
      else if (carBrands.parts.includes(query)) {
        // Check if it's a Word That is Part of a Composite Brand
        const relatedBrands = carBrands.composed.filter(brand => brand.includes(query));
        if (relatedBrands.length > 0) {
          // Check if Any of the Associated Composite Brands are in the Name
          return relatedBrands.some(brand => car.name.toLowerCase().includes(brand));
        }
      }
      // Case 3: Search for a Simple Brand (e.g., 'audi')
      else if (carBrands.simple.includes(query)) {
        // Check if the Exact Brand is in the Car's Name
        const carNameWords = car.name.toLowerCase().split(/\s+/);
        return carNameWords.some(word => word === query);
      }
      
      // Case 4: Standard Search for Any Other Term
      const nameMatch = car.name.toLowerCase().includes(query);
      const descriptionMatch = car.description ? car.description.toLowerCase().includes(query) : false;
      const featuresMatch = car.features.some(feature => 
        feature.toLowerCase().includes(query)
      );
      const categoryMatch = car.category.toLowerCase().includes(query);
      
      return (nameMatch || descriptionMatch || featuresMatch || categoryMatch);
    }
    
    return true;
  });
  
  // Sort Cars
  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <HeroSection onExploreClick={scrollToCarsSection} onLearnMoreClick={navigateToAboutUs} />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* Main Content */}
      <section ref={carsSectionRef} id="cars-section" className="relative py-16 px-4 bg-gradient-to-b from-black via-black/95 to-black/90 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[url('/patterns/dot-pattern.svg')] bg-repeat opacity-10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Title */}
          <div className="text-center mb-12 relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl -z-10"></div>
            <div className="inline-block mb-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-blue-500/20 animate-pulse-slow">
              <span className="text-sm text-cyan-400 font-['Orbitron'] tracking-widest">{t('customizeYourSearch')}</span>
            </div>
            <br />
            <br />
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-4">
              {t('findYourPerfectRide')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-white to-cyan-400 mx-auto mb-4"></div>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm font-['Orbitron']">
              {t('useFiltersDescription')}
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <FiltersSidebar 
              filters={filters}
              handleFilterChange={handleFilterChange}
              toggleFeature={toggleFeature}
              resetFilters={resetFilters}
            />
            
            {/* Cars Grid */}
            <div className="flex-grow relative">
              {/* Sort Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-800/50 bg-gradient-to-r from-transparent via-gray-800/10 to-transparent backdrop-blur-sm relative">
                <div className="absolute bottom-0 left-0 w-20 h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></div>
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-xl font-semibold text-white font-['Orbitron'] flex items-center">
                    {loading ? (
                      <span className="flex items-center">
                        <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                        {t('loadingVehicles')}
                      </span>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3a1 1 0 00.8-.4l3-4a1 1 0 00.2-.6V5a1 1 0 00-1-1H3zM14 7h2.7l-1.5 2H14V7z" />
                        </svg>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">{sortedCars.length}</span>
                        <span className="ml-1">{t('vehiclesAvailable')}</span>
                      </>
                    )}
                  </h2>
                </div>
                <div className="flex items-center">
                  <label className="mr-2 text-sm text-gray-300 font-['Orbitron']">{t('sortBy')}:</label>
                  <div className="w-48">
                    <Select
                      options={[
                        { value: 'recommended', label: t('recommended') },
                        { value: 'price-low', label: t('priceLowToHigh') },
                        { value: 'price-high', label: t('priceHighToLow') },
                        { value: 'rating', label: t('rating') }
                      ]}
                      value={{ 
                        value: sortBy, 
                        label: {
                          'recommended': t('recommended'),
                          'price-low': t('priceLowToHigh'),
                          'price-high': t('priceHighToLow'),
                          'rating': t('rating')
                        }[sortBy] 
                      }}
                      onChange={(selectedOption) => {
                        scrollPositionRef.current = window.pageYOffset;
                        setSortBy(selectedOption.value);
                      }}
                      isSearchable={false}
                      menuPortalTarget={document.body}
                      styles={{
                        ...selectStyles,
                        control: (provided, state) => ({
                          ...selectStyles.control(provided, state),
                          minHeight: '2.25rem',
                          height: '2.25rem'
                        })
                      }}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary: 'rgba(59, 130, 246, 0.5)',
                          primary25: 'rgba(59, 130, 246, 0.1)',
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
              
              {/* Loading State */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-20 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-900/5 to-transparent"></div>
                  <div className="w-20 h-20 relative">
                    <div className="w-full h-full border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-l-cyan-400/50 rounded-full animate-spin-slow"></div>
                  </div>
                  <div className="mt-6 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full">
                    <p className="text-cyan-300 font-['Orbitron'] relative">
                      <span className="animate-pulse">{t('loadingVehicles')}</span>
                      <span className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></span>
                    </p>
                  </div>
                </div>
              )}
              
              {/* Empty State */}
              {!loading && sortedCars.length === 0 && (
                <div className="bg-gradient-to-b from-gray-900/50 to-black/60 backdrop-blur-sm border border-gray-800 rounded-lg p-8 text-center relative overflow-hidden">  
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-600 mb-4 opacity-80" viewBox="0 0 24 24" fill="none">
                      {/* Car outline */}
                      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="1" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                      <g filter="url(#glow)">
                        <path d="M3 14L4 8C4.4 6.5 5.2 6 7 6H17C18.8 6 19.6 6.5 20 8L21 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M4 17H2C1.5 17 1 16.5 1 16V14C1 13.5 1.5 13 2 13H22C22.5 13 23 13.5 23 14V16C23 16.5 22.5 17 22 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="6" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="18" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M4 11H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </g>
                    </svg>
                    <h3 className="text-xl font-bold font-['Orbitron'] text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 mb-2">{t('noVehiclesFound')}</h3>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto font-['Orbitron']">
                      {t('noVehiclesDescription')}
                    </p>
                    <button
                      onClick={resetFilters}
                      className="relative px-8 py-3 bg-gradient-to-r from-cyan-800/40 to-blue-800/40 text-white font-['Orbitron'] transition-all duration-300 shadow-lg hover:shadow-cyan-700/20 rounded-md cursor-pointer overflow-hidden group"
                    >
                      <span className="relative z-10">{t('resetFilters')}</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Cars Grid */}
              {!loading && sortedCars.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative">                  
                  {sortedCars.map((car) => (
                    <div
                      key={car.id}
                      className="bg-gradient-to-b from-gray-900/40 to-black/20 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 group hover:border-cyan-500/30 flex flex-col h-full relative"
                    >                      
                      {/* Card Header */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={car.image || "/api/placeholder/400/240"}
                          alt={car.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                        
                        {/* Badge for Category */}
                        <div className="absolute top-3 left-3">
                          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-white to-cyan-500/80 backdrop-blur-sm text-xs font-bold text-black font-['Orbitron'] uppercase tracking-wider shadow-lg shadow-cyan-900/20">
                            {categoryTranslations[car.category] 
                              ? categoryTranslations[car.category][language] 
                              : car.category}
                          </div>
                        </div>
                        
                        {/* Price Badge */}
                        <div className="absolute bottom-3 right-3">
                          <div className="px-3 py-1 rounded-md bg-black/80 backdrop-blur-sm text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] border border-cyan-500/20">
                            ${car.price}{t('day')}
                          </div>
                        </div>
                      </div>
                      
                      {/* Card Content */}
                      <div className="p-5 flex flex-col flex-grow relative">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-white font-['Orbitron'] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-400 transition-all duration-300">
                              {car.name}
                            </h3>
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-white text-2xs font-['Orbitron']">{car.rating.toFixed(1)}</span>
                            </div>
                          </div>
                          
                          {/* Location */}
                          <div className="flex items-center mb-4 text-xl text-gray-400 font-['Rationale']">
                            <div className="flex items-center bg-gray-900/30 px-2 py-0.5 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>
                                {Array.isArray(car.location) 
                                  ? car.location.join(', ').charAt(0).toUpperCase() + car.location.join(', ').slice(1).toLowerCase()
                                  : car.location.charAt(0).toUpperCase() + car.location.slice(1).toLowerCase()}
                              </span>
                            </div>
                          </div>
                          
                          {/* Features */}
                          <div className="flex flex-wrap gap-2 mb-5">
                            {car.features.slice(0, 3).map((feature, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-800/50 border border-gray-700/30 rounded text-xs text-gray-300 font-['Orbitron'] transition-colors duration-300 hover:text-cyan-300 hover:border-cyan-700/30"
                              >
                                {language === 'fr' ? t(feature) : feature}
                              </span>
                            ))}
                            {car.features.length > 3 && (
                              <span className="px-2 py-1 bg-cyan-900/20 border border-cyan-900/30 rounded text-xs text-cyan-300 font-['Orbitron']">
                                +{car.features.length - 3} {t('moreFeatures')}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex space-x-2 mt-auto">
                          <button
                            onClick={() => {
                              navigateWithScroll(`/booking/${car.id}`);
                            }}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black font-['Orbitron'] text-sm transition-all duration-500 rounded-md cursor-pointer shadow-lg shadow-cyan-800/10 hover:shadow-cyan-800/30"
                          >
                            {t('bookNow')}
                          </button>
                          <button 
                            onClick={() => {
                              navigateWithScroll(`/cars/${car.id}`);
                            }}
                            className="px-4 py-2 bg-transparent border border-gray-700 hover:border-cyan-500 text-cyan-300 hover:text-cyan-400 font-['Orbitron'] text-sm transition-all duration-300 rounded-md cursor-pointer"
                          >
                            {t('details')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Load More Button */}
              {!loading && sortedCars.length > 0 && (
                <div className="mt-12 text-center relative">
                  <div className="absolute -z-10 inset-0 bg-gradient-to-b from-transparent to-cyan-900/5 blur-lg"></div>
                  <button className="relative px-10 py-4 bg-gradient-to-r from-gray-900/70 to-gray-800/70 text-white font-['Orbitron'] transition-all duration-300 border border-cyan-500/30 hover:border-cyan-400/60 rounded-md shadow-lg shadow-cyan-900/10 hover:shadow-cyan-800/30 cursor-pointer overflow-hidden group">
                    <span className="relative z-10">{t('loadMore')}</span>
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/80 to-black">
         
          <div className="absolute top-10 left-1/4 w-40 h-40 rounded-full bg-cyan-500/5 blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-20 right-1/4 w-60 h-60 rounded-full bg-blue-500/5 blur-3xl animate-float-slower"></div>
          
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-800/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-800/40 to-transparent"></div>
        </div>
        
        <CallToAction />
      </section>
    </div>
  );
};

export default CarsPage;