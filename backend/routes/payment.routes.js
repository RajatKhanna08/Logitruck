import express from 'express';

import {
  initiatePaymentController,
  verifyPaymentController,
  getPaymentHistoryController,
  getPaymentByIdController,
  downloadInvoiceController,
  markOrderAsPaidController,
  requestRefundController,
  processRefundController,
  getRefundStatusController,
  getAllPaymentsController,
} from '../controllers/payment.controller.js';

const router = express.Router();

// ==================== Payment Routes ====================

router.post('/initiate/:orderId', initiatePaymentController);
router.post('/verify/:orderId', verifyPaymentController);
router.get('/payment-history', getPaymentHistoryController);
router.get('/order/:orderId', getPaymentByIdController);
router.get('/invoice/:orderId', downloadInvoiceController);
router.put('/mark-paid/:orderId', markOrderAsPaidController);
router.post('/refund/request/:orderId', requestRefundController);
router.post('/refund/process/:orderId', processRefundController);
router.get('/refund/status/:orderId', getRefundStatusController);
router.get('/all', getAllPaymentsController);

// payment analytics (add analytics routes here if needed)

export default router;