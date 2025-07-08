import express from 'express';
import { body } from 'express-validator';
import { correctRole } from '../middlewares/authorizeRoles.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

import {
  registerTransporterController,
  loginTransporterController,
  logoutTransporterController,
  getTransporterProfileController,
  uploadTransporterCertificationsController,
  updateTransporterProfileController,
  updateTransporterPersonController,
  addTruckController,
  getMyTrucksController,
  getTruckByIdController,
  updateTruckDetailsController,
  uploadTruckDocumentsController,
  updateDriverReferenceController,
  deleteTruckController,
  getMyDriversController,
  getDriverByIdController,
  removeDriverController,
  uploadBiltyController,
  deleteTransporterCertificationsController,
  getTransporterCertificationsController,
  getTransporterDashboardController,
  activateTruckWithDriverController,
  deactivateTruckWithDriverController
} from '../controllers/transporter.controller.js';

const router = express.Router();

// ==================== VALIDATION ====================

const transporterRegisterValidation = [
  body('companyName')
    .notEmpty().withMessage('Company name is required')
    .isLength({ min: 2 }).withMessage('Company name must be at least 2 characters'),

  body('registrationNumber')
    .notEmpty().withMessage('Registration number is required'),

  body('email')
    .isEmail().withMessage('Valid email is required'),

  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('phone')
    .isMobilePhone().withMessage('Valid phone number is required'),

  body('address')
    .notEmpty().withMessage('Address is required'),

  body('documents.gst')
    .notEmpty().withMessage('GST document is required'),

  body('documents.pan')
    .notEmpty().withMessage('PAN document is required')
];

const transporterLoginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// ==================== Auth & Profile Routes ====================

router.post('/register', transporterRegisterValidation, registerTransporterController);
router.post('/login', transporterLoginValidation, loginTransporterController);
router.delete('/logout', isLoggedIn, correctRole("transporter"), logoutTransporterController);
router.get('/profile', isLoggedIn, correctRole("transporter"), getTransporterProfileController);
router.put('/profile', isLoggedIn, correctRole("transporter"), updateTransporterProfileController);
router.put('/contact', isLoggedIn, correctRole("transporter"), updateTransporterPersonController);
router.get('/dashboard', isLoggedIn, correctRole("transporter"), getTransporterDashboardController);

// ==================== Certification Routes ====================

router.put('/certifications', isLoggedIn, correctRole("transporter"), uploadTransporterCertificationsController);
router.get('/certifications', isLoggedIn, correctRole("transporter"), getTransporterCertificationsController);
router.delete('/certifications', isLoggedIn, correctRole("transporter"), deleteTransporterCertificationsController);

// ==================== Truck Management Routes ====================

router.post('/truck/add', isLoggedIn, correctRole("transporter"), addTruckController);
router.get('/truck/my', isLoggedIn, correctRole("transporter"), getMyTrucksController);
router.get('/truck/:truckId', isLoggedIn, correctRole("transporter"), getTruckByIdController);
router.put('/truck/:truckId', isLoggedIn, correctRole("transporter"), updateTruckDetailsController);
router.post('/upload-docs/:truckId', isLoggedIn, correctRole("transporter"), uploadTruckDocumentsController);
router.put('/transporter/driver-ref/:truckId', isLoggedIn, correctRole("transporter"), updateDriverReferenceController);
router.put('/activate/:truckId', isLoggedIn, correctRole("transporter"), activateTruckWithDriverController);
router.put('/deactivate/:truckId', isLoggedIn, correctRole("transporter"), deactivateTruckWithDriverController);
router.delete('/truck/:truckId', isLoggedIn, correctRole("transporter"), deleteTruckController);

// ==================== Driver Management Routes ====================

router.get('/driver/my', isLoggedIn, correctRole("transporter"), getMyDriversController);
router.get('/driver/:driverId', isLoggedIn, correctRole("transporter"), getDriverByIdController);
router.delete('/driver/:driverId', isLoggedIn, correctRole("transporter"), removeDriverController);

// ==================== Bilty Upload ====================

router.post('/order/upload-bilty/:orderId', isLoggedIn, correctRole("transporter"), uploadBiltyController);

export default router;
