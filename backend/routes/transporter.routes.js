import express from 'express';

import {
    registerTransporterController,
    loginTransporterController,
    logoutTransporterController,
    getTransporterProfileController,
    uploadTransporterCertificationsController,
    getTransportCertificationsController,
    deleteTransportCertficationController,
    getTransporterDashboard,
    updateTransporterProfileController,
    updateTransporterPersonController,
    addTruckController,
    getMyTrucksController,
    getTruckByIdController,
    updateTruckDetailsController,
    uploadTruckDocumentsController,
    updateDriverReferenceController,
    activeTruckWithDriverController,
    deactiveTruckWithDriverController,
    deleteTruckController,
    getMyDriversController,
    getDriverByIdController,
    removeDriverController,
    uploadBiltyController
} from '../controllers/transporter.controller.js';

const router = express.Router();

// ==================== Transporter Profile Routes ====================

router.post('/register', registerTransporterController);
router.post('/login', loginTransporterController);
router.delete('/logout', logoutTransporterController);
router.get('/profile', getTransporterProfileController);
router.put('/certifications', uploadTransporterCertificationsController);
router.get('/certifications', getTransportCertificationsController);
router.delete('/certifications', deleteTransportCertficationController);
router.get('/dashboard', getTransporterDashboard);

// ==================== Transporter Update Routes ====================

router.put('/profile', updateTransporterProfileController);
router.put('/contact', updateTransporterPersonController);

// ==================== Truck Routes ====================

router.post('/truck/add', addTruckController);
router.get('/truck/my', getMyTrucksController);
router.get('/truck/:truckId', getTruckByIdController);
router.put('/truck/:truckId', updateTruckDetailsController);
router.post('/upload-docs/:truckId', uploadTruckDocumentsController);
router.put('/transporter/driver-ref/:truckId', updateDriverReferenceController);
router.put('/activate/:truckId', activeTruckWithDriverController);
router.put('/deactivate/:truckId', deactiveTruckWithDriverController);
router.delete('/truck/:truckId', deleteTruckController);

// ==================== Driver Routes ====================

router.get('/driver/my', getMyDriversController);
router.get('/driver/:driverId', getDriverByIdController);
router.delete('/driver/:driverId', removeDriverController);
router.post('/order/upload-bilty/:orderId', uploadBiltyController);

export default router;