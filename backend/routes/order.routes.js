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
    getTransporterActiveOrdersController
} from '../controllers/order.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { correctRole } from '../middlewares/authorizeRoles.js';

const router = express.Router();

// Validation chains
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
    body('reviewText').isString().optional().trim().isLength({ min: 10 }).isLength({ max: 100 }).withMessage('Review must be at least 10 and at most 100 characters'),
    body("reviewFor").isIn(["driver", "transporter"]).withMessage("Review must be for 'driver' or 'transporter'")
];

const updateOrderStatusValidation = [
    param('orderId').isMongoId().withMessage('Valid order ID is required'),
    body('status').isIn(['arrived', 'loaded', 'started', 'reached', 'unloaded']).withMessage('Invalid status')
];

// ==================== Order Creation & E-way Bill Routes ====================

router.post('/create', createOrderValidation, createOrderController);
router.post('/company/upload-eway-bill', uploadEwayBillValidation, uploadEwayBillController);

// ==================== Order Tracking & Review Routes ====================

router.get('/company/track/:orderid', param('orderid').isMongoId(), trackOrderController);
router.post('/company/rate/:orderId', rateOrderValidation, rateOrderController);
router.get('/company/active', param('orderId').isMongoId(), getCurrentOrdersController);

// ==================== Order Display Routes ====================

router.get('/company/all-orders', isLoggedIn, correctRole("company"), getOrdersController);
router.get('/driver/current-order', isLoggedIn, correctRole("driver"), getCurrentDriverOrderController);

// ==================== Transporter Routes ====================

router.get('/transporter/all-orders', isLoggedIn, correctRole("transporter"), getTransporterAllOrdersController);
router.get('/transporter/status/:orderId', isLoggedIn, correctRole("transporter"), param('orderId').isMongoId().withMessage("Invalid order ID"), getTransporterOrderStatusController);
router.get('transporter/active', isLoggedIn, correctRole("transporter"), getTransporterActiveOrdersController);

// ==================== Driver Routes ====================

router.get('/driver/history/', isLoggedIn, correctRole("driver"), getDriverHistoryController);

// ==================== Order Update Routes ====================

router.put('/driver/order/:orderId', isLoggedIn, correctRole("driver"), updateOrderStatusValidation, updateOrderStatusController);
/* 
// Example process routes (commented out, implement as needed)
// Route to get assigned orders for a driver
router.get('/driver/assigned/:driverId', getMyOrdersController);
// Route to mark order as arrived
router.put('/driver/status/arrived/:orderId', markAsArrivedController);
// Route to mark order as loaded
router.put('/driver/status/loaded/:ordered/:orderid', markloadedController);
// Route to mark order as started
router.put('/driver/status/started/:orderId', markStartedController);
// Route to mark order as reached
router.put('/driver/status/reached/:orderId', markReachedController);
// Route to mark order as unloaded
router.put('/driver/status/unloaded/:orderId', markUnloadedController);
*/

// ==================== Order Cancellation Route ====================

router.put('/company/cancel/:orderId', isLoggedIn, correctRole("company"), param('orderId').isMongoId(), cancelOrderController);

export default router;