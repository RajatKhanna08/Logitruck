import express from 'express';

import {
    adminLoginController,
    adminLogoutController,
    adminProfileController,
} from '../controllers/admin.controller.js';

const router = express.Router();

// ==================== Admin Authentication Routes ====================

// Admin login
router.post('/login', adminLoginController);
// Admin logout
router.post('/logout', adminLogoutController);
// Get admin profile
router.get('/profile', adminProfileController);

// ==================== Company Management Routes ====================

// Get all companies
router.get('/companies', getAllCompaniesController);
// Get a specific company by ID
router.get('/company/:id', getCompanyByIdController);
// Block or unblock a company
router.put('/company/block/:id', toggleCompanyBlockController);
// Delete a company
router.delete('/company/:id', deleteCompanyController);

// ==================== Transporter Management Routes ====================

// Get all transporters
router.get('/transporters', getAllTransportersController);
// Get a specific transporter by ID
router.get('/transporter/:id', getTransporterByIdController);
// Approve a transporter
router.put('/transporter/approve/:id', approveTransporterController);
// Reject a transporter
router.put('/transporter/reject/:id', rejectTransporterController);
// Block or unblock a transporter
router.put('/transporter/block/:id', toggleBlockTransporterController);

// ==================== Driver Management Routes ====================

// Get all drivers
router.get('/drivers', getAllDriversController);
// Get a specific driver by ID
router.get('/driver/:id', getDriverByIdController);
// Verify driver documents
router.put('/driver/verify-docs/:id', verifyDriverDocumentsController);

// ==================== Truck Management Routes ====================

// Get all trucks
router.get('/trucks', getAllTrucksController);
// Get a specific truck by ID
router.get('/truck/:id', getTruckByIdController);
// Verify truck documents
router.put('/truck/verify-docs/:id', verifyTruckDocumentsController);
// Activate or deactivate a truck
router.put('/truck/activate/:id', toggleTruckActivationController);

// ==================== Order Management Routes ====================

// Get all orders
router.get('/orders', getAllOrdersController);
// Get a specific order by ID
router.get('/order/:id', getOrderByIdController);
// Cancel an order
router.put('/order/cancel/:id', cancelOrderController);
// Mark an order as delayed
router.put('/order/dealyed/:id', markOrderDelayedController);
// Reassign an order
router.put('/order/reassign/:id', reassignOrderController);

// ==================== Payment Management Routes ====================

// Get all payments
router.get('/payments', getAllPaymentsController);
// Get payment details by order ID
router.get('/payment/:id', getPaymentByOrderIdController);
// Process a refund for a payment
router.post('/payment/refund/:id', processRefundController);

// ==================== Review Management Routes ====================

// Get all reviews
router.get('/reviews', getAllReviewsController);
// Delete a review
router.delete('/review/:id', deleteReviewController);

// ==================== Dashboard & Stats Routes ====================

// Get dashboard statistics
router.get('/stats', getDashboardStatsController);
// Get active users statistics
router.get('/stats/active-users', getActiveUsersController);
// Get earning chart data
router.get('/stats/earning-chart', getEarningChartController);

export default router;