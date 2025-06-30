import express from 'express';

import {
    userLoginController,
    userLogoutController,
    userProfileController,
    userSignupController
} from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/signup', userSignupController);

router.post('/login', userLoginController);

router.post('/logout', userLogoutController);

router.get('/profile', userProfileController);

export default router;