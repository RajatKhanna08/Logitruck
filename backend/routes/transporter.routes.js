import express from 'express';
<<<<<<< HEAD
import { body, param } from 'express-validator';

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
=======
import { body } from 'express-validator';
>>>>>>> 9a29f083fc14e605c00e6b1d4898be51a2ab4f5e
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

<<<<<<< HEAD
// Validation chains
const registerTransporterValidation = [
    body('transporterName').notEmpty().withMessage('Transporter name is required'),
    body('ownerName').notEmpty().withMessage('Owner name is required'),
    body('contactNo').isMobilePhone().withMessage('Valid contact number is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('address.street').notEmpty().withMessage('Street is required'),
    body('address.city').notEmpty().withMessage('City is required'),
    body('address.state').notEmpty().withMessage('State is required'),
    body('address.pincode').isNumeric().withMessage('Pincode must be a number'),
    body('address.country').notEmpty().withMessage('Country is required'),
    body('address.landmark').notEmpty().withMessage('Landmark is required'),
    body('registrationNumber').notEmpty().withMessage('Registration number is required'),
    body('documents.idProof').notEmpty().withMessage('ID Proof is required'),
    body('documents.businessLicense').notEmpty().withMessage('Business License is required'),
    body('documents.gstCertificate').notEmpty().withMessage('GST Certificate is required'),
    body('fleetSize').isNumeric().withMessage('Fleet size must be a number')
];

const loginTransporterValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
]

// Add more validation chains as you implement more controllers

const updateTransporterProfileValidation = [
    body('transporterName').optional().notEmpty().withMessage('Transporter name cannot be empty'),
    body('ownerName').optional().notEmpty().withMessage('Owner name cannot be empty'),
    body('contactNo').optional().isMobilePhone().withMessage('Valid contact number is required'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('address.street').optional().notEmpty().withMessage('Street is required'),
    body('address.city').optional().notEmpty().withMessage('City is required'),
    body('address.state').optional().notEmpty().withMessage('State is required'),
    body('address.pincode').optional().isNumeric().withMessage('Pincode must be a number'),
    body('address.country').optional().notEmpty().withMessage('Country is required'),
    body('address.landmark').optional().notEmpty().withMessage('Landmark is required'),
    body('registrationNumber').optional().notEmpty().withMessage('Registration number is required'),
    body('fleetSize').optional().isNumeric().withMessage('Fleet size must be a number')
];

const updateTransporterPersonValidation = [
    body('contactPerson').notEmpty().withMessage('Contact person is required'),
    body('phone').isMobilePhone().withMessage('Valid phone number is required')
];

const uploadTransporterCertificationsValidations = [
    body('certifications').isArray({ min: 1 }).withMessage('At least one certification is required'),
]

const addTruckValidation = [
    body('registrationNumber').notEmpty().withMessage('Registration number is required'),
    body('brand').notEmpty().withMessage('Brand is required'),
    body('model').notEmpty().withMessage('Model is required'),
    body('vehicleType').notEmpty().withMessage('Vehicle type is required'),
    body('capacityInKg').isNumeric().withMessage('Capacity in Kg must be a number'),
    body('capacityInCubicMeters').isNumeric().withMessage('Capacity in Cubic Meters must be a number'),
    body('documents.rcBook').notEmpty().withMessage('RC Book is required'),
    body('documents.pollutionCertificate').notEmpty().withMessage('Pollution Certificate is required'),
    body('pollutionCertificateValidTill').notEmpty().withMessage('Pollution Certificate Valid Till is required'),
    body('assignedDriverId').notEmpty().withMessage('Assigned Driver ID is required')
];

// ==================== Transporter Profile Routes ====================

router.post('/register', registerTransporterValidation, registerTransporterController);
router.post('/login', loginTransporterValidation, loginTransporterController);
router.delete('/logout', isLoggedIn, correctRole("transporter"), logoutTransporterController);
router.get('/profile', isLoggedIn, correctRole("transporter"), getTransporterProfileController);
router.put('/certifications', isLoggedIn, correctRole("transporter"), uploadTransporterCertificationsValidations, uploadTransporterCertificationsController);
=======
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
>>>>>>> 9a29f083fc14e605c00e6b1d4898be51a2ab4f5e
router.get('/certifications', isLoggedIn, correctRole("transporter"), getTransporterCertificationsController);
router.delete('/certifications', isLoggedIn, correctRole("transporter"), deleteTransporterCertificationsController);

<<<<<<< HEAD
// ==================== Transporter Update Routes ====================

router.put('/profile', isLoggedIn, correctRole("transporter"), updateTransporterProfileValidation, updateTransporterProfileController);
router.put('/contact', isLoggedIn, correctRole("transporter"), updateTransporterPersonValidation, updateTransporterPersonController);

// ==================== Truck Routes ====================
=======
// ==================== Truck Management Routes ====================
>>>>>>> 9a29f083fc14e605c00e6b1d4898be51a2ab4f5e

router.post('/truck/add', isLoggedIn, correctRole("transporter"), addTruckValidation, addTruckController);
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
