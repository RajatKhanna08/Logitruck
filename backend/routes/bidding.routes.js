import express from 'express';
import {
    getFairPriceSuggestionsController, // Controller to get fair price suggestions for an order
    placeBidController,                // Controller to place a new bid
    cancelBidController,               // Controller to cancel a placed bid
    getBidStatusController,            // Controller to get the status of a bid
    updateBidController,               // Controller to update an existing bid
    acceptBidController,               // Controller to accept a bid from a transporter
    rejectBidController                // Controller to reject a bid from a transporter
} from '../controllers/bidding.controller.js';

const router = express.Router();

router.get('/price-suggestion/:orderId', getFairPriceSuggestionsController);
router.post('/place/:orderId', placeBidController);
router.delete('/cancel/:orderId', cancelBidController);
router.get('/bid/:orderId', getBidStatusController);
router.put('/update/:orderId', updateBidController);
router.put('/accept/:transporterId', acceptBidController);
router.put('/reject/:transporterId', rejectBidController);

export default router;