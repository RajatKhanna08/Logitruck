import express from 'express';

import {
    
} from '../controllers/transporter.controller.js';

const router = express.Router();

//Transporter profile routes
router.post('/register', registerTransporterController);
router.post('/login', loginTransporterController);
router.delete('/logout', logoutTransporterController);
router.get('/profile', getTransporterProfileController);
router.put('/certifications', uploadTransporterCertificationsController);
router.get('/certifications', getTransportCertificationsController);
router.delete('/certiications', deleteTransportCertficationController);
router.get('/dashboard', getTransporterDashboard);

//Transport Updation routes
router.put('profile', updateTransporterProfileController);
router.put('/contact', updateTransporterPersonController);

// Truck routes
router.post('/truck/add', addTruckController);
router.get('/truck/my', getMyTrucksControoller);
router.get('/truck/:id', getTruckByIdController);
router.put('/truck/:id', updateTruckDetailsController);
router.post('/upload-docs/truckId', uploadTruckDocumentsController);
router.put('/transporter/driver-ref/:truckId', updateDriverReferenceController);
router.put('/activate/:truckId', activeTruckWithDriverController);
router.put('/deactivate/:truckId', deactiveTruckWithDriverController);
router.delete('/truck/:truckId', deleteTruckController);

//driver routes
router.get('/driver/my', getMyDriversController);
router.get('/driver/:driverId', getDriverByIdController);
router.delete('/driver/:driverId', removeDriverController);
router.post('/order/upload-bilty/:orderId', uploadBiltyController);

export default router;