import express from 'express';
import { body } from 'express-validator';

import { correctRole } from '../middlewares/authorizeRoles.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { transporterFields, truckDocFields } from '../middlewares/upload.js';

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
  activateTruckController,
  deactivateTruckController
} from '../controllers/transporter.controller.js';

// === Validation chains ===

export const registerTransporterValidation = [
    // Basic Fields
    body("transporterName").notEmpty().withMessage("Transporter name is required"),
    body("ownerName").notEmpty().withMessage("Owner name is required"),
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("contactNo").isLength({ min: 10, max: 15 }).withMessage("Contact number must be between 10 to 15 digits"),
    body("registrationNumber").notEmpty().withMessage("Registration number is required"),
    // Address (Nested)
    body('address.street').optional().notEmpty().withMessage('Street is required'),
    body('address.city').optional().notEmpty().withMessage('City is required'),
    body('address.state').optional().notEmpty().withMessage('State is required'),
    body('address.pincode').optional().isNumeric().withMessage('Pincode must be a number'),
    body('address.country').optional().notEmpty().withMessage('Country is required'),
    body('address.landmark').optional().notEmpty().withMessage('Landmark is required')
];


const loginTransporterValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

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
  body('registrationNumber').optional().notEmpty().withMessage('Registration number is required')
  
];

const updateTransporterPersonValidation = [
  body('ownerName').optional().notEmpty().withMessage('Owner name cannot be empty'),
  body('contactNo').optional().isMobilePhone().withMessage('Valid contact number is required'),
  body('email').optional().isEmail().withMessage('Valid email is required')
];

const addTruckValidation = [
  body('registrationNumber').notEmpty().withMessage('Registration number is required'),
  body('brand').notEmpty().withMessage('Brand is required'),
  body('model').notEmpty().withMessage('Model is required'),
  body('vehicleType').notEmpty().withMessage('Vehicle type is required'),
  body('capacityInTon').isNumeric().withMessage('Capacity in Ton must be a number'),
  body('capacityInCubicMeters').isNumeric().withMessage('Capacity in Cubic Meters must be a number'),
  body('pollutionCertificateValidTill').notEmpty().withMessage('Pollution Certificate Valid Till is required'),
  body('assignedDriverId').optional().notEmpty().withMessage('Assigned Driver ID cannot be empty if provided') // This is already optional
];

// === Router setup ===

const router = express.Router();

// === Auth & Profile ===

router.post('/register', transporterFields, registerTransporterValidation, registerTransporterController);
router.post('/login', loginTransporterValidation, loginTransporterController);
router.delete('/logout', isLoggedIn, correctRole("transporter"), logoutTransporterController);

router.get('/profile', isLoggedIn, correctRole("transporter"), getTransporterProfileController);
router.put('/profile', isLoggedIn, correctRole("transporter"), updateTransporterProfileValidation, updateTransporterProfileController);
router.put('/contact', isLoggedIn, correctRole("transporter"), updateTransporterPersonValidation, updateTransporterPersonController);

router.get('/dashboard', isLoggedIn, correctRole("transporter"), getTransporterDashboardController);

// === Certifications ===

router.put('/certifications', isLoggedIn, correctRole("transporter"), uploadTransporterCertificationsController);
router.get('/certifications', isLoggedIn, correctRole("transporter"), getTransporterCertificationsController);
router.delete('/certifications', isLoggedIn, correctRole("transporter"), deleteTransporterCertificationsController);

// === Trucks ===

router.post('/truck/add', isLoggedIn, correctRole("transporter"), addTruckValidation, addTruckController);
router.get('/truck/my', isLoggedIn, correctRole("transporter"), getMyTrucksController);
router.get('/truck/:truckId', isLoggedIn, correctRole("transporter"), getTruckByIdController);
router.put('/truck/:truckId', isLoggedIn, correctRole("transporter"), updateTruckDetailsController);
router.post('/truck/upload-docs/:truckId', isLoggedIn, correctRole("transporter"), truckDocFields, uploadTruckDocumentsController);
router.put('/truck/driver-ref/:truckId', isLoggedIn, correctRole("transporter"), updateDriverReferenceController);
router.put('/truck/activate/:truckId', isLoggedIn, correctRole("transporter"), activateTruckController);
router.put('/truck/deactivate/:truckId', isLoggedIn, correctRole("transporter"), deactivateTruckController);
router.delete('/truck/:truckId', isLoggedIn, correctRole("transporter"), deleteTruckController);

// === Drivers ===

router.get('/driver/my', isLoggedIn, correctRole("transporter"), getMyDriversController);
router.get('/driver/:driverId', isLoggedIn, correctRole("transporter"), getDriverByIdController);
router.delete('/driver/:driverId', isLoggedIn, correctRole("transporter"), removeDriverController);

// === Order Bilty Upload ===

router.post('/order/upload-bilty/:orderId', isLoggedIn, correctRole("transporter"), uploadBiltyController);

export default router;