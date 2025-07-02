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

// create and wpload routes
router.post('/create', createOrderController);
router.post('/company/upload-eway-bill', uploadEwayBillController);

//track order route
router.get('/track/:orderid', trackOrderController); 

//review order route
router.post('/rate/:orderId', rateOrderController);
router.get('/current-order/:orderId', getCurrentOrderController);

// Display order routes
router.get('/all-orders', getOrdersController);
router.get('/driver/current-order/:driverId', getCurrentDriverOrderController);

//Transporter routes
router.get('/status/:orderId', getOrderStatusController);
router.get('/order/active', getActiveOrdersController);

//Driver routes
router.get('/driver/history/:driverId', getDriverHistoryController);

//update routes
router.put('/driver/order/:orderId', updateOrderStatusController);
/* the process all comes in
router.get('/driver/assigned/:driverId', getMyOrdersController);
router.put('/driver/status/arrived/:orderId', markAsArrivedController);
router.put('/driver/status/loaded/:ordered/:orderid', markloadedController);
router.put('/driver/status/started/:orderId', markStartedController);
router.put('/driver/status/reached/:orderId', markReachedController);
router.put('/driver/status/unloaded/:orderId', markUnloadedController);
*/

//cancel order route
router.put('/cancel-order/:orderId', cancelOrderController);

export default router;