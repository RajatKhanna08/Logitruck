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
  updateTripStatus,  
  markStopAsReached,
  getORSFullRoute
} from '../controllers/maps.controller.js';

const router = express.Router();

// ==================== Maps Routes ====================

router.post('/update-location', isLoggedIn, correctRole('driver'), updateLocation);
router.get('/track/:orderId',isLoggedIn,correctRole(['driver', 'company', 'transporter', 'admin']), getTrackingData);
router.get('/route/:orderId',isLoggedIn,correctRole(['driver', 'company', 'transporter', 'admin']), getTripRoute);
router.get('/history/:orderId',isLoggedIn,correctRole(['driver', 'company', 'transporter', 'admin']), getOrderRouteHistory);
router.get('/nearby-drivers/:lat/:lng',isLoggedIn,correctRole(['company', 'transporter', 'admin']),getNearbyDrivers);
router.get('/eta/:fromLat/:fromLng/:toLat/:toLng',isLoggedIn,correctRole(['driver', 'company', 'transporter', 'admin']), calculateETA);
router.put('/driver-status/:driverId',isLoggedIn,correctRole(['driver', 'admin']), updateDriverStatus);
router.get('/summary/:driverId', isLoggedIn, correctRole(['driver', 'admin']), getDriverTripSummary);
router.put('/trip-status/:orderId', isLoggedIn, correctRole(['driver', 'admin']), updateTripStatus);
router.put('/reach-stop/:orderId', isLoggedIn, correctRole(['driver', 'admin']), markStopAsReached);
router.post('/full-route', getORSFullRoute);
//isLoggedIn, correctRole(['driver', 'company', 'transporter', 'admin'])

export default router;