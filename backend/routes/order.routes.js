import express from 'express';
import { body, param } from 'express-validator';

import {
  createOrderController,
  uploadEwayBillController,
  trackOrderController,
  rateOrderController,
  getOrdersController,
  getCurrentDriverOrderController,
  getDriverHistoryController,
  updateOrderStatusController,
  cancelOrderController,
  getCurrentOrdersController,
  getTransporterOrderStatusController,
  getTransporterAllOrdersController,
  getTransporterActiveOrdersController,
  updateOrderLocationController
} from '../controllers/order.controller.js';

import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { correctRole } from '../middlewares/authorizeRoles.js';

const router = express.Router();

// ==================== Validation Chains ====================

const createOrderValidation = [
  body('pickupLocation').notEmpty().withMessage('Pickup location is required'),
  body('dropLocations').isArray({ min: 1 }).withMessage('At least one drop location is required'),
  body('scheduledAt').optional().isISO8601().withMessage('scheduledAt must be a valid date'),
  body('isBiddingEnabled').isBoolean().withMessage('isBiddingEnabled must be a boolean'),
  body('biddingExpiresAt').optional().isISO8601().withMessage('biddingExpiresAt must be a valid date'),
  body('loadDetails').notEmpty().withMessage('loadDetails is required'),
  body('completedStops').optional().isArray().withMessage('completedStops must be an array'),
  body('distance').optional().isNumeric().withMessage('distance must be a number'),
  body('duration').optional().isNumeric().withMessage('duration must be a number'),
  body('fare').optional().isNumeric().withMessage('fare must be a number'),
  body('paymentMode').optional().isString().withMessage('paymentMode must be a string')
];

const uploadEwayBillValidation = [
  body('orderId').isMongoId().withMessage('Valid order ID is required'),
  body('ewayBillNumber').notEmpty().withMessage('E-way bill number is required')
];

const rateOrderValidation = [
  param('orderId').isMongoId().withMessage('Valid order ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('reviewText').optional().isString().trim().isLength({ min: 10, max: 100 }).withMessage('Review must be between 10 and 100 characters'),
  body('reviewFor').isIn(['driver', 'transporter']).withMessage("Review must be for 'driver' or 'transporter'")
];

const updateOrderStatusValidation = [
  param('orderId').isMongoId().withMessage('Valid order ID is required'),
  body('status').isIn(['arrived', 'loaded', 'started', 'reached', 'unloaded']).withMessage('Invalid status')
];

// ==================== Company Routes ====================

router.post('/create', isLoggedIn, correctRole("company"), createOrderValidation, createOrderController);
router.post('/company/upload-eway-bill', isLoggedIn, correctRole("company"), uploadEwayBillValidation, uploadEwayBillController);
router.get('/company/track/:orderId', isLoggedIn, correctRole("company"), param('orderId').isMongoId(), trackOrderController);
router.post('/company/track/:orderId', isLoggedIn, correctRole("company"), updateOrderLocationController);
router.post('/company/rate/:orderId', isLoggedIn, correctRole("company"), rateOrderValidation, rateOrderController);
router.get('/company/active/:orderId', isLoggedIn, correctRole("company"), param('orderId').isMongoId(), getCurrentOrdersController);
router.get('/company/all-orders', isLoggedIn, correctRole("company"), getOrdersController);
router.put('/company/cancel/:orderId', isLoggedIn, correctRole("company"), param('orderId').isMongoId(), cancelOrderController);

// ==================== Driver Routes ====================

router.get('/driver/current-order', isLoggedIn, correctRole("driver"), getCurrentDriverOrderController);
router.get('/driver/history', isLoggedIn, correctRole("driver"), getDriverHistoryController);
router.put('/driver/order/:orderId', isLoggedIn, correctRole("driver"), updateOrderStatusValidation, updateOrderStatusController);

// ==================== Transporter Routes ====================

router.get('/transporter/all-orders', isLoggedIn, correctRole("transporter"), getTransporterAllOrdersController);
router.get('/transporter/status/:orderId', isLoggedIn, correctRole("transporter"), param('orderId').isMongoId().withMessage("Invalid order ID"), getTransporterOrderStatusController);
router.get('/transporter/active', isLoggedIn, correctRole("transporter"), getTransporterActiveOrdersController);

export default router;
