import express from 'express';

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

router.post('/initiate/:orderId', initiatePaymentController);
router.post('/verify/:orderId', verifyPaymentController);
router.get('/payment-history', getPaymentHistoryController);
router.get('/order/:orderId', getPaymentByIdController);
router.get('/invoice/:orderId', downloadInvoiceController);
router.put('/link', linkPaymentToOrderController);
router.put('/mark-paid/:orderId', markOrderAsPaidController);
router.post('/refund/request/:orderId', requestRefundController);
router.post('/refund/process/:orderId', processRefundController);
router.get('/refund/status/:orderId', getRefundStatusController);
router.get('/all', getAllPaymentsController);
router.get('/company/:companyId', getPaymentsByCompanyController);
router.get('/transporter/:transporterId', getPaymentsByTransporterController);

// payment analytics (add analytics routes here if needed)

export default router;