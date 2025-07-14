import { validationResult } from 'express-validator';
import razorpay from "../lib/razorpay.js";

import adminModel from "../models/adminModel.js";
import companyModel from '../models/companyModel.js';
import transporterModel from '../models/transporterModel.js';
import driverModel from '../models/driverModel.js';
import truckModel from '../models/truckModel.js';
import orderModel from '../models/orderModel.js';
import paymentModel from '../models/paymentModel.js';
import reviewModel from "../models/reviewModel.js";
import biddingModel from '../models/biddingModel.js';

import { sendAdminWelcomeEmail, sendAdminLoginEmail } from "../emails/adminEmail.js";
import { sendWhatsAppRegistration, sendWhatsAppLogin } from "../services/whatsapp.service.js";

export const adminRegisterController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullName, email, password, phone } = req.body;

        const existingAdmin = await adminModel.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await adminModel.hashPassword(password);

        const newAdmin = await adminModel.create({
            fullName,
            email,
            phone,
            password: hashedPassword
        });

        const token = newAdmin.generateAuthToken();

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        const { password: _, ...adminData } = newAdmin._doc;

        console.log(`New admin registered: ${email}`);
        await sendAdminWelcomeEmail(email, fullName);
        await sendWhatsAppRegistration(phone, fullName, "Admin");
        return res.status(201).json({
            message: "Admin registered successfully",
            admin: adminData
        });

    } catch (err) {
        console.error("Error in adminRegisterController:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const adminLoginController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const existingAdmin = await adminModel.findOne({ email });
        if (!existingAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isPasswordCorrect = await existingAdmin.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Incorrect username or password" });
        }

        existingAdmin.lastLogin = Date.now();
        await existingAdmin.save();

        const token = existingAdmin.generateAuthToken();

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        const { password: _, ...adminData } = existingAdmin._doc;

        console.log(`Admin logged in: ${email}`);
        await sendAdminLoginEmail(email, existingAdmin.fullName);
        await sendWhatsAppLogin(existingAdmin.phone, existingAdmin.fullName, "Admin");
        return res.status(200).json({
            message: "Admin logged in",
            admin: adminData,
            lastLogin: new Date(existingAdmin.lastLogin).toISOString()
        });

    } catch (err) {
        console.error("Error in adminLoginController:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const adminLogoutController = (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "User logged out successfully" });
    }
    catch (err) {
        console.log("Error in adminLogoutController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const adminProfileController = async (req, res) => {
    try {
        const adminProfile = await adminModel.findById(req.user._id).select("-password");
        res.status(200).json({ adminProfile });
    }
    catch (err) {
        console.log("Error in adminProfileController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllCompaniesController = async (req, res) => {
    try {
        const companies = await companyModel.find();
        if (!companies.length) {
            return res.status(200).json({ message: "No companies to display" });
        }

        res.status(200).json({ companies, count: companies.length });
    }
    catch (err) {
        console.log("Error in getAllCompaniesController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getCompanyByIdController = async (req, res) => {
    try {
        const { companyId } = req.params;
        const company = await companyModel.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.status(200).json({ company });
    }
    catch (err) {
        console.log("Error in getCompanyByIdController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const toggleCompanyBlockController = async (req, res) => {
    try {
        const { companyId } = req.params;
        const company = await companyModel.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const newBlockStatus = !company.isBlocked;
        const updatedCompany = await companyModel.findByIdAndUpdate(companyId,
            { isBlocked: newBlockStatus }
            , { new: true }).select("-password");
        
        const message = newBlockStatus ? "Company is blocked" : "Company is unblocked";
        res.status(200).json({ message: message, company: updatedCompany });
    }
    catch (err) {
        console.log("Error in toggleCompanyBlockController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteCompanyController = async (req, res) => {
    try {
        const { companyId } = req.params;
        const deletedCompany = await companyModel.findByIdAndDelete(companyId);

        if (!deletedCompany) {
            return res.status(404).json({ message: "Company doesn't exist" });
        }
        res.status(200).json({ message: "Company deleted", deletedCompany: deletedCompany });
    }
    catch (err) {
        console.log("Error in deleteCompanyController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllTransportersController = async (req, res) => {
    try {
        const transporters = await transporterModel.find().select("-password");
        if (!transporters.length) {
            return res.status(200).json({ message: "No transporters to display" });
        }

        res.status(200).json({ transporters, count: transporters.length });
    }
    catch (err) {
        console.log("Error in getAllTransportersController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getTransporterByIdController = async (req, res) => {
    try {
        const { transporterId } = req.params;
    
        const transporter = await transporterModel.findById(transporterId).select("-password");
        if (!transporter) {
            return res.status(404).json({ message: "Transporter not found" });
        }

        res.status(200).json({ transporter });
    }
    catch (err) {
        console.log("Error in getTransporterByIdController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const verifyTransporterController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { transporterId } = req.params;
        const { isVerified } = req.body;
    
        if (typeof isVerified != "boolean") {
            return res.status(400).json({ message: "Invalid isVerified value." });
        }

        const updatedTransporter = await transporterModel.findByIdAndUpdate(transporterId, { isVerified: isVerified }, { new: true }).select("-password");
        if (!updatedTransporter) {
            return res.status(404).json({ message: "Transporter not found" });
        }

        const message = isVerified ? "Transporter approved" : "Transporter rejected"
        res.status(200).json({ message: message, updatedTransporter: updatedTransporter });
    }
    catch (err) {
        console.log("Error in approveTransporterController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const toggleBlockTransporterController = async (req, res) => {
    try {
        const { transporterId } = req.params;

        const transporter = await transporterModel.findById(transporterId);
        if (!transporter) {
            return res.status(404).json({ message: "Transporter not found" });
        }

        const newBlockStatus = !transporter.isBlocked;

        const updatedTransporter = await transporterModel.findByIdAndUpdate(
            transporterId,
            { isBlocked: newBlockStatus },
            { new: true }
        ).select("-password");

        const message = newBlockStatus
            ? "Transporter is blocked"
            : "Transporter is unblocked";

        res.status(200).json({ message, updatedTransporter });
    } catch (err) {
        console.log("Error in toggleBlockTransporterController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllDriversController = async (req, res) => {
    try {
        const drivers = await driverModel.find().select("-password");
        if (!drivers.length) {
            return res.status(200).json({ message: "No drivers to display" });
        }

        res.status(200).json({ drivers });
    }
    catch (err) {
        console.log("Error in getAllDriversController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getDriverByIdController = async (req, res) => {
    try {
        const { driverId } = req.params;

        const driver = await driverModel.findById(driverId);
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        res.status(200).json({ driver });
    }
    catch (err) {
        console.log("Error in getDriverByIdController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const verifyDriverDocumentsController = async (req, res) => {
    try {
        const { driverId } = req.params;
        const driverDocuments = await driverModel.findById(driverId).select("documents");
        if (!driverDocuments) {
            return res.status(404).json({ message: "Driver not found" });
        }

        return res.status(200).json({ driverDocuments: driverDocuments.documents });
    }
    catch (err) {
        console.log("Error in verifyDriverDocumentsController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllTrucksController = async (req, res) => {
    try {
        const trucks = await truckModel.find();
        if (!trucks.length) {
            return res.status(200).json({ message: "No trucks to display" });
        }

        res.status(200).json({ trucks });
    }
    catch (err) {
        console.log("Error in getAllTrucksController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getTruckByIdController = async (req, res) => {
    try {
        const { truckId } = req.params;

        const truck = await truckModel.findById(truckId);
        if (!truck) {
            return res.status(404).json({ message: "No trucks to display" });
        }

        res.status(200).json({ truck });
    }
    catch (err) {
        console.log("Error in getTruckByIdController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const verifyTruckDocumentsController = async (req, res) => {
    try {
        const { truckId } = req.params;

        const truck = await truckModel.findById(truckId).select("documents");
        if (!truck) {
            return res.status(404).json({ message: "Truck not found" });
        }

        res.status(200).json({ truckDocuments: truck.documents });
    }
    catch (err) {
        console.log("Error in verifyTruckDocumentsController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const toggleTruckActivationController = async (req, res) => {
    try {
        const { truckId } = req.params;

        const truck = await truckModel.findById(truckId);
        if (!truck) {
            return res.status(404).json({ message: "Truck not found" });
        }

        const newActivationStatus = !truck.isActivated;
        const updatedTruck = await truckModel.findByIdAndUpdate(truckId, { isActivated: newActivationStatus }, { new: true });

        const message = newActivationStatus ? "Truck is activated" : "Truck is not activated";
        res.status(200).json({ message: message, updatedTruck: updatedTruck });
    }
    catch (err) {
        console.log("Error in toggleTruckActivationController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find();
        if (!orders.length) {
            return res.status(200).json({ message: "No orders to display" });
        }

        res.status(200).json({ orders });
    }
    catch (err) {
        console.log("Error in getAllOrdersController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getOrderByIdController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderModel.findById(orderId)
            .populate("customerId")
            .populate("acceptedTransporterId")
            .populate("acceptedTruckId")
            .populate("acceptedDriverId");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        const payment = await paymentModel.findOne({ orderId: order._id });
        res.status(200).json({ order, payment });
    }
    catch (err) {
        console.log("Error in getOrderByIdController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const cancelOrderController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { orderId } = req.params;
        const updatedOrder = await orderModel.findByIdAndUpdate(orderId, {
            status: "cancelled",
            currentStatus: "cancelled"
        }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        const payment = await paymentModel.findOne({ orderId });
        if (payment && !payment.refundedAt) {
            console.log("Order cancelled but payment not refunded yet.");
        }
        res.status(200).json({ updatedOrder });
    } catch (err) {
        console.log("Error in cancelOrderController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const markOrderDelayedController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { orderId } = req.params;

        const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status: "delayed", currentStatus: "delayed" }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ updatedOrder });
    }
    catch (err) {
        console.log("Error in markOrderDelayedController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const reassignOrderController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { orderId } = req.params;
        const { transporterId, driverId, truckId } = req.body;
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        order.acceptedTransporterId = transporterId;
        order.acceptedDriverId = driverId;
        order.acceptedTruckId = truckId;
        order.currentStatus = "reassigned";
        await order.save();

        res.status(200).json({ message: "Order reassigned successfully", updatedOrder: order });
    } catch (err) {
        console.log("Error in reassignOrderController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllPaymentsController = async (req, res) => {
    try {
        const payments = await paymentModel.find();
        if (!payments.length) {
            return res.status(200).json({ message: "No payments to display" });
        }

        res.status(200).json({ payments });
    }
    catch (err) {
        console.log("Error in getAllPaymentsController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getPaymentByOrderIdController = async (req, res) => {
    try {
        const { orderId } = req.params;

        const payment = await paymentModel.findOne({ orderId: orderId });
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.status(200).json({ payment });
    }
    catch (err) {
        console.log("Error in getPaymentByOrderIdController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const processRefundController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const payment = await paymentModel.findOne({ orderId: orderId });
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        if (payment.refundedAt) {
            return res.status(400).json({ message: "Payment already refunded" });
        }
        const razorpayRefund = await razorpay.payments.refund(payment.paymentGateway.transactionId, {
            amount: payment.amount * 100,
            speed: "optimum",
            notes: {
                reason: "Refund issued by Admin"
            }
        });
        payment.refundedAt = new Date();
        payment.refundStatus = razorpayRefund.status;
        await payment.save();
        const order = await orderModel.findById(orderId);
        if (order) {
            order.status = "refunded";
            order.currentStatus = "refunded";
            order.isRefunded = true; 
            await order.save();
        }

        res.status(200).json({
            message: "Refund processed successfully",
            orderId: payment.orderId,
            transactionId: payment.paymentGateway.transactionId,
            refundedAt: payment.refundedAt,
            status: razorpayRefund.status
        });
    }
    catch (err) {
        console.log("Error in processRefundController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllReviewsController = async (req, res) => {
    try {
        const reviews = await reviewModel.find().populate("reviewerId").populate("reviewedEntityId");
        if (!reviews.length) {
            return res.status(200).json({ message: "No reviews to display" });
        }

        res.status(200).json({ reviews });
    }
    catch (err) {
        console.log("Error in getAllReviewsController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteReviewController = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const deletedReview = await reviewModel.findByIdAndDelete(reviewId);
        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({ message: "Review deleted successfully", deletedReview: deletedReview });
    }
    catch (err) {
        console.log("Error in deleteReviewController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getDashboardStatsController = async (req, res) => {
    try {
        const totalCompanies = await companyModel.countDocuments();
        const totalTransporters = await transporterModel.countDocuments();
        const totalDrivers = await driverModel.countDocuments();
        const totalUsers = totalCompanies + totalTransporters + totalDrivers;

        const totalTrucks = await truckModel.countDocuments();
        const activeTrucks = await truckModel.countDocuments({ isActive: true });
        const idleTrucks = totalTrucks - activeTrucks;

        const totalOrders = await orderModel.countDocuments();
        const pendingOrders = await orderModel.countDocuments({ status: "pending" });
        const activeOrders = await orderModel.countDocuments({ status: "in_transit" });
        const completedOrders = await orderModel.countDocuments({ status: "delivered" });
        const cancelledOrders = await orderModel.countDocuments({ status: "cancelled" });

        const totalPayments = await paymentModel.countDocuments();

        const totalReviews = await reviewModel.countDocuments();
        const avgRatingByRole = await reviewModel.aggregate([
            {
                $group: {
                    _id: "$reviewedEntityType",
                    averageRating: { $avg: "$rating" },
                    total: { $sum: 1 }
                }
            }
        ]);
        const lowRatedCount = await reviewModel.countDocuments({ rating: { $lte: 2 } });

        const activeDrivers = await driverModel.countDocuments({ currentMode: "work_mode" });
        const restingDrivers = await driverModel.countDocuments({ currentMode: "rest_mode" });
        const accidentAlerts = await driverModel.countDocuments({ isStalled: true });

        const openBiddings = await biddingModel.countDocuments({ isClosed: false });
        const closedBiddings = await biddingModel.countDocuments({ isClosed: true });

        res.status(200).json({
            users: {
                totalCompanies,
                totalTransporters,
                totalDrivers,
                totalUsers
            },
            fleet: {
                totalTrucks,
                activeTrucks,
                idleTrucks
            },
            orders: {
                totalOrders,
                activeOrders,
                pendingOrders,
                completedOrders,
                cancelledOrders
            },
            payments: {
                totalPayments
            },
            ratings: {
                totalReviews,
                avgRatingByRole,
                lowRatedCount
            },
            tracking: {
                activeDrivers,
                restingDrivers,
                accidentAlerts
            },
            bids: {
                openBiddings,
                closedBiddings
            }
        })
    }
    catch (err) {
        console.log("Error in getDashboardStatsController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};