import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { correctRole } from '../middlewares/authorizeRoles.js';

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

// ==================== Company Payment Routes ====================
router.post('/initiate/:orderId', isLoggedIn, correctRole("company"), initiatePaymentController);
router.post('/verify/:orderId', isLoggedIn, correctRole("company"), verifyPaymentController);
router.get('/payment-history', isLoggedIn, correctRole("company"), getPaymentHistoryController);
router.get('/order/:orderId', isLoggedIn, correctRole("company"), getPaymentByIdController);
router.get('/invoice/:orderId', isLoggedIn, correctRole("company"), downloadInvoiceController);
router.post('/refund/request/:orderId', isLoggedIn, correctRole("company"), requestRefundController);
router.get('/refund/status/:orderId', isLoggedIn, correctRole("company"), getRefundStatusController);

// ==================== Admin Payment Management Routes ====================

router.put('/mark-paid/:orderId', isLoggedIn, correctRole("admin"), markOrderAsPaidController);
router.post('/refund/process/:orderId', isLoggedIn, correctRole("admin"), processRefundController);
router.get('/all', isLoggedIn, correctRole("admin"), getAllPaymentsController);

export default router;
