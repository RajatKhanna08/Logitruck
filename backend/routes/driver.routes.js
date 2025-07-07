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
  getDriverDashboardController,
  // NEW CONTROLLERS FOR DOCUMENTS
  uploadKataParchiBeforeController,
  uploadKataParchiAfterController,
  uploadReceivingDocumentController
} from '../controllers/driver.controller.js';

import { correctRole } from '../middlewares/authorizeRoles.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = express.Router();

// ==================== Driver Authentication Routes ====================
router.post('/register', registerDriverController);
router.post('/login', loginDriverController);
router.delete('/logout', isLoggedIn, correctRole("driver"), logoutDriverController);
router.get('/profile', isLoggedIn, correctRole("driver"), getDriverProfileController);
router.get('/documents', isLoggedIn, correctRole("driver"), getDriverDocumentsController);
router.delete('/documents', isLoggedIn, correctRole("driver"), deleteDriverDocumentsController);

// ==================== Driver Profile & Document Update Routes ====================
router.put('/profile', isLoggedIn, correctRole("driver"), updateDriverProfileController);
router.put('/documents', isLoggedIn, correctRole("driver"), uploadDriverDocumentsController);

// ==================== Driver Order Management Routes ====================
router.get('/order', isLoggedIn, correctRole("driver"), getAssignedOrderController);
router.put('/order/start/:orderId', isLoggedIn, correctRole("driver"), startOrderController);
router.put('/order/update/:orderId', isLoggedIn, correctRole("driver"), updateOrderProgressController);
router.put('/order/reached/:orderId', isLoggedIn, correctRole("driver"), endOrderController);

// ==================== Driver Work Mode Routes ====================
router.get('/mode', isLoggedIn, correctRole("driver"), getWorkModeController);
router.put('/mode', isLoggedIn, correctRole("driver"), toggleWorkModeController);

// ==================== Driver Order History & Emergency Routes ====================
router.get('/order-history', isLoggedIn, correctRole("driver"), getOrdersHistoryController);
router.post('/order/e-way-extension/:orderId', isLoggedIn, correctRole("driver"), requestEWayExtensionController);
router.post('/order/emergency/:orderId', isLoggedIn, correctRole("driver"), reportEmergencyController);

// ==================== Driver Location Routes ====================
router.post('/location', isLoggedIn, correctRole("driver"), getDriverCurrentLocationController);

// ==================== Driver Dashboard Route ====================
router.get('/dashboard', isLoggedIn, correctRole("driver"), getDriverDashboardController);

// ==================== Driver Order Document Upload Routes (NEW) ====================
router.post('/order/kata-parchi-before/:orderId', isLoggedIn, correctRole("driver"), uploadKataParchiBeforeController);
router.post('/order/kata-parchi-after/:orderId', isLoggedIn, correctRole("driver"), uploadKataParchiAfterController);
router.post('/order/receiving/:orderId', isLoggedIn, correctRole("driver"), uploadReceivingDocumentController);

export default router;
