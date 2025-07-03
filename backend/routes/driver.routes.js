import express from 'express';
import {
  registerDriverController,
  loginDriverController,
  logoutDriverController,
  getDriverProfileController,
  getDriverDocumentsController,
  deleteDriverDocumentsController,
  updateDriverProfileController,
  uploadDriverDocumentsController,
  getAssignedOrderController,
  startOrderController,
  updateOrderProgressController,
  endOrderController,
  getWorkModeController,
  toggleWorkModeController,
  getOrdersHistoryController,
  requestEWayExtensionController,
  reportEmergencyController,
  getDriverCurrentLocationController,
  getDriverDashboardController
} from '../controllers/driver.controller.js';

const router = express.Router();

// ==================== Driver Authentication Routes ====================

router.post('/register', registerDriverController);
router.post('/login', loginDriverController);
router.delete('/logout', logoutDriverController);
router.get('/profile', getDriverProfileController);
router.get('/documents', getDriverDocumentsController);
router.delete('/documents', deleteDriverDocumentsController);

// ==================== Driver Profile & Document Update Routes ====================

router.put('/profile', updateDriverProfileController);
router.put('/documents', uploadDriverDocumentsController);

// ==================== Driver Order Management Routes ====================

router.get('/order', getAssignedOrderController);
router.put('/order/start/:orderId', startOrderController);
router.put('/order/update/:orderId', updateOrderProgressController);
router.put('/order/reached/:orderId', endOrderController);

// ==================== Driver Work Mode Routes ====================

router.get('/mode', getWorkModeController);
router.put('/mode', toggleWorkModeController);

// ==================== Driver Order History & Emergency Routes ====================

router.get('/order-history', getOrdersHistoryController);
router.post('/order/e-way-extension/:orderId', requestEWayExtensionController);
router.post('/order/emergency/:orderId', reportEmergencyController);

// ==================== Driver Location Routes ====================

router.post('/location', getDriverCurrentLocationController);

// ==================== Driver Dashboard Route ====================

router.get('/dashboard', getDriverDashboardController);

export default router;