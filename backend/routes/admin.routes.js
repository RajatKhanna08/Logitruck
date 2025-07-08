import express from 'express';
import { body, param } from 'express-validator';
import {
  adminLoginController,
  adminLogoutController,
  adminProfileController,
  adminRegisterController,
  cancelOrderController,
  deleteCompanyController,
  deleteReviewController,
  getAllCompaniesController,
  getAllDriversController,
  getAllOrdersController,
  getAllPaymentsController,
  getAllReviewsController,
  getAllTransportersController,
  getAllTrucksController,
  getCompanyByIdController,
  getDashboardStatsController,
  getDriverByIdController,
  getOrderByIdController,
  getPaymentByOrderIdController,
  getTransporterByIdController,
  getTruckByIdController,
  markOrderDelayedController,
  processRefundController,
  reassignOrderController,
  toggleBlockTransporterController,
  toggleCompanyBlockController,
  toggleTruckActivationController,
  verifyDriverDocumentsController,
  verifyTransporterController,
  verifyTruckDocumentsController
} from '../controllers/admin.controller.js';

import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { correctRole } from '../middlewares/authorizeRoles.js';

const router = express.Router();

// ==================== Validators ====================
const validateId = param('id').isMongoId().withMessage('Invalid ID');

const adminRegisterValidation = [
  body('fullName').notEmpty().trim().withMessage('Full name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required')
];

const adminLoginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const verifyTransporterValidation = [
  validateId,
  body('isVerified').isBoolean().withMessage('isVerified must be a boolean value')
];

// ==================== Admin Authentication ====================
router.post('/register', adminRegisterValidation, adminRegisterController);
router.post('/login', adminLoginValidation, adminLoginController);
router.post('/logout', isLoggedIn, correctRole('admin'), adminLogoutController);
router.get('/profile', isLoggedIn, correctRole('admin'), adminProfileController);

// ==================== Companies ====================
router.get('/companies', isLoggedIn, correctRole('admin'), getAllCompaniesController);
router.get('/company/:id', isLoggedIn, correctRole('admin'), validateId, getCompanyByIdController);
router.put('/company/:id/block', isLoggedIn, correctRole('admin'), validateId, toggleCompanyBlockController);
router.delete('/company/:id', isLoggedIn, correctRole('admin'), validateId, deleteCompanyController);

// ==================== Transporters ====================
router.get('/transporters', isLoggedIn, correctRole('admin'), getAllTransportersController);
router.get('/transporter/:id', isLoggedIn, correctRole('admin'), validateId, getTransporterByIdController);
router.put('/transporter/:id/verify', isLoggedIn, correctRole('admin'), verifyTransporterValidation, verifyTransporterController);
router.put('/transporter/:id/block', isLoggedIn, correctRole('admin'), validateId, toggleBlockTransporterController);

// ==================== Drivers ====================
router.get('/drivers', isLoggedIn, correctRole('admin'), getAllDriversController);
router.get('/driver/:id', isLoggedIn, correctRole('admin'), validateId, getDriverByIdController);
router.put('/driver/:id/verify-docs', isLoggedIn, correctRole('admin'), validateId, verifyDriverDocumentsController);

// ==================== Trucks ====================
router.get('/trucks', isLoggedIn, correctRole('admin'), getAllTrucksController);
router.get('/truck/:id', isLoggedIn, correctRole('admin'), validateId, getTruckByIdController);
router.put('/truck/:id/verify-docs', isLoggedIn, correctRole('admin'), validateId, verifyTruckDocumentsController);
router.put('/truck/:id/activate', isLoggedIn, correctRole('admin'), validateId, toggleTruckActivationController);

// ==================== Orders ====================
router.get('/orders', isLoggedIn, correctRole('admin'), getAllOrdersController);
router.get('/order/:id', isLoggedIn, correctRole('admin'), validateId, getOrderByIdController);
router.put('/order/:id/cancel', isLoggedIn, correctRole('admin'), validateId, cancelOrderController);
router.put('/order/:id/delayed', isLoggedIn, correctRole('admin'), validateId, markOrderDelayedController);
router.put('/order/:id/reassign', isLoggedIn, correctRole('admin'), validateId, reassignOrderController);

// ==================== Payments ====================
router.get('/payments', isLoggedIn, correctRole('admin'), getAllPaymentsController);
router.get('/payment/:id', isLoggedIn, correctRole('admin'), validateId, getPaymentByOrderIdController);
router.post('/payment/:id/refund', isLoggedIn, correctRole('admin'), validateId, processRefundController);

// ==================== Reviews ====================
router.get('/reviews', isLoggedIn, correctRole('admin'), getAllReviewsController);
router.delete('/review/:id', isLoggedIn, correctRole('admin'), validateId, deleteReviewController);

// ==================== Dashboard ====================
router.get('/stats', isLoggedIn, correctRole('admin'), getDashboardStatsController);

export default router;
