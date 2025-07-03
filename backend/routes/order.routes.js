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

// Route to create a new order
router.post('/create', createOrderController);

// Route to upload e-way bill for a company
router.post('/company/upload-eway-bill', uploadEwayBillController);

// ==================== Order Tracking & Review Routes ====================

// Route to track an order by order ID
router.get('/track/:orderid', trackOrderController); 

// Route to rate/review an order
router.post('/rate/:orderId', rateOrderController);

// Route to get current order details by order ID
router.get('/current-order/:orderId', getCurrentOrderController);

// ==================== Order Display Routes ====================

// Route to get all orders
router.get('/all-orders', getOrdersController);

// Route to get current order for a driver by driver ID
router.get('/driver/current-order/:driverId', getCurrentDriverOrderController);

// ==================== Transporter Routes ====================

// Route to get status of an order by order ID
router.get('/status/:orderId', getOrderStatusController);

// Route to get all active orders
router.get('/order/active', getActiveOrdersController);

// ==================== Driver Routes ====================

// Route to get order history for a driver by driver ID
router.get('/driver/history/:driverId', getDriverHistoryController);

// ==================== Order Update Routes ====================

// Route to update order status by order ID (for driver)
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

// Route to cancel an order by order ID
router.put('/cancel-order/:orderId', cancelOrderController);

export default router;