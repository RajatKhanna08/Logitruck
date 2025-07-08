import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { correctRole } from '../middlewares/authorizeRoles.js';

import {
  createReviewController,
  getAllReviewsController,
  getReviewForOrderController,
  deleteReviewController
} from '../controllers/review.controller.js';

const router = express.Router();

// ==================== Company Review Routes ====================
router.post('/create', isLoggedIn, correctRole("company"), createReviewController);
router.get('/:orderId', isLoggedIn, correctRole("company"), getReviewForOrderController);
router.delete('/:orderId', isLoggedIn, correctRole("company"), deleteReviewController);

// ==================== Admin Review Routes ====================
router.get('/all', isLoggedIn, correctRole("admin"), getAllReviewsController);

export default router;
