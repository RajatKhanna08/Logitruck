import express from 'express';
import {
    getFairPriceSuggestionsController, // Controller to get fair price suggestions for an order
    placeBidController,                // Controller to place a new bid
    cancelBidController,               // Controller to cancel a placed bid
    getBidStatusController,            // Controller to get the status of a bid
    updateBidController,               // Controller to update an existing bid
    acceptBidController,               // Controller to accept a bid from a transporter
    rejectBidController                // Controller to reject a bid from a transporter
} from '../controllers/bidding.controller';

const router = express.Router();

// Get fair price suggestions for a specific order
router.get('/price-suggestion/:orderId', getFairPriceSuggestionsController);
// Place a bid for a specific order
router.post('/place/:orderId', placeBidController);
// Cancel a bid for a specific order
router.delete('/cancel/:orderId', cancelBidController);
// Get the status of a bid for a specific order
router.get('/bid/:orderId', getBidStatusController);
// Update a bid for a specific order
router.put('/update/:orderId', updateBidController);
// Accept a bid from a specific transporter
router.put('/accept/:transporterId', acceptBidController);
// Reject a bid from a specific transporter
router.put('/reject/:transporterId', rejectBidController);

export default router;