import express from 'express';
import {
    createReviewController,
    getAllReviewsController,
    getReviewForOrderController,
    deleteReviewController
} from '../controllers/review.controller.js';

const router = express.Router();

// ==================== Review Routes ====================

router.post('/create', createReviewController);
router.get('/all', getAllReviewsController);
router.get('/:orderId', getReviewForOrderController);
router.delete('/:orderId', deleteReviewController);

export default router;