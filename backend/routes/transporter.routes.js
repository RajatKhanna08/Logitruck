import express from 'express';

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
import { correctRole } from '../middlewares/authorizeRoles.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = express.Router();

// ==================== Transporter Profile Routes ====================

router.post('/register', registerTransporterController);
router.post('/login', loginTransporterController);
router.delete('/logout', isLoggedIn, correctRole("transporter"), logoutTransporterController);
router.get('/profile', isLoggedIn, correctRole("transporter"), getTransporterProfileController);
router.put('/certifications', isLoggedIn, correctRole("transporter"), uploadTransporterCertificationsController);
router.get('/certifications', isLoggedIn, correctRole("transporter"), getTransporterCertificationsController);
router.delete('/certifications', isLoggedIn, correctRole("transporter"), deleteTransporterCertificationsController);
router.get('/dashboard', isLoggedIn, correctRole("transporter"), getTransporterDashboardController);

// ==================== Transporter Update Routes ====================

router.put('/profile', isLoggedIn, correctRole("transporter"), updateTransporterProfileController);
router.put('/contact', isLoggedIn, correctRole("transporter"), updateTransporterPersonController);

// ==================== Truck Routes ====================

router.post('/truck/add', isLoggedIn, correctRole("transporter"), addTruckController);
router.get('/truck/my', isLoggedIn, correctRole("transporter"), getMyTrucksController);
router.get('/truck/:truckId', isLoggedIn, correctRole("transporter"), getTruckByIdController);
router.put('/truck/:truckId', isLoggedIn, correctRole("transporter"), updateTruckDetailsController);
router.post('/upload-docs/:truckId', isLoggedIn, correctRole("transporter"), uploadTruckDocumentsController);
router.put('/transporter/driver-ref/:truckId', isLoggedIn, correctRole("transporter"), updateDriverReferenceController);
router.put('/activate/:truckId', isLoggedIn, correctRole("transporter"), activateTruckWithDriverController);
router.put('/deactivate/:truckId', isLoggedIn, correctRole("transporter"), deactivateTruckWithDriverController);
router.delete('/truck/:truckId', isLoggedIn, correctRole("transporter"), deleteTruckController);

// ==================== Driver Routes ====================

router.get('/driver/my', isLoggedIn, correctRole("transporter"), getMyDriversController);
router.get('/driver/:driverId', isLoggedIn, correctRole("transporter"), getDriverByIdController);
router.delete('/driver/:driverId', isLoggedIn, correctRole("transporter"), removeDriverController);
router.post('/order/upload-bilty/:orderId', isLoggedIn, correctRole("transporter"), uploadBiltyController);

export default router;