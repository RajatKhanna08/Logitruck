import express from 'express';
import { body } from 'express-validator';

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

const registerDriverValidation = [
  body('profileImg').notEmpty().withMessage('Profile image is required'),
  body('transporterId').notEmpty().withMessage('Transporter ID is required'),
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('documents.idProof').notEmpty().withMessage('ID Proof is required'),
  body('documents.license').notEmpty().withMessage('License is required'),
  body('vehicleType').notEmpty().withMessage('Vehicle type is required'),
  body('currentLocation.latitude').notEmpty().withMessage('Current latitude is required'),
  body('currentLocation.longitude').notEmpty().withMessage('Current longitude is required'),
  body('experience').isNumeric().withMessage('Experience is required'),
];

const loginDriverValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const updateDriverProfileValidation = [
  body('fullName').optional().notEmpty().withMessage('Full name cannot be empty'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('vehicleType').optional().notEmpty().withMessage('Vehicle type cannot be empty'),
  body('experience').optional().isNumeric().withMessage('Experience must be a number'),
  body('availabilityStatus').optional().isBoolean().withMessage('Availability status must be boolean'),
  body('currentLocation.latitude').optional().notEmpty().withMessage('Current latitude is required'),
  body('currentLocation.longitude').optional().notEmpty().withMessage('Current longitude is required')
];

const uploadDriverDocumentsValidation = [
  body('documents.idProof').notEmpty().withMessage('ID Proof is required'),
  body('documents.license').notEmpty().withMessage('License is required')
];

const router = express.Router();

// ==================== Driver Authentication Routes ====================
router.post('/register', registerDriverValidation, registerDriverController);
router.post('/login', loginDriverValidation, loginDriverController);
router.delete('/logout', isLoggedIn, correctRole("driver"), logoutDriverController);
router.get('/profile', isLoggedIn, correctRole("driver"), getDriverProfileController);
router.delete('/documents', isLoggedIn, correctRole("driver"), deleteDriverDocumentsController);

// ==================== Driver Profile & Document Update Routes ====================
router.put('/profile', isLoggedIn, correctRole("driver"), updateDriverProfileValidation, updateDriverProfileController);
router.put('/documents', isLoggedIn, correctRole("driver"), uploadDriverDocumentsValidation, uploadDriverDocumentsController);

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
