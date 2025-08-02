import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import http, { METHODS } from 'http';
import { Server } from 'socket.io';

dotenv.config(); // Load environment variables
import connectToDB from './lib/connectToDB.js';

// Routes
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
import uploadRoutes from "./routes/upload.routes.js";

const app = express();
const server = http.createServer(app); // Required for Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // You can restrict this later
    METHODS: ["GET", "POST", "PUT", "DELETE"],
  }
});

// Middleware to inject io into every request (allows req.io.emit)
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware for parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

// All Routes
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
app.use("/upload", uploadRoutes);

// Socket.IO connection listener
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  connectToDB();
});
