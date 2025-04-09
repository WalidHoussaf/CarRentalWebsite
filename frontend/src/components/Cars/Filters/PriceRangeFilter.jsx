import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTranslations } from '../../../translations';

const PriceRangeFilter = ({ filters, handleFilterChange }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  return (
    <div className="mb-6 p-5 bg-gray-900 rounded-xl shadow-lg">
      <label className="text-sm font-semibold text-gray-300 mb-3 flex items-center font-['Orbitron']">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
        {t('priceRange')}: <span className="ml-1 text-cyan-400">${filters.priceRange[0]}</span> - <span className="text-gray-300">${filters.priceRange[1]}</span>
      </label>

      <div className="flex flex-col gap-6">
        {/* Min Slider */}
        <div>
          <div className="flex justify-between text-xs text-gray-300 mb-2">
            <span className="font-['Orbitron']">Min</span>
            <span className="font-medium text-cyan-400 font-['Orbitron']">${filters.priceRange[0]}</span>
          </div>
          <div className="relative h-2 bg-gray-700 rounded">
            <div className="absolute h-2 bg-cyan-500 rounded transition-all" style={{ width: `${(filters.priceRange[0] / 1000) * 100}%` }}></div>
            <input
              type="range"
              min="0"
              max="1000"
              value={filters.priceRange[0]}
              onChange={(e) => {
                const newMin = parseInt(e.target.value);
                const newMax = Math.max(filters.priceRange[1], newMin);
                handleFilterChange('priceRange', [newMin, newMax]);
              }}
              className="w-full h-2 appearance-none bg-transparent absolute top-0 left-0 z-10 cursor-pointer"
              style={{ 
                WebkitAppearance: 'none',
                appearance: 'none',
                background: 'transparent',
                cursor: 'pointer',
                opacity: 0, 
              }}
            />
            <div 
              className="absolute left-0 transform -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 shadow-lg rounded-full animate-pulse cursor-pointer z-10" 
              style={{ left: `${(filters.priceRange[0] / 1000) * 100}%`, pointerEvents: 'none' }}
            ></div>
          </div>
        </div>
    
        {/* Max Slider */}
        <div>
          <div className="flex justify-between text-xs text-gray-300 mb-2">
            <span className="font-['Orbitron']">Max</span>
            <span className="font-medium text-gray-300 font-['Orbitron']">${filters.priceRange[1]}</span>
          </div>
          <div className="relative h-2 bg-gray-700 rounded">
            <div className="absolute h-2 bg-gray-300 rounded transition-all" style={{ width: `${(filters.priceRange[1] / 1000) * 100}%` }}></div>
            <input
              type="range"
              min="0"
              max="1000"
              value={filters.priceRange[1]}
              onChange={(e) => {
                const newMax = parseInt(e.target.value);
                const newMin = Math.min(filters.priceRange[0], newMax);
                handleFilterChange('priceRange', [newMin, newMax]);
              }}
              className="w-full h-2 appearance-none bg-transparent absolute top-0 left-0 z-10 cursor-pointer"
              style={{ 
                WebkitAppearance: 'none',
                appearance: 'none',
                background: 'transparent',
                cursor: 'pointer',
                opacity: 0, 
              }}
            />
            <div 
              className="absolute left-0 transform -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-300 shadow-lg rounded-full animate-pulse cursor-pointer z-10" 
              style={{ left: `${(filters.priceRange[1] / 1000) * 100}%`, pointerEvents: 'none' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeFilter;