// src/styles/selectStyles.js

export const selectStyles = {
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
      zIndex: 9999,
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
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
      backgroundColor: state.isSelected ? 'rgba(59, 130, 246, 0.3)' : 'black',
      color: 'white',
      fontFamily: 'Orbitron, sans-serif',
      padding: '4px 8px',
      fontSize: '0.875rem',
      lineHeight: '1.2',
      '&:hover': {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
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