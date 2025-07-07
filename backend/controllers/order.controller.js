import orderModel from "../models/orderModel.js";
import { validationResult } from 'express-validator';
import reviewModel from "../models/reviewModel.js";

export const createOrderController = async (req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        const { 
            pickupLocation,
            dropLocations,
            scheduledAt,
            isBiddingEnabled,
            biddingExpiresAt,
            loadDetails,
            completedStops,
            distance,
            duration,
            fare,
            paymentMode
        } = req.body;

        if(!Array.isArray(dropLocations) || dropLocations.length === 0){
            return res.status(400).json({ message: "At least one drop location is required" });
        }

        const companyId = req.user?._id;
        if(!companyId){
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const newOrder = await orderModel.create({
            customerId: companyId,
            pickupLocation,
            dropLocations,
            scheduleAt: scheduledAt || null,
            isBiddingEnabled: isBiddingEnabled ? "open" : "closed",
            biddingExpiresAt: biddingExpiresAt || null,
            loadDetails,
            completedStops,
            distance,
            duration,
            fare,
            paymentMode,
            currentStatus: "pending",
            status: "pending"
        });

        res.status(201).json({ message: "Order created successfully", order: newOrder });

        return res.status(201).json({ createdOrder: newOrder });
    }
    catch(err){
        console.log("Error in createOrderController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const uploadEwayBillController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }
        
        const { orderId, ewayBillNumber } = req.params;
        if(!req.file || !req.file.path){
            return res.status(400).json({ message: "E-way bill file is required" });
        }

        const order = await orderModel.findById(orderId);
        if(!order){
            return res.status(404).json({ message: "Order not found" });
        }

        order.eWayBill = {
            fileURL: req.file.path,
            billNumber: ewayBillNumber,
            uploadedBy: req.user?._id,
            uploadedAt: new Date()
        };
        await order.save();

        res.status(200).json({ message: "E-way bill uploaded successfully", eWayBill: order.eWayBill })
    } catch(err) {
        console.log("Error in uploadEwayBillController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const trackOrderController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { orderId } = req.params;

        const order = await orderModel.findById(orderId)
        .select("currentLocation trackingHistory status currentStatus pickupLocation dropLocations");
        if(!order){
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({
            currentLocation: order.currentLocation,
            trackingHistory: order.trackingHistory,
            status: order.status,
            currentStatus: order.currentStatus,
            pickupLocation: order.pickupLocation,
            dropLocations: order.dropLocations
        });
    }
    catch(err){
        console.log("Error in trackOrderController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const rateOrderController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        const { orderId } = req.params;
        const { rating, reviewText, reviewFor } = req.body;
        const reviewerId = req.user?._id;

        if(!["driver", "transporter"].includes(reviewFor)){
            return res.status(400).json({ message: "Invalid review target, must be 'driver' or 'transporter" });
        }
        
        const order = await orderModel.findById(orderId);
        if(!order){
            return res.status(404).json({ message: "Order not found" });
        }

        if(!order.status != "delivered"){
            return res.status(400).json({ message: "Only delivered orders can be rated" });
        }

        const reviewedEntityId = reviewFor === "driver" ? order.acceptedDriverId : order.acceptedTransporterId;
        if(!reviewedEntityId){
            return res.status(400).json({ message: `${reviewFor} not assigned to this order` });
        }

        const existingReview = await reviewModel.findOne({
            orderId,
            reviewerId,
            reviewedEntityId,
            reviewedEntityType: reviewFor
        });

        if(existingReview){
            return res.status(400).json({ message: "You've already rated this entity for this order" });
        }

        const newReview = await reviewModel.create({
            orderId: orderId,
            reviewerId: reviewerId,
            reviewerRole: "company",
            reviewedEntityId: reviewedEntityId,
            reviewedEntityType: reviewFor,
            rating: rating,
            reviewText: reviewText
        });

        res.status(201).json({ message: `Review submitted for ${reviewFor}`, review: newReview });
    }
    catch(err){
        console.log("Error in rateOrderController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getCurrentOrdersController = async (req, res) => {
    try{
        const companyId = req.user?._id;

        const currentOrders = await orderModel.find({
            customerId: companyId,
            status: { $in: ["in_transit", "pending", "delayed"] }
        }).sort({ scheduleAt: -1 })
        .populate("acceptedDriverId acceptedTruckId acceptedTransporterId");

        if(!currentOrders.length){
            return res.status(200).json({ message: "No active orders found", currentOrders: [] });
        }

        res.status(200).json({ currentOrders });
    }
    catch(err){
        console.log("Error in getCurrentOrderController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getOrdersController = async (req, res) => {
    try{
        const companyId = req.user?._id;
        if(!companyId){
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const allOrders = await orderModel.find({ customerId: companyId })
        .sort({ scheduleAt: -1 })
        .populate("acceptedDriverId", "fullName phone")
        .populate("acceptedTruckId", "vehicleNumber truckType")
        .populate("acceptedTransporterId", "fullName phone");

        if(!allOrders.length){
            return res.status(200).json({ message: "No orders found", orders: [] });
        }

        res.status(200).json({ allOrders });
    }
    catch(err){
        console.log("Error in getOrdersController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getCurrentDriverOrderController = async (req, res) => {
    try{
        const driverId = req.user?._id;
        if(!driverId){
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const currentOrder = await orderModel.findOne({
            acceptedDriverId: driverId,
            status: { $in: ["in_transit", "pending", "delayed"] }
        }).sort({ scheduleAt: -1 })
        .populate("customerId", "fullName email phone")
        .populate("acceptedTruckId", "vehicleNumber truckType")
        .populate("acceptedTransporterId", "fullName phone");

        if(!currentOrder){
            return res.status(200).json({ message: "No active order found", currentOrder: null });
        }

        res.status(200).json({ currentOrder });
    }
    catch(err){
        console.log("Error in getCurrentDriverOrderController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getTransporterAllOrdersController = async (req, res) => {
    try{
        const transporterId = req.user?._id;
        if(!transporterId){
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const transporterOrders = await orderModel.find({ acceptedTransporterId: transporterId })
        .sort({ scheduleAt: -1 })
        .populate("customerId", "fullName email phone")
        .populate("acceptedDriverId", "fullName phone currentMode")
        .populate("acceptedTruckId", "vehicleNumber truckType");

        if(!transporterOrders.length){
            return res.status(200).json({ message: "No orders found", transporterOrders: [] });
        }

        res.status(200).json({ transporterOrders });
    }
    catch(err){
        console.log("Error in getTransporterAllOrdersController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getTransporterOrderStatusController = async (req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        const transporterId = req.user?._id;
        const { orderId } = req.params;

        if(!transporterId){
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const order = await orderModel.findOne({ _id: orderId, acceptedTransporterId: transporterId })
        .populate("acceptedDriverId", "fullName phone currentMode")
        .populate("acceptedTruckId", "vehicleNumber truckType")
        .populate("customerId", "fullName email phone");

        if(!order){
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({
            orderId: order._id,
            status: order.status,
            currentStatus: order.currentStatus,
            deliveryTimeline: order.deliveryTimeline,
            isStalledAt: order.isStalledAt,
            isDelayed: order.isDelayed,
            currentLocation: order.currentLocation,
            driverDetails: order.acceptedDriverId,
            truckDetails: order.acceptedTruckId,
            customerDetails: order.customerId
        });
    }
    catch(err){
        console.log("Error in getTransporterOrderStatusController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getTransporterActiveOrdersController = async (req, res) => {
    try{
        const transporterId = req.user?._id;
        if(!transporterId){
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const activeOrders = await orderModel.find({
            acceptedTransporterId: transporterId,
            status: { $in: ["pending", "in_transit", "delayed"] }
        }).sort({ scheduleAt: -1 })
        .populate("customerId", "fullName email phone")
        .populate("acceptedDriverId", "fullName phone")
        .populate("acceptedTruckId", "vehicleNumber truckType");

        if(!activeOrders.length){
            return res.status(200).json({ message: "No active orders found", activeOrders: [] });
        }

        res.status(200).json({ activeOrders });
    }
    catch(err){
        console.log("Error in getTransporterActiveOrdersController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getDriverHistoryController = async (req, res) => {
    try{
        const driverId = req.user?._id;
        if(!driverId){
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const completedOrders = await orderModel.find({
            acceptedDriverId: driverId,
            status: "delivered"
        }).sort({ scheduleAt: -1 })
        .populate("customerId", "fullName email phone")
        .populate("acceptedTruckId", "vehicleNumber truckType")
        .populate("acceptedTransporterId", "fullName phone");

        if(!completedOrders.length){
            return res.status(200).json({ message: "No completed orders found", completedOrders: [] });
        }

        res.status(200).json({ completedOrders });
    }
    catch(err){
        console.log("Error in getDriverHistoryController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateOrderStatusController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const driverId = req.user?._id;
        const { orderId } = req.params;
        const { status } = req.body;

        if(!driverId){
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const order = await orderModel.findOne({ _id: orderId, acceptedDriverId: driverId });
        if(!order){
            return res.status(404).json({ message: "No order found" });
        }

        let newStatus = order.status;
        let currentStatus = order.currentStatus;
        let deliveryTimeline = { ...order.deliveryTimeline };

        const now = new Date();

        switch(status){
            case "arrived":
                newStatus = "pending";
                currentStatus = "in-progress";
                deliveryTimeline.startedAt = deliveryTimeline.startedAt || now;
                deliveryTimeline.lastknownProgress = "in-progress";
                break;

            case "loaded":
                newStatus = "in_transit";
                currentStatus = "in-progress";
                deliveryTimeline.lastknownProgress = "in-progress";
                break;

            case "reached":
                newStatus = "in_transit";
                currentStatus = "in-progress";
                break;

            case "unloaded":
                newStatus = "delivered";
                currentStatus = "delivered";
                deliveryTimeline.completedAt = now;
                deliveryTimeline.lastknownProgress = "delivered";
                break;

            default:
                return res.status(400).json({ message: "Invalid status update" });
        }

        order.status = newStatus;
        order.currentStatus = currentStatus;
        order.deliveryTimeline = deliveryTimeline;

        await order.save();
        res.status(200).json({ message: "Order status updated successfully", updatedOrder: order });
    }
    catch(err){
        console.log("Error in updateOrderStatusController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const cancelOrderController = async (req, res) => {
    try{
        const companyId = req.user?._id;
        const { orderId } = req.params;

        if(!companyId){
            return res.status(404).json({ message: "Unauthorized access" });
        }

        const order = await orderModel.findOne({ _id: orderId, customerId: companyId });
        if(!order){
            return res.status(404).json({ message: "Order not found" });
        }

        if(["delivered", "cancelled"].includes(order.status)){
            return res.status(400).json({ message: `Cannot cancel the order that is already ${order.status}` });
        }

        order.status = "cancelled";
        order.currentStatus = "cancelled";
        await order.save();

        res.status(200).json({ message: "Order cancelled successfully", cancelledOrder: order });
    }
    catch(err){
        console.log("Error in cancelOrderController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}