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

// Register a new company
router.post('/register', registerCompanyController);
// Company login
router.post('/login', loginCompanyController);
// Company logout
router.delete('/logout', logoutCompanyController);
// Get company profile
router.get('/profile', getCompanyProfileController);
// Upload company certifications
router.put('/certifications', uploadCompanyCertificationsController);
// Get company certifications
router.get('/certifications', getCompanyCertificationsController);
// Delete company certifications
router.delete('/certifications', deleteCompanyCertificerationsController);

// ==================== Company Updation Routes ====================

// Update company profile
router.put('/profile', updateCompanyProfileController);
// Update company contact person
router.put('/contact', updateCompanyPersonController);

// ==================== Company Order Routes ====================

// Get truck suggestions for a specific order
router.get('/suggestions/:orderId', getTruckSuggestionsController);
// Upload e-way bill for a specific order
router.post('/order/eway/:orderId', uploadEwayBillController);

// ==================== Company Browse Routes ====================

// Get all available trucks
router.get('/trucks', getAvailableTrucksController);
// Filter trucks based on criteria
router.get('/filter', filterTrucksController);
// Get driver details by truck ID
router.get('/driver/:truckId', getDriverByTruckController);

export default router;