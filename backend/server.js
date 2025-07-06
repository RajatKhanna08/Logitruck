import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

import connectToDB from './lib/connectToDB.js'; // Database connection utility

// Import route handlers for different modules
import adminRoutes from './routes/admin.routes.js';
import companyRoutes from './routes/company.routes.js';
import transporterRoutes from './routes/transporter.routes.js';
import driverRoutes from './routes/driver.routes.js';
import mapRoutes from './routes/maps.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import orderRoutes from './routes/order.routes.js';
import biddingRoutes from './routes/bidding.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import reviewRoutes from './routes/review.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes for different resources
app.use('/api/admin', adminRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/transporter', transporterRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/bidding', biddingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/review', reviewRoutes);

// Start the server and connect to the database
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    connectToDB();
});