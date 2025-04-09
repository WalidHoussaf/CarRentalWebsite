import React from 'react';
import LocationFilter from './LocationFilter';
import CategoryFilter from './CategoryFilter';
import PriceRangeFilter from './PriceRangeFilter';
import FeaturesFilter from './FeaturesFilter';
import ResetButton from './ResetButton';
import { useLanguage } from '../../../context/LanguageContext';
import { useTranslations } from '../../../translations';

const FiltersSidebar = ({ filters, handleFilterChange, toggleFeature, resetFilters, navigate }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  return (
    <div className="w-full lg:w-72 flex-shrink-0">
      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-lg p-6 sticky top-24 shadow-lg shadow-blue-900/5 z-10">
        <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          {t('filters')}
        </h2>
        
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