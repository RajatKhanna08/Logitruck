import express from 'express';

import {
    adminLoginController,
    adminLogoutController,
    adminProfileController,
    adminRegisterController,
    cancelOrderController,
    deleteCompanyController,
    deleteReviewController,
    getAllCompaniesController,
    getAllDriversController,
    getAllOrdersController,
    getAllPaymentsController,
    getAllReviewsController,
    getAllTransportersController,
    getAllTrucksController,
    getCompanyByIdController,
    getDashboardStatsController,
    getDriverByIdController,
    getOrderByIdController,
    getPaymentByOrderIdController,
    getTransporterByIdController,
    getTruckByIdController,
    markOrderDelayedController,
    processRefundController,
    reassignOrderController,
    toggleBlockTransporterController,
    toggleCompanyBlockController,
    toggleTruckActivationController,
    verifyDriverDocumentsController,
    verifyTransporterController,
    verifyTruckDocumentsController,
} from '../controllers/admin.controller.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { correctRole } from '../middlewares/authorizeRoles.js';

const router = express.Router();

// ==================== Admin Authentication Routes ====================

router.post('/register', adminRegisterController);
router.post('/login', adminLoginController);
router.post('/logout', isLoggedIn, correctRole("admin"), adminLogoutController);
router.get('/profile', isLoggedIn, correctRole("admin"), adminProfileController);

// ==================== Company Management Routes ====================

router.get('/companies', isLoggedIn, correctRole("admin"), getAllCompaniesController);
router.get('/company/:id', isLoggedIn, correctRole("admin"), getCompanyByIdController);
router.put('/company/block/:id', isLoggedIn, correctRole("admin"), toggleCompanyBlockController);
router.delete('/company/:id', isLoggedIn, correctRole("admin"), deleteCompanyController);

// ==================== Transporter Management Routes ====================

router.get('/transporters', isLoggedIn, correctRole("admin"), getAllTransportersController);
router.get('/transporter/:id', isLoggedIn, correctRole("admin"), getTransporterByIdController);
router.put('/transporter/verify/:id', isLoggedIn, correctRole("admin"), verifyTransporterController);
router.put('/transporter/block/:id', isLoggedIn, correctRole("admin"), toggleBlockTransporterController);

// ==================== Driver Management Routes ====================

router.get('/drivers', isLoggedIn, correctRole("admin"), getAllDriversController);
router.get('/driver/:id', isLoggedIn, correctRole("admin"), getDriverByIdController);
router.put('/driver/verify-docs/:id', isLoggedIn, correctRole("admin"), verifyDriverDocumentsController);

// ==================== Truck Management Routes ====================

router.get('/trucks', isLoggedIn, correctRole("admin"), getAllTrucksController);
router.get('/truck/:id', isLoggedIn, correctRole("admin"), getTruckByIdController);
router.put('/truck/verify-docs/:id', isLoggedIn, correctRole("admin"), verifyTruckDocumentsController);
router.put('/truck/activate/:id', isLoggedIn, correctRole("admin"), toggleTruckActivationController);

// ==================== Order Management Routes ====================

router.get('/orders', isLoggedIn, correctRole("admin"), getAllOrdersController);
router.get('/order/:id', isLoggedIn, correctRole("admin"), getOrderByIdController);
router.put('/order/cancel/:id', isLoggedIn, correctRole("admin"), cancelOrderController);
router.put('/order/dealyed/:id', isLoggedIn, correctRole("admin"), markOrderDelayedController);
router.put('/order/reassign/:id', isLoggedIn, correctRole("admin"), reassignOrderController);

// ==================== Payment Management Routes ====================

router.get('/payments', isLoggedIn, correctRole("admin"), getAllPaymentsController);
router.get('/payment/:id', isLoggedIn, correctRole("admin"), getPaymentByOrderIdController);
router.post('/payment/refund/:id', isLoggedIn, correctRole("admin"), processRefundController);

// ==================== Review Management Routes ====================

router.get('/reviews', isLoggedIn, correctRole("admin"), getAllReviewsController);
router.delete('/review/:id', isLoggedIn, correctRole("admin"), deleteReviewController);

// ==================== Dashboard & Stats Routes ====================

router.get('/stats', isLoggedIn, correctRole("admin"), getDashboardStatsController);

export default router;