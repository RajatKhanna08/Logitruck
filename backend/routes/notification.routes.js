import express from 'express';

const router = express.Router();

router.get('/all', getAllNotificationsController);
router.delete('/all', deleteAllNotificationsController);

export default router;