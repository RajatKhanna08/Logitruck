import express from 'express';

const router = express.Router();

router.post('/create', createReviewController);
router.get('/all', getAllReviewsController);
router.get('/:orderId', getReviewForOrderController);
router.delete('/:orderId', deleteReviewController);

export default router;