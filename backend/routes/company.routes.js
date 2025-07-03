import express from 'express';
import {
    registerCompanyController,              // Controller for company registration
    loginCompanyController,                 // Controller for company login
    logoutCompanyController,                // Controller for company logout
    getCompanyProfileController,            // Controller to get company profile
    uploadCompanyCertificationsController,  // Controller to upload company certifications
    getCompanyCertificationsController,     // Controller to get company certifications
    deleteCompanyCertificerationsController,// Controller to delete company certifications
    updateCompanyProfileController,         // Controller to update company profile
    updateCompanyPersonController,          // Controller to update company contact person
    getTruckSuggestionsController,          // Controller to get truck suggestions for an order
    uploadEwayBillController,               // Controller to upload e-way bill for an order
    getAvailableTrucksController,           // Controller to get available trucks
    filterTrucksController,                 // Controller to filter trucks
    getDriverByTruckController              // Controller to get driver by truck ID
} from '../controllers/company.controller.js';

const router = express.Router();

// ==================== Company Profile Routes ====================

router.post('/register', registerCompanyController);
router.post('/login', loginCompanyController);
router.delete('/logout', logoutCompanyController);
router.get('/profile', getCompanyProfileController);
router.put('/certifications', uploadCompanyCertificationsController);
router.get('/certifications', getCompanyCertificationsController);
router.delete('/certifications', deleteCompanyCertificerationsController);

// ==================== Company Updation Routes ====================

router.put('/profile', updateCompanyProfileController);
router.put('/contact', updateCompanyPersonController);

// ==================== Company Order Routes ====================

router.get('/suggestions/:orderId', getTruckSuggestionsController);
router.post('/order/eway/:orderId', uploadEwayBillController);

// ==================== Company Browse Routes ====================

router.get('/trucks', getAvailableTrucksController);
router.get('/filter', filterTrucksController);
router.get('/driver/:truckId', getDriverByTruckController);

export default router;