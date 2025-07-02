import express from 'express';

import {
    adminLoginController,
    adminLogoutController,
    adminProfileController,
} from '../controllers/admin.controller.js';

const router = express.Router();

//admin auth routes
router.post('/login', adminLoginController);
router.post('/logout', adminLogoutController);
router.get('/profile', adminProfileController);

//admin companies routes
router.get('/companies', getAllCompaniesController);
router.get('/company/:id', getCompanyByIdController);
router.put('/company/block/:id', toggleCompanyBlockController);
router.delete('/company/:id', deleteCompanyController);

//admin transporters routes
router.get('/transporters', getAllTransportersController);
router.get('/transporter/:id', getTransporterByIdController);
router.put('/transporter/approve/:id', approveTransporterController);
router.put('/transporter/reject/:id', rejectTransporterController);
router.put('/transporter/block/:id', toggleBlockTransporterController);

//admin driver routes
router.get('/drivers', getAllDriversController);
router.get('/driver/:id', getDriverByIdController);
router.put('/driver/verify-docs/:id', verifyDriverDocumentsController);

//admin truck routes
router.get('/trucks', getAllTrucksController);
router.get('/truck/:id', getTruckByIdController);
router.put('/truck/verify-docs/:id', verifyTruckDocumentsController);
router.put('/truck/activate/:id', toggleTruckActivationController);

//admin order routes
router.get('/orders', getAllOrdersController);
router.get('/order/:id', getOrderByIdController);
router.put('/order/cancel/:id', cancelOrderController);
router.put('/order/dealyed/:id', markOrderDelayedController);
router.put('/order/reassign/:id', reassignOrderController);

//admin payment routes
router.get('/payments', getAllPaymentsController);
router.get('/payment/:id', getPaymentByOrderIdController);
router.post('/payment/refund/:id', processRefundController);

//admin reviews controller
router.get('/reviews', getAllReviewsController);
router.delete('/review/:id', deleteReviewController);

//admin dashboard routes
router.get('/stats', getDashboardStatsController);
router.get('/stats/active-users', getActiveUsersController);
router.get('/stats/earning-chart', getEarningChartController);

export default router;