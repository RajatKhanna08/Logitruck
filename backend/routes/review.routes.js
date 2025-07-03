import express from 'express';
import {
    createReviewController,
    getAllReviewsController,
    getReviewForOrderController,
    deleteReviewController
} from '../controllers/rating.controller';

const router = express.Router();

// ==================== Review Routes ====================

// Route to create a new review
router.post('/create', createReviewController);

// Route to get all reviews
router.get('/all', getAllReviewsController);

// Route to get a review for a specific order by order ID
router.get('/:orderId', getReviewForOrderController);

// Route to delete a review for a specific order by order ID
router.delete('/:orderId', deleteReviewController);

export default router;