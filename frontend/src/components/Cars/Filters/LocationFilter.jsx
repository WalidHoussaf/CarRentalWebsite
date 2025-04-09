import React from 'react';
import Select from 'react-select';
import { locations } from '../../../assets/assets';
import { selectStyles } from '../../../styles/selectStyles';
import { useLanguage } from '../../../context/LanguageContext';
import { useTranslations } from '../../../translations';

const LocationFilter = ({ filters, handleFilterChange }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  // Transform locations to include translations
  const localizedLocations = locations.map(loc => ({
    value: loc.value,
    label: loc.label[language]
  }));
  
  return (
    <div className="mb-6 relative">
      <label className="text-sm font-medium text-gray-300 mb-2 font-['Orbitron'] flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        {t('location')}
      </label>
      <Select
        options={localizedLocations}
        value={localizedLocations.find(loc => loc.value === filters.location)}
        onChange={(selectedOption) => handleFilterChange('location', selectedOption.value)}
        styles={{
          ...selectStyles,
          menu: (provided) => ({
            ...provided,
            backgroundColor: 'black',
            fontFamily: 'Orbitron, sans-serif',
            maxHeight: '240px',
            overflowY: 'hidden',
            zIndex: 9999 // High value to display above other elements
          }),
          menuPortal: (provided) => ({
            ...provided,
            zIndex: 9999
          })
        }}
        menuPortalTarget={document.body}
        isSearchable={false}
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
  );
};

export default LocationFilter;