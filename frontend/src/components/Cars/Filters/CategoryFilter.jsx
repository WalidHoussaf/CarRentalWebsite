import React from 'react';
import Select from 'react-select';
import { categories } from '../../../assets/assets';
import { useLanguage } from '../../../context/LanguageContext';
import { useTranslations } from '../../../translations';

const CategoryFilter = ({ filters, handleFilterChange }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: '2.75rem',
      minHeight: '2.75rem',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#374151',
      borderRadius: '0.375rem',
      fontFamily: 'Orbitron, sans-serif',
      color: 'white',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
      '&:hover': {
        borderColor: '#4B5563',
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'black',
      fontFamily: 'Orbitron, sans-serif',
      maxHeight: '240px',
      overflowY: 'hidden',
    }),
    menulist: (provided) => ({
      ...provided,
      maxHeight: '240px',
      overflowY: 'auto',
      paddingRight: '8px',
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(255, 255, 255, 0.5) transparent',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'rgba(59, 130, 246, 0.5)' : 'black',
      color: 'white',
      fontFamily: 'Orbitron, sans-serif',
      padding: '4px 8px',
      fontSize: '0.875rem',
      lineHeight: '1.2',
      '&:hover': {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
      fontFamily: 'Orbitron, sans-serif',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#FFFFFF',
      fontFamily: 'Orbitron, sans-serif',
    }),
  };

  // Transform categories to include translations
  const localizedCategories = categories.map(cat => ({
    value: cat.value,
    label: cat.label[language]
  }));

  return (
    <div className="mb-6">
      <label className="text-sm font-medium text-gray-300 mb-2 font-['Orbitron'] flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3a1 1 0 00.8-.4l3-4a1 1 0 00.2-.6V5a1 1 0 00-1-1H3zM14 7h2.7l-1.5 2H14V7z" />
        </svg>
        {t('category')}
      </label>
      <Select
        options={localizedCategories}
        value={localizedCategories.find(cat => cat.value === filters.category)}
        onChange={(selectedOption) => handleFilterChange('category', selectedOption.value)}
        styles={{
          ...customStyles,
          menu: (provided) => ({
            ...provided,
            backgroundColor: 'black',
            fontFamily: 'Orbitron, sans-serif',
            maxHeight: '240px',
            overflowY: 'hidden',
            zIndex: 9999
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

export default CategoryFilter;