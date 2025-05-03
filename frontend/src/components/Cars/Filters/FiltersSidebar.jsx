import React from 'react';
import LocationFilter from './LocationFilter';
import CategoryFilter from './CategoryFilter';
import PriceRangeFilter from './PriceRangeFilter';
import FeaturesFilter from './FeaturesFilter';
import ResetButton from './ResetButton';
import { useLanguage } from '../../../context/LanguageContext';
import { useTranslations } from '../../../translations';

const FiltersSidebar = ({ filters, handleFilterChange, toggleFeature, resetFilters, navigate, filteredCars }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  // Count active filters (excluding 'all' which is default)
  const activeFilterCount = [
    filters.location !== 'all' ? 1 : 0,
    filters.category !== 'all' ? 1 : 0,
    filters.features.length > 0 ? filters.features.length : 0,
    // Add price filter if it's not at default
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) ? 1 : 0
  ].reduce((a, b) => a + b, 0);
  
  return (
    <div className="w-full lg:w-72 flex-shrink-0">
      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6 sticky top-24 shadow-lg shadow-blue-900/5 z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            {t('filters')}
            {activeFilterCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-cyan-500/20 text-cyan-400 rounded-full animate-pulse">
                {activeFilterCount}
              </span>
            )}
          </h2>
        </div>
        
        <LocationFilter 
          filters={filters} 
          handleFilterChange={handleFilterChange} 
        />
        
        <CategoryFilter 
          filters={filters} 
          handleFilterChange={handleFilterChange} 
        />
        
        <PriceRangeFilter 
          filters={filters} 
          handleFilterChange={handleFilterChange} 
        />
        
        <FeaturesFilter 
          filters={filters} 
          toggleFeature={toggleFeature} 
          filteredCars={filteredCars}
        />
        
        <ResetButton 
          resetFilters={resetFilters} 
          navigate={navigate} 
        />
      </div>
    </div>
  );
};

export default FiltersSidebar;