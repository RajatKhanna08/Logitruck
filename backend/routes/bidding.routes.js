import express from 'express';
import { param } from 'express-validator';

import {
    getFairPriceSuggestionsController,
    placeBidController,
    cancelBidController,
    getBidStatusController,
    updateBidController,
    acceptBidController,
    rejectBidController
} from '../controllers/bidding.controller.js';

import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { correctRole } from '../middlewares/authorizeRoles.js';

const router = express.Router();

// ==================== Validation Utils ====================
const validateMongoId = (field) =>
    param(field).isMongoId().withMessage(`Invalid ${field}`);

// ==================== Company Bidding Routes ====================

router.get('/price-suggestion/:orderId',isLoggedIn,correctRole("company"),validateMongoId('orderId'),getFairPriceSuggestionsController);
router.post('/place/:orderId',isLoggedIn,correctRole("transporter"),validateMongoId('orderId'),placeBidController);
router.delete('/cancel/:orderId',isLoggedIn,correctRole("transporter"),validateMongoId('orderId'),cancelBidController);
router.get('/bid/:orderId',isLoggedIn,correctRole("transporter"),validateMongoId('orderId'),getBidStatusController);
router.put('/update/:orderId',isLoggedIn,correctRole("transporter"),validateMongoId('orderId'),updateBidController);
router.put('/accept/:transporterId',isLoggedIn,correctRole("company"),validateMongoId('transporterId'),acceptBidController);
router.put('/reject/:transporterId',isLoggedIn,correctRole("company"),validateMongoId('transporterId'),rejectBidController);

export default router;
