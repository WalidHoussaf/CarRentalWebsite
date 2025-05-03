const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// PayPal configuration
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
const BASE_URL = process.env.BASE_URL || 'https://carrentalwebsite.com';

/**
 * Get PayPal access token
 * @returns {Promise<string>} PayPal access token
 */
const getPayPalAccessToken = async () => {
  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    const { data } = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: PAYPAL_CLIENT_ID,
        password: PAYPAL_SECRET,
      },
    });

    return data.access_token;
  } catch (error) {
    logger.error('Error getting PayPal access token:', error);
    throw new Error('Failed to get PayPal access token');
  }
};

/**
 * Create a PayPal payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createPayPalPayment = async (req, res) => {
  try {
    const { amount, currency = 'USD', description, bookingId, items = [] } = req.body;

    if (!amount || !bookingId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount and bookingId are required' 
      });
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Prepare the payment request
    const paymentRequest = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: bookingId,
          description,
          amount: {
            currency_code: currency,
            value: amount.toString(),
            breakdown: {
              item_total: {
                currency_code: currency,
                value: amount.toString(),
              },
            },
          },
          items: items.map(item => ({
            name: item.name,
            description: item.description,
            unit_amount: {
              currency_code: currency,
              value: (item.amount / item.quantity || 1).toString(),
            },
            quantity: item.quantity || 1,
          })),
        },
      ],
      application_context: {
        brand_name: 'Car Rental Website',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${BASE_URL}/api/payments/paypal/success`,
        cancel_url: `${BASE_URL}/api/payments/paypal/cancel`,
      },
    };

    // Create the payment
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      paymentRequest,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Save payment information
    const payment = new Payment({
      paymentId: response.data.id,
      bookingId,
      amount,
      currency,
      status: response.data.status,
      provider: 'paypal',
      createdAt: new Date(),
    });

    await payment.save();

    // Return success response
    return res.status(200).json({
      success: true,
      paymentId: response.data.id,
      status: response.data.status,
      approvalUrl: response.data.links.find(link => link.rel === 'approve').href,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error creating PayPal payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create PayPal payment',
      error: error.message,
    });
  }
};

/**
 * Execute a PayPal payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.executePayPalPayment = async (req, res) => {
  try {
    const { paymentId, payerId } = req.body;

    if (!paymentId || !payerId) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID and Payer ID are required',
      });
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Capture the payment
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${paymentId}/capture`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Get payment details from our database
    const payment = await Payment.findOne({ paymentId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // Update payment status
    payment.status = response.data.status;
    payment.payerId = payerId;
    payment.completedAt = new Date();
    payment.details = {
      captureId: response.data.purchase_units[0].payments.captures[0].id,
      payerEmail: response.data.payer.email_address,
      payerName: `${response.data.payer.name.given_name} ${response.data.payer.name.surname}`,
    };

    await payment.save();

    // Update booking status if payment is successful
    if (response.data.status === 'COMPLETED') {
      const booking = await Booking.findById(payment.bookingId);
      
      if (booking) {
        booking.paymentStatus = 'paid';
        booking.status = 'confirmed';
        booking.statusHistory.push({
          status: 'confirmed',
          date: new Date(),
          notes: 'Payment completed via PayPal',
        });
        
        await booking.save();
      }
    }

    // Return success response
    return res.status(200).json({
      success: true,
      paymentId,
      transactionId: response.data.purchase_units[0].payments.captures[0].id,
      status: response.data.status,
      completedAt: new Date().toISOString(),
      payer: {
        email: response.data.payer.email_address,
        firstName: response.data.payer.name.given_name,
        lastName: response.data.payer.name.surname,
      },
    });
  } catch (error) {
    logger.error('Error executing PayPal payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to execute PayPal payment',
      error: error.message,
    });
  }
};

/**
 * Get PayPal payment details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getPayPalPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID is required',
      });
    }

    // Get payment from our database
    const payment = await Payment.findOne({ paymentId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // Return payment details
    return res.status(200).json({
      success: true,
      payment: {
        id: payment.paymentId,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        createdAt: payment.createdAt,
        completedAt: payment.completedAt,
        payer: payment.details?.payerEmail ? {
          email: payment.details.payerEmail,
          firstName: payment.details.payerName?.split(' ')[0],
          lastName: payment.details.payerName?.split(' ')[1],
        } : null,
      },
    });
  } catch (error) {
    logger.error('Error getting PayPal payment details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get PayPal payment details',
      error: error.message,
    });
  }
};

/**
 * Handle PayPal payment success (for PayPal redirect)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.handlePayPalSuccess = async (req, res) => {
  try {
    const { token, PayerID } = req.query;

    // Redirect to frontend success page
    return res.redirect(`${BASE_URL}/payment/success?token=${token}&PayerID=${PayerID}`);
  } catch (error) {
    logger.error('Error handling PayPal success:', error);
    return res.redirect(`${BASE_URL}/payment/error`);
  }
};

/**
 * Handle PayPal payment cancel (for PayPal redirect)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.handlePayPalCancel = async (req, res) => {
  try {
    // Redirect to frontend cancel page
    return res.redirect(`${BASE_URL}/payment/cancel`);
  } catch (error) {
    logger.error('Error handling PayPal cancel:', error);
    return res.redirect(`${BASE_URL}/payment/error`);
  }
}; 