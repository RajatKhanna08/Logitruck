import express from 'express';

import {
    getAllNotificationsController,
    deleteAllNotificationsController
} from '../controllers/notification.controller.js';

const router = express.Router();

// ==================== Notification Routes ====================

router.get('/all', getAllNotificationsController);
router.delete('/all', deleteAllNotificationsController);

export default router;