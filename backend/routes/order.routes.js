import express from 'express';
import {
    createOrderController,
    uploadEwayBillController,
    trackOrderController,
    rateOrderController,
    getCurrentOrderController,
    getOrdersController,
    getCurrentDriverOrderController,
    getOrderStatusController,
    getActiveOrdersController,
    getDriverHistoryController,
    updateOrderStatusController,
    cancelOrderController
} from '../controllers/order.controller.js';

const router = express.Router();

// ==================== Order Creation & E-way Bill Routes ====================

router.post('/create', createOrderController);
router.post('/company/upload-eway-bill', uploadEwayBillController);

// ==================== Order Tracking & Review Routes ====================

router.get('/track/:orderid', trackOrderController); 
router.post('/rate/:orderId', rateOrderController);
router.get('/current-order/:orderId', getCurrentOrderController);

// ==================== Order Display Routes ====================

router.get('/all-orders', getOrdersController);
router.get('/driver/current-order/:driverId', getCurrentDriverOrderController);

// ==================== Transporter Routes ====================

router.get('/status/:orderId', getOrderStatusController);
router.get('/order/active', getActiveOrdersController);

// ==================== Driver Routes ====================

router.get('/driver/history/:driverId', getDriverHistoryController);

// ==================== Order Update Routes ====================

router.put('/driver/order/:orderId', updateOrderStatusController);
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

router.put('/cancel-order/:orderId', cancelOrderController);

export default router;