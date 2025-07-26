  import express from 'express';
  import {
    getAllNotificationsController,
    deleteAllNotificationsController,
    sendNotificationController
  } from '../controllers/notification.controller.js';
  import { body } from 'express-validator';
  import { isLoggedIn } from '../middlewares/isLoggedIn.js';

  const router = express.Router();
  const sendNotificationValidator = [
    body('role').notEmpty().withMessage('Role is required'),
    body('relatedUserId').notEmpty().withMessage('Related user ID is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('message').notEmpty().withMessage('Message is required'),
  ];

  // ==================== Notification Routes ====================

  router.get('/all', isLoggedIn, getAllNotificationsController);
  router.delete('/all', isLoggedIn, deleteAllNotificationsController);
  router.post('/send', isLoggedIn, sendNotificationValidator, sendNotificationController);

  export default router;
