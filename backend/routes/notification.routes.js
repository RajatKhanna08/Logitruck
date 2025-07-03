import express from 'express';
// Import notification controller functions
import {
    getAllNotificationsController,
    deleteAllNotificationsController
} from '../controllers/notification.controller';

const router = express.Router();

// ==================== Notification Routes ====================

// Route to get all notifications for the user
router.get('/all', getAllNotificationsController);

// Route to delete all notifications for the user
router.delete('/all', deleteAllNotificationsController);

export default router;