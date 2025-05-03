import axios from 'axios';

// API configuration - use a direct URL instead of relying on process.env
const API_BASE_URL = 'https://api.example.com';
const PAYPAL_ENDPOINT = `${API_BASE_URL}/api/payments/paypal`;

// Mock API for development
const useMockAPI = true;

/**
 * Create a PayPal payment for the booking
 * @param {Object} paymentData - Data needed for payment
 * @returns {Promise} - Promise with payment response
 */
export const createPayPalPayment = async (paymentData) => {
  // For development/testing, simulate API call
  if (useMockAPI) {
    return mockCreatePayment(paymentData);
  }

  try {
    const response = await axios.post(`${PAYPAL_ENDPOINT}/create`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Failed to create PayPal payment:', error);
    throw error;
  }
};

/**
 * Execute a PayPal payment after approval
 * @param {Object} paymentData - Data for completing the payment
 * @returns {Promise} - Promise with payment completion response
 */
export const executePayPalPayment = async (paymentData) => {
  // For development/testing, simulate API call
  if (useMockAPI) {
    return mockExecutePayment(paymentData);
  }

  try {
    const response = await axios.post(`${PAYPAL_ENDPOINT}/execute`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Failed to execute PayPal payment:', error);
    throw error;
  }
};

/**
 * Get details of a PayPal payment
 * @param {string} paymentId - ID of the payment to retrieve
 * @returns {Promise} - Promise with payment details
 */
export const getPayPalPaymentDetails = async (paymentId) => {
  // For development/testing, simulate API call
  if (useMockAPI) {
    return mockGetPaymentDetails(paymentId);
  }

  try {
    const response = await axios.get(`${PAYPAL_ENDPOINT}/details/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get PayPal payment details:', error);
    throw error;
  }
};

// ----- Mock implementations for development/testing -----

/**
 * Mock implementation of createPayPalPayment
 * @param {Object} paymentData - Payment data
 * @returns {Promise} - Promise with mock payment response
 */
const mockCreatePayment = async (paymentData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate random payment ID
  const paymentId = 'PP-' + Math.random().toString(36).substr(2, 9);
  
  return {
    success: true,
    paymentId,
    status: 'created',
    amount: paymentData.amount,
    currency: paymentData.currency || 'USD',
    createdAt: new Date().toISOString(),
    approvalUrl: `https://www.sandbox.paypal.com/checkoutnow?token=${paymentId}`
  };
};

/**
 * Mock implementation of executePayPalPayment
 * @param {Object} paymentData - Payment execution data
 * @returns {Promise} - Promise with mock execution response
 */
const mockExecutePayment = async (paymentData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate payment success (95% success rate)
  const isSuccessful = Math.random() > 0.05;
  
  if (!isSuccessful) {
    throw new Error('Payment execution failed');
  }
  
  return {
    success: true,
    paymentId: paymentData.paymentId,
    transactionId: 'T-' + Math.random().toString(36).substr(2, 10),
    status: 'completed',
    completedAt: new Date().toISOString(),
    payer: {
      email: paymentData.email || 'customer@example.com',
      firstName: 'Test',
      lastName: 'Customer'
    }
  };
};

/**
 * Mock implementation of getPayPalPaymentDetails
 * @param {string} paymentId - Payment ID
 * @returns {Promise} - Promise with mock payment details
 */
const mockGetPaymentDetails = async (paymentId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    success: true,
    payment: {
      id: paymentId,
      status: 'completed',
      amount: 199.99,
      currency: 'USD',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date().toISOString(),
      payer: {
        email: 'customer@example.com',
        firstName: 'Test',
        lastName: 'Customer'
      }
    }
  };
};

export default {
  createPayPalPayment,
  executePayPalPayment,
  getPayPalPaymentDetails
}; 