import express from 'express';
import { param } from 'express-validator';

import {
    getFairPriceSuggestionsController,
    placeBidController,
    cancelBidController,
    getBidStatusController,
    updateBidController,
    acceptBidController,
    rejectBidController,
    getViewBidsController
} from '../controllers/bidding.controller.js';

import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { correctRole } from '../middlewares/authorizeRoles.js';

const router = express.Router();

// ==================== Validation Utils ====================
const validateMongoId = (field) =>
    param(field).isMongoId().withMessage(`Invalid ${field}`);

// ==================== Bidding Routes ====================

// ✅ FIXED: Changed from GET to POST and role from "company" to "transporter"
router.post('/price-suggestion/:orderId', isLoggedIn, correctRole("transporter"), validateMongoId('orderId'), getFairPriceSuggestionsController);

router.post('/place/:orderId', isLoggedIn, correctRole("transporter"), validateMongoId('orderId'), placeBidController);
router.delete('/cancel/:orderId', isLoggedIn, correctRole("transporter"), validateMongoId('orderId'), cancelBidController);
router.get('/bid/:orderId', isLoggedIn, correctRole("company") || correctRole("transporter"), validateMongoId('orderId'), getBidStatusController);
router.put('/update/:orderId', isLoggedIn, correctRole("transporter"), validateMongoId('orderId'), updateBidController);

// These routes are for the company to manage bids on their order
router.put('/accept/:transporterId/:orderId', isLoggedIn, correctRole("company"), validateMongoId('transporterId'), acceptBidController);
router.put('/reject/:transporterId/:orderId', isLoggedIn, correctRole("company"), validateMongoId('transporterId'), rejectBidController);
// ✅ FIXED: Added route to view bids for a specific transporter
router.get('/my-bids', isLoggedIn, correctRole("transporter"), validateMongoId('transporterId'), getViewBidsController);

export default router;