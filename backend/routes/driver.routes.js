import express from 'express'

const router = express.Router();

//driver auth routes
router.post('/register', registerDriverController);
router.post('/login', loginDriverController);
router.delete('/logout', logoutDriverController);
router.get('/profile', getDriverProfileController);
router.get('/documents'. getDriverDocumentsController);
router.delete('/document', deleteDriverDocumentsController);

//driver updation routes
router.put('/profile', updateDriverProfileController);
router.put('/documents', uploadDriverDocumentsController);

//driver order routes
router.get('/order', getAssignedOrderController);
router.put('/order/start/:orderId', startOrderController);
router.put('/order/update/:orderId', updateOrderProgressController);
router.put('/order/reached/:orderId', endOrderController);
router.get('/mode', getWorkModeController);
router.put('/mode', toggleWorkModeController);
router.get('/order-history', getOrdersHistoryController);
router.post('/order/e-way-extension/:orderId', requestEWayExtensionController);
router.post('/order/emergency/:orderId', reportEmergencyController);

//driver location routes
router.post('/location', getDriverCurrentLocationController);

//driver dashboard routes
router.get('/dashboard', getDriverDashboardController);

export default router;