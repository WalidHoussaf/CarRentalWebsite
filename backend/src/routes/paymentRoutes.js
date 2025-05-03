const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/authMiddleware');

// PayPal payment routes
router.post('/paypal/create', authMiddleware, paymentController.createPayPalPayment);
router.post('/paypal/execute', authMiddleware, paymentController.executePayPalPayment);
router.get('/paypal/details/:paymentId', authMiddleware, paymentController.getPayPalPaymentDetails);

// PayPal redirect handlers (public routes)
router.get('/paypal/success', paymentController.handlePayPalSuccess);
router.get('/paypal/cancel', paymentController.handlePayPalCancel);

module.exports = router; 