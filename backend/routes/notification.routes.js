import express from 'express';
import {
    getAllNotificationsController,
    deleteAllNotificationsController
} from '../controllers/notification.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js'; 
const router = express.Router();

// ==================== Notification Routes ====================

router.get('/all', isLoggedIn, getAllNotificationsController);
router.delete('/all', isLoggedIn, deleteAllNotificationsController);

export default router;
