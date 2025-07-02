import express from 'express';

const router = express.Router();

router.get('/price-suggestion/:orderId', getFairPriceSuggestionsController);
router.post('/place/:orderId', placeBidController);
router.delete('/cancel/:orderId', cancelBidController);
router.get('/bid/:orderId', getBidStatusController);
router.put('/update/:orderId', updateBidController);
router.put('/accept/:transporterId', acceptBidController);
router.put('/reject/:transporterId', rejectBidController);

export default router;