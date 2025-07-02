import express from 'express';

const router = express.Router();

//company profile routes
router.post('/register', registerCompanyController);
router.post('/login', loginCompanyController);
router.delete('/logout', logoutCompanyController);
router.get('/profile', getCompanyProfileController);
router.put('/certifications', uploadCompanyCertificationsController);
router.get('/certifications', getCompanyCertificationsController);
router.delete('/certifications', deleteCompanyCertificationsController);

//company updation routes
router.put('/profile', updateCompanyProfileController);
router.put('/contact', updateCompanyPersonController);

//company alert routes
router.post('/alert/respond', respondToAlertController);

//company order routes
router.get('/suggestions/:orderId', getTruckSuggestionsController);
router.post('/order/eway/:orderId', uploadEwayBillController);

//company browse routes
router.get('/trucks', getAvailableTrucksController);
router.get('/filter', filterTrucksController);
router.get('/driver/:truckId', getDriverByTruckController);


export default router;