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

// Register a new transporter
router.post('/register', registerTransporterController);

// Login transporter
router.post('/login', loginTransporterController);

// Logout transporter
router.delete('/logout', logoutTransporterController);

// Get transporter profile
router.get('/profile', getTransporterProfileController);

// Upload transporter certifications
router.put('/certifications', uploadTransporterCertificationsController);

// Get transporter certifications
router.get('/certifications', getTransportCertificationsController);

// Delete transporter certifications
router.delete('/certifications', deleteTransportCertficationController);

// Get transporter dashboard data
router.get('/dashboard', getTransporterDashboard);

// ==================== Transporter Update Routes ====================

// Update transporter profile
router.put('/profile', updateTransporterProfileController);

// Update transporter contact/person details
router.put('/contact', updateTransporterPersonController);

// ==================== Truck Routes ====================

// Add a new truck
router.post('/truck/add', addTruckController);

// Get all trucks for transporter
router.get('/truck/my', getMyTrucksController);

// Get truck details by truck ID
router.get('/truck/:truckId', getTruckByIdController);

// Update truck details by truck ID
router.put('/truck/:truckId', updateTruckDetailsController);

// Upload documents for a truck
router.post('/upload-docs/:truckId', uploadTruckDocumentsController);

// Update driver reference for a truck
router.put('/transporter/driver-ref/:truckId', updateDriverReferenceController);

// Activate a truck with driver
router.put('/activate/:truckId', activeTruckWithDriverController);

// Deactivate a truck with driver
router.put('/deactivate/:truckId', deactiveTruckWithDriverController);

// Delete a truck by truck ID
router.delete('/truck/:truckId', deleteTruckController);

// ==================== Driver Routes ====================

// Get all drivers for transporter
router.get('/driver/my', getMyDriversController);

// Get driver details by driver ID
router.get('/driver/:driverId', getDriverByIdController);

// Remove a driver by driver ID
router.delete('/driver/:driverId', removeDriverController);

// Upload bilty for an order
router.post('/order/upload-bilty/:orderId', uploadBiltyController);

export default router;