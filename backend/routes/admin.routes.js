import express from 'express';

import {
    adminLoginController,
    adminLogoutController,
    adminProfileController,
    approveTransporterController,
    cancelOrderController,
    deleteCompanyController,
    deleteReviewController,
    getActiveUsersController,
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
    getEarningChartController,
    getOrderByIdController,
    getPaymentByOrderIdController,
    getTransporterByIdController,
    getTruckByIdController,
    markOrderDelayedController,
    processRefundController,
    reassignOrderController,
    rejectTransporterController,
    toggleBlockTransporterController,
    toggleCompanyBlockController,
    toggleTruckActivationController,
    verifyDriverDocumentsController,
    verifyTruckDocumentsController,
} from '../controllers/admin.controller.js';

const router = express.Router();

// ==================== Admin Authentication Routes ====================

router.post('/login', adminLoginController);
router.post('/logout', adminLogoutController);
router.get('/profile', adminProfileController);

// ==================== Company Management Routes ====================

router.get('/companies', getAllCompaniesController);
router.get('/company/:id', getCompanyByIdController);
router.put('/company/block/:id', toggleCompanyBlockController);
router.delete('/company/:id', deleteCompanyController);

// ==================== Transporter Management Routes ====================

router.get('/transporters', getAllTransportersController);
router.get('/transporter/:id', getTransporterByIdController);
router.put('/transporter/approve/:id', approveTransporterController);
router.put('/transporter/reject/:id', rejectTransporterController);
router.put('/transporter/block/:id', toggleBlockTransporterController);

// ==================== Driver Management Routes ====================

router.get('/drivers', getAllDriversController);
router.get('/driver/:id', getDriverByIdController);
router.put('/driver/verify-docs/:id', verifyDriverDocumentsController);

// ==================== Truck Management Routes ====================

router.get('/trucks', getAllTrucksController);
router.get('/truck/:id', getTruckByIdController);
router.put('/truck/verify-docs/:id', verifyTruckDocumentsController);
router.put('/truck/activate/:id', toggleTruckActivationController);

// ==================== Order Management Routes ====================

router.get('/orders', getAllOrdersController);
router.get('/order/:id', getOrderByIdController);
router.put('/order/cancel/:id', cancelOrderController);
router.put('/order/dealyed/:id', markOrderDelayedController);
router.put('/order/reassign/:id', reassignOrderController);

// ==================== Payment Management Routes ====================

router.get('/payments', getAllPaymentsController);
router.get('/payment/:id', getPaymentByOrderIdController);
router.post('/payment/refund/:id', processRefundController);

// ==================== Review Management Routes ====================

router.get('/reviews', getAllReviewsController);
router.delete('/review/:id', deleteReviewController);

// ==================== Dashboard & Stats Routes ====================

router.get('/stats', getDashboardStatsController);
router.get('/stats/active-users', getActiveUsersController);
router.get('/stats/earning-chart', getEarningChartController);

export default router;