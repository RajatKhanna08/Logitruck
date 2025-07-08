import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { correctRole } from '../middlewares/authorizeRoles.js';
import {
  updateLocation,
  getTrackingData,
  getTripRoute,
  getNearbyDrivers,
  calculateETA,
  updateDriverStatus,
  getDriverTripSummary,
  getOrderRouteHistory,
} from '../controllers/maps.controller.js';

const router = express.Router();

// ==================== Maps Routes ====================
router.post('/update-location', isLoggedIn, correctRole('driver'), updateLocation);
router.get('/track/:orderId', isLoggedIn, getTrackingData);
router.get('/route/:orderId', isLoggedIn, getTripRoute);
router.get('/nearby-drivers/:lat/:lng', isLoggedIn, getNearbyDrivers);
router.get('/eta/:fromLat/:fromLng/:toLat/:toLng', isLoggedIn, calculateETA);
router.put('/driver-status/:driverId', isLoggedIn, correctRole('driver'), updateDriverStatus);
router.get('/summary/:driverId', isLoggedIn, correctRole('driver'), getDriverTripSummary);
router.get('/history/:orderId', isLoggedIn, getOrderRouteHistory);

export default router;
