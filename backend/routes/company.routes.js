import express from 'express';
import { body, param } from 'express-validator';

import { companyFields, upload } from '../middlewares/upload.js';
import {
    registerCompanyController,            
    loginCompanyController,                
    logoutCompanyController,                
    getCompanyProfileController,            
    uploadCompanyCertificationsController,  
    getCompanyCertificationsController,     
    deleteCompanyCertificationsController,
    updateCompanyProfileController,         
    getTruckSuggestionsController,          
    uploadEwayBillController,               
    getAvailableTrucksController,           
    filterTrucksController,                 
    getDriverByTruckController              
} from '../controllers/company.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { correctRole } from '../middlewares/authorizeRoles.js';

const registerCompanyValidation = [
    body('companyName').notEmpty().withMessage('Company name is required'),
    body('industry').notEmpty().withMessage('Industry is required'),
    body('registrationNumber').notEmpty().withMessage('Registration number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('contactPerson.name').notEmpty().withMessage('Contact person name is required'),
    body('contactPerson.phone').isMobilePhone().withMessage('Contact person phone is required'),
    body('contactPerson.email').isEmail().withMessage('Contact person email is required'),
    body('companyEmail').isEmail().withMessage('Company email is required'),
    body('companyPhone').isMobilePhone().withMessage('Company phone is required'),
    body('address.street').notEmpty().withMessage('Street is required'),
    body('address.city').notEmpty().withMessage('City is required'),
    body('address.state').notEmpty().withMessage('State is required'),
    body('address.pincode').isNumeric().withMessage('Pincode must be a number'),
    body('address.country').notEmpty().withMessage('Country is required'),
    body('address.landmark').notEmpty().withMessage('Landmark is required'),
    body('idProof').notEmpty().withMessage('ID Proof is required'),
    body('businessLicense').notEmpty().withMessage('Business License is required'),
    body('gstCertificate').notEmpty().withMessage('GST Certificate is required')
];

const loginCompanyValidation = [
    body('companyEmail').isEmail().withMessage('Valid company email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

const uploadCompanyCertificationsValidation = [
    body('certifications').isArray({ min: 1 }).withMessage('At least one certification is required')
];

const updateCompanyProfileValidation = [
    body('companyName').optional().notEmpty().withMessage('Company name cannot be empty'),
    body('industry').optional().notEmpty().withMessage('Industry cannot be empty'),
    body('registrationNumber').optional().notEmpty().withMessage('Registration number cannot be empty'),
    body('contactPerson.name').optional().notEmpty().withMessage('Contact person name cannot be empty'),
    body('contactPerson.phone').optional().isMobilePhone().withMessage('Contact person phone is required'),
    body('contactPerson.email').optional().isEmail().withMessage('Contact person email is required'),
    body('companyEmail').optional().isEmail().withMessage('Company email is required'),
    body('companyPhone').optional().isMobilePhone().withMessage('Company phone is required'),
    body('address.street').optional().notEmpty().withMessage('Street is required'),
    body('address.city').optional().notEmpty().withMessage('City is required'),
    body('address.state').optional().notEmpty().withMessage('State is required'),
    body('address.pincode').optional().isNumeric().withMessage('Pincode must be a number'),
    body('address.country').optional().notEmpty().withMessage('Country is required'),
    body('address.landmark').optional().notEmpty().withMessage('Landmark is required')
];

const router = express.Router();

// ==================== Company Profile Routes ====================

router.post('/register', registerCompanyValidation, companyFields, registerCompanyController);
router.post('/login', loginCompanyValidation, loginCompanyController);
router.delete('/logout', isLoggedIn, correctRole("company"), logoutCompanyController);
router.get('/profile', isLoggedIn, correctRole("company"), getCompanyProfileController);
router.put('/certifications', uploadCompanyCertificationsValidation, uploadCompanyCertificationsController);
router.get('/certifications', isLoggedIn, correctRole("company"), getCompanyCertificationsController);
router.delete('/certifications', isLoggedIn, correctRole("company"), deleteCompanyCertificationsController);

// ==================== Company Updation Routes ====================

router.put('/profile', isLoggedIn, correctRole("company"), updateCompanyProfileValidation, updateCompanyProfileController);

// ==================== Company Order Routes ====================

router.get('/suggestions/:orderId', isLoggedIn, correctRole("company"), getTruckSuggestionsController);
router.post('/order/eway/:orderId', isLoggedIn, correctRole("company"), uploadEwayBillController);

// ==================== Company Browse Routes ====================

router.get('/trucks', isLoggedIn, correctRole("company"), getAvailableTrucksController);
router.get('/filter', isLoggedIn, correctRole("company"), filterTrucksController);
router.get('/driver/:truckId', isLoggedIn, correctRole("company"), getDriverByTruckController);

export default router;