import express from 'express';

import {
    adminLoginController,
    adminLogoutController,
    adminProfileController,
    adminSignupController
} from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/signup', adminSignupController);

router.post('/login', adminLoginController);

router.post('/logout', adminLogoutController);

router.get('/profile', adminProfileController);

export default router;