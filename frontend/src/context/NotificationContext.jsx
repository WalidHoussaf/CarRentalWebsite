import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

// Create the context
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  // Configure toastify 
  const toastConfig = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  // Success notification
  const showSuccess = (message) => {
    toast.success(message, toastConfig);
  };

  // Error notification
  const showError = (message) => {
    toast.error(message, toastConfig);
  };

  // Info notification
  const showInfo = (message) => {
    toast.info(message, toastConfig);
  };

  // Warning notification
  const showWarning = (message) => {
    toast.warning(message, toastConfig);
  };

  const value = {
    showSuccess,
    showError,
    showInfo,
    showWarning
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;