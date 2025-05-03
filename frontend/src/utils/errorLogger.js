/**
 * Centralized error logging utility 
 * 
 * This module provides a consistent way to handle errors throughout the application
 * while making it easy to integrate with external services like Sentry or custom
 * backend logging in the future.
 */

// Check for development mode - default to false in case window.location isn't available
const isDevelopment = () => {
  try {
    // Check if the current URL contains development indicators
    const url = window.location.href.toLowerCase();
    return url.includes('localhost') || 
           url.includes('127.0.0.1') || 
           url.includes('.local') ||
           url.includes('dev.');
  } catch {
    return false;
  }
};

// Control whether errors are logged to console in development mode
const DEV_MODE = isDevelopment();

/**
 * Log an error with optional context information
 * 
 * @param {Error|string} error - The error object or message
 * @param {string} source - The component or service where the error occurred
 * @param {Object} [context] - Additional context information
 */
export const logError = (error, source, context = {}) => {
  // In development, we might want to still see errors in console
  if (DEV_MODE) {
    console.error(`[${source}]`, error, context);
  }
  
  // Here you would integrate with your error tracking service
  // For example, with Sentry:
  // if (Sentry && Sentry.captureException) {
  //   Sentry.setContext("component", { source, ...context });
  //   Sentry.captureException(error);
  // }
  
  // Or send to your backend logging endpoint:
  // try {
  //   fetch('/api/logs/error', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       error: error instanceof Error ? error.message : error,
  //       source,
  //       context,
  //       timestamp: new Date().toISOString(),
  //     })
  //   });
  // } catch (e) {
  //   // Silent catch - don't want errors in error logger
  // }
};

/**
 * Log an API error with relevant request details
 * 
 * @param {Error} error - The error object from the API request
 * @param {string} endpoint - The API endpoint that was called
 * @param {Object} [requestData] - The data sent with the request
 */
export const logApiError = (error, endpoint, requestData = {}) => {
  const context = {
    endpoint,
    requestData,
    status: error.response?.status,
    statusText: error.response?.statusText,
    isNetworkError: error.request && !error.response,
    isTimeoutError: error.code === 'ECONNABORTED',
  };
  
  logError(error, 'API', context);
  
  // Return a user-friendly error message
  if (error.response) {
    return `Server error (${error.response.status}): ${error.response.statusText || 'Unknown error'}`;
  } else if (error.request) {
    return 'No response from server. Please check your connection.';
  } else if (error.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again.';
  } else {
    return 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Handle an error with an appropriate UI message
 * 
 * @param {Error} error - The error that occurred
 * @param {string} source - The component where the error occurred
 * @param {string} [fallbackMessage] - A fallback user-friendly message
 * @returns {string} A user-friendly error message
 */
export const handleError = (error, source, fallbackMessage = 'An error occurred') => {
  // Log the error
  logError(error, source);
  
  // Generate a user-friendly message based on the error type
  if (error.message) {
    // Clean up the error message for display
    const cleanMessage = error.message
      .replace(/Error:/g, '')
      .trim();
    
    return cleanMessage || fallbackMessage;
  }
  
  return fallbackMessage;
};

export default {
  logError,
  logApiError,
  handleError
}; 