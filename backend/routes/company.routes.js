import express from 'express';
import {
    registerCompanyController,              // Controller for company registration
    loginCompanyController,                 // Controller for company login
    logoutCompanyController,                // Controller for company logout
    getCompanyProfileController,            // Controller to get company profile
    uploadCompanyCertificationsController,  // Controller to upload company certifications
    getCompanyCertificationsController,     // Controller to get company certifications
    deleteCompanyCertificationsController,// Controller to delete company certifications
    updateCompanyProfileController,         // Controller to update company profile
    updateCompanyPersonController,          // Controller to update company contact person
    getTruckSuggestionsController,          // Controller to get truck suggestions for an order
    uploadEwayBillController,               // Controller to upload e-way bill for an order
    getAvailableTrucksController,           // Controller to get available trucks
    filterTrucksController,                 // Controller to filter trucks
    getDriverByTruckController              // Controller to get driver by truck ID
} from '../controllers/company.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { correctRole } from '../middlewares/authorizeRoles.js';

const router = express.Router();

// ==================== Company Profile Routes ====================

router.post('/register', registerCompanyController);
router.post('/login', loginCompanyController);
router.delete('/logout', isLoggedIn,correctRole("company"), logoutCompanyController);
router.get('/profile', isLoggedIn,correctRole("company"), getCompanyProfileController);
router.put('/certifications', uploadCompanyCertificationsController);
router.get('/certifications', isLoggedIn,correctRole("company"), getCompanyCertificationsController);
router.delete('/certifications', isLoggedIn,correctRole("company"), deleteCompanyCertificationsController);

// ==================== Company Updation Routes ====================

router.put('/profile', isLoggedIn,correctRole("company"), updateCompanyProfileController);
router.put('/contact', isLoggedIn,correctRole("company"), updateCompanyPersonController);

// ==================== Company Order Routes ====================

router.get('/suggestions/:orderId', isLoggedIn,correctRole("company"), getTruckSuggestionsController);
router.post('/order/eway/:orderId', isLoggedIn,correctRole("company"), uploadEwayBillController);

// ==================== Company Browse Routes ====================

router.get('/trucks', isLoggedIn,correctRole("company"), getAvailableTrucksController);
router.get('/filter', isLoggedIn,correctRole("company"), filterTrucksController);
router.get('/driver/:truckId', isLoggedIn,correctRole("company"), getDriverByTruckController);

export default router;