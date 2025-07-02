import express from 'express';
import {
	registerCompanyController,
	loginCompanyController,
	logoutCompanyController,
	getCompanyProfileController,
	uploadCompanyCertificationsController,
	getCompanyCertificationsController,
	deleteCompanyCertificerationsController,
	updateCompanyProfileController,
	updateCompanyPersonController,
	getTruckSuggestionsController,
	uploadEwayBillController,
	getAvailableTrucksController,
	filterTrucksController,
	getDriverByTruckController
} from '../controllers/company.controller.js';

const router = express.Router();

//company profile routes
router.post('/register', registerCompanyController);
router.post('/login', loginCompanyController);
router.delete('/logout', logoutCompanyController);
router.get('/profile', getCompanyProfileController);
router.put('/certifications', uploadCompanyCertificationsController);
router.get('/certifications', getCompanyCertificationsController);
router.delete('/certifications', deleteCompanyCertificerationsController);

//company updation routes
router.put('/profile', updateCompanyProfileController);
router.put('/contact', updateCompanyPersonController);

//company order routes
router.get('/suggestions/:orderId', getTruckSuggestionsController);
router.post('/order/eway/:orderId', uploadEwayBillController);

//company browse routes
router.get('/trucks', getAvailableTrucksController);
router.get('/filter', filterTrucksController);
router.get('/driver/:truckId', getDriverByTruckController);


export default router;