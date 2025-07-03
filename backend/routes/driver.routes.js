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

// Register a new driver
router.post('/register', registerDriverController);

// Login driver
router.post('/login', loginDriverController);

// Logout driver
router.delete('/logout', logoutDriverController);

// Get driver profile
router.get('/profile', getDriverProfileController);

// Get driver documents
router.get('/documents', getDriverDocumentsController);

// Delete driver documents
router.delete('/documents', deleteDriverDocumentsController);

// ==================== Driver Profile & Document Update Routes ====================

// Update driver profile
router.put('/profile', updateDriverProfileController);

// Upload or update driver documents
router.put('/documents', uploadDriverDocumentsController);

// ==================== Driver Order Management Routes ====================

// Get currently assigned order for driver
router.get('/order', getAssignedOrderController);

// Start an order (by orderId)
router.put('/order/start/:orderId', startOrderController);

// Update progress of an order (by orderId)
router.put('/order/update/:orderId', updateOrderProgressController);

// Mark order as reached/completed (by orderId)
router.put('/order/reached/:orderId', endOrderController);

// ==================== Driver Work Mode Routes ====================

// Get current work mode (online/offline)
router.get('/mode', getWorkModeController);

// Toggle work mode (online/offline)
router.put('/mode', toggleWorkModeController);

// ==================== Driver Order History & Emergency Routes ====================

// Get order history for driver
router.get('/order-history', getOrdersHistoryController);

// Request e-way bill extension for an order
router.post('/order/e-way-extension/:orderId', requestEWayExtensionController);

// Report emergency for an order
router.post('/order/emergency/:orderId', reportEmergencyController);

// ==================== Driver Location Routes ====================

// Update/get driver's current location
router.post('/location', getDriverCurrentLocationController);

// ==================== Driver Dashboard Route ====================

// Get driver dashboard data
router.get('/dashboard', getDriverDashboardController);

export default router;