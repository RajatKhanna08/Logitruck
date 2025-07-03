import express from 'express';

// Import payment-related controller functions
import {
  initiatePaymentController,
  verifyPaymentController,
  getPaymentHistoryController,
  getPaymentByIdController,
  downloadInvoiceController,
  linkPaymentToOrderController,
  markOrderAsPaidController,
  requestRefundController,
  processRefundController,
  getRefundStatusController,
  getAllPaymentsController,
  getPaymentsByCompanyController,
  getPaymentsByTransporterController
} from '../controllers/payment.controller.js';

const router = express.Router();

// ==================== Payment Routes ====================

// Route to initiate payment for an order
router.post('/initiate/:orderId', initiatePaymentController);

// Route to verify payment for an order
router.post('/verify/:orderId', verifyPaymentController);

// Route to get payment history
router.get('/payment-history', getPaymentHistoryController);

// Route to get payment details by order ID
router.get('/order/:orderId', getPaymentByIdController);

// Route to download invoice for an order
router.get('/invoice/:orderId', downloadInvoiceController);

// Route to link a payment to an order
router.put('/link', linkPaymentToOrderController);

// Route to mark an order as paid
router.put('/mark-paid/:orderId', markOrderAsPaidController);

// Route to request a refund for an order
router.post('/refund/request/:orderId', requestRefundController);

// Route to process a refund for an order
router.post('/refund/process/:orderId', processRefundController);

// Route to get refund status for an order
router.get('/refund/status/:orderId', getRefundStatusController);

// Route to get all payments
router.get('/all', getAllPaymentsController);

// Route to get payments by company ID
router.get('/company/:companyId', getPaymentsByCompanyController);

// Route to get payments by transporter ID
router.get('/transporter/:transporterId', getPaymentsByTransporterController);

// payment analytics (add analytics routes here if needed)

export default router;