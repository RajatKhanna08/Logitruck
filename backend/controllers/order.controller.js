import orderModel from "../models/orderModel.js";
import reviewModel from "../models/reviewModel.js";
import transporterModel from "../models/transporterModel.js";

import { validationResult } from 'express-validator';
import { getORSRoute } from "../utils/getORSRoute.js";
import { sendNotification } from "../utils/sendNotification.js";

export const createOrderController = async (req, res) => {
  try {
    console.log("➡️ Incoming Order Create Request");
    console.log("👉 Body:", req.body);
    console.log("👉 User:", req.user);
    
    if (req.body.isBiddingEnabled === false || req.body.isBiddingEnabled === 'false') {
      delete req.body.biddingExpiresAt;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Validation Errors:", errors.array());
      return res.status(400).json({ message: errors.array() });
    }

    const {
      pickupLocation,
      dropLocations,
      scheduleAt,
      isBiddingEnabled,
      biddingExpiresAt,
      loadDetails,
      completedStops,
      paymentMode,
      urgency,
      bodyTypeMultiplier,
      sizeCategoryMultiplier,
      isMultiStop,
      fare
    } = req.body;

    if (!Array.isArray(dropLocations) || dropLocations.length === 0) {
      console.log("❌ Drop locations missing or invalid");
      return res.status(400).json({ message: "At least one drop location is required" });
    }

    const companyId = req.user?._id;
    if (!companyId) {
      console.log("❌ Company ID not found (unauthorized)");
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const pickupCoords = pickupLocation.coordinates?.coordinates;
    const dropCoordsList = dropLocations.map(loc => loc.coordinates?.coordinates);

    console.log("Pickup Coordinates (raw):", pickupCoords);
    console.log("Drop Coordinates List (raw):", dropCoordsList);

    if (
      !Array.isArray(pickupCoords) || pickupCoords.length !== 2 ||
      dropCoordsList.some(coord => !Array.isArray(coord) || coord.length !== 2)
    ) {
      console.log("❌ Coordinates malformed");
      return res.status(400).json({ message: "Invalid coordinates format. Expected [lng, lat]" });
    }

    const orsCoordinates = [pickupCoords, ...dropCoordsList];
    const start = orsCoordinates[0];
    const end = orsCoordinates[1];
    const waypoints = orsCoordinates.slice(2);

    const routeData = await getORSRoute(start, end, waypoints);
    console.log("📍 ORS Route Data:", routeData);

    const currentLocation = {
      type: "Point",
      coordinates: pickupCoords
    };

    const newOrder = await orderModel.create({
      customerId: companyId,
      pickupLocation,
      dropLocations,
      scheduleAt: scheduleAt || null,
      isBiddingEnabled: isBiddingEnabled ?? true,
      biddingExpiresAt: biddingExpiresAt || null,
      loadDetails,
      completedStops,
      paymentMode,
      urgency: urgency || "low",
      bodyTypeMultiplier: bodyTypeMultiplier || 1,
      sizeCategoryMultiplier: sizeCategoryMultiplier || 1,
      isMultiStop: isMultiStop ?? dropLocations.length > 1,
      currentLocation,
      distance: parseFloat(routeData.distanceInKm),
      duration: parseFloat(routeData.durationInMin),
      fare: fare,
      currentStatus: "pending",
      status: "pending",
      tripStatus: "Heading to Pickup",
      routeInfo: {
        polyline: routeData.polyline,
        estimatedDistance: routeData.distanceInKm,
        estimatedDuration: routeData.durationInMin,
      }
    });

    console.log("✅ Order created in DB:", newOrder._id);

    await sendNotification({
      role: "company",
      relatedUserId: companyId,
      relatedBookingId: newOrder._id,
      title: "New Order Created",
      message: `Order ID ${newOrder._id} has been created successfully.`,
      type: "order",
      metadata: { orderId: newOrder._id }
    });

    const transporters = await transporterModel.find({}, '_id');
    for (const transporter of transporters) {
      await sendNotification({
        role: "transporter",
        relatedUserId: transporter._id,
        relatedBookingId: newOrder._id,
        title: "New Order Available",
        message: "A new order is available for bidding.",
        type: "order",
        metadata: {
          urgency,
          orderId: newOrder._id,
        },
      });
    }

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  }catch (err) {
    console.error("❌ Error in createOrderController:", err.message);
    console.error("🧨 Full error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const uploadEwayBillController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { orderId, ewayBillNumber } = req.params;
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "E-way bill file is required" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order with e-way bill
    order.eWayBill = {
      fileURL: req.file.path,
      billNumber: ewayBillNumber,
      uploadedBy: req.user?._id,
      uploadedAt: new Date(),
    };
    await order.save();

    // COMPANY Notification
    await sendNotification({
      role: "company",
      relatedUserId: order.customerId,
      relatedBookingId: order._id,
      title: "E-Way Bill Uploaded",
      message: `E-Way Bill ${ewayBillNumber} has been uploaded for Order ${order._id}.`,
      type: "ewaybill",
      deliveryMode: "pending",
      metadata: {
        task: "Review E-Way Bill",
        orderId: order._id,
        ewayBillNumber,
      },
    });

    // TRANSPORTER Notification
    if (order.assignedTransporter) {
      await sendNotification({
        relatedUserId: order.assignedTransporter,
        relatedBookingId: order._id,
        title: "E-Way Bill Uploaded",
        message: `E-Way Bill ${ewayBillNumber} is now available for Order ${order._id}.`,
        type: "ewaybill",
        deliveryMode: "pending",
        metadata: {
          task: "Verify E-Way Bill Document",
          orderId: order._id,
          ewayBillNumber,
        },
        role: "transporter"
      });
    }

    // DRIVER Notification
    if (order.assignedDriver) {
      await sendNotification({
        relatedUserId: order.assignedDriver,
        relatedBookingId: order._id,
        title: "E-Way Bill Uploaded",
        message: `Check the E-Way Bill ${ewayBillNumber} for Order ${order._id}.`,
        type: "ewaybill",
        deliveryMode: "pending",
        metadata: {
          task: "Carry Valid E-Way Bill During Transit",
          orderId: order._id,
          ewayBillNumber,
        },
        role: "driver"
      });
    }

    res.status(200).json({
      message: "E-way bill uploaded successfully",
      eWayBill: order.eWayBill,
    });
  } catch (err) {
    console.log("Error in uploadEwayBillController: ", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const trackOrderController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { orderId } = req.params;

        const order = await orderModel.findById(orderId)
            .select("currentLocation trackingHistory status currentStatus pickupLocation dropLocations");
        if (!order) {
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
    catch (err) {
        console.log("Error in trackOrderController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const rateOrderController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { orderId } = req.params;
        const { rating, reviewText, reviewFor } = req.body;
        const reviewerId = req.user?._id;

        if (!["driver", "transporter"].includes(reviewFor)) {
            return res.status(400).json({ message: "Invalid review target, must be 'driver' or 'transporter'" });
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status !== "delivered") {
            return res.status(400).json({ message: "Only delivered orders can be rated" });
        }

        const reviewedEntityId = reviewFor === "driver" ? order.acceptedDriverId : order.acceptedTransporterId;
        if (!reviewedEntityId) {
            return res.status(400).json({ message: `${reviewFor} not assigned to this order` });
        }

        const existingReview = await reviewModel.findOne({
            orderId,
            reviewerId,
            reviewedEntityId,
            reviewedEntityType: reviewFor
        });

        if (existingReview) {
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

        await sendNotification({
            role: reviewFor,
            relatedUserId: reviewedEntityId,
            relatedBookingId: orderId,
            title: "New Review Received",
            message: `You have received a ${rating}-star review from the company.`,
            type: "review",
            deliveryMode: "unread",
            metadata: {
                reviewText,
                rating
            }
        });

        res.status(201).json({ message: `Review submitted for ${reviewFor}`, review: newReview });

    } catch (err) {
        console.log("Error in rateOrderController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getCurrentOrdersController = async (req, res) => {
    try {
        const companyId = req.user?._id;

        const currentOrders = await orderModel.find({
            customerId: companyId,
            status: { $in: ["in_transit", "pending", "delayed"] }
        }).sort({ scheduleAt: -1 })
            .populate("acceptedDriverId acceptedTruckId acceptedTransporterId");

        if (!currentOrders.length) {
            return res.status(200).json({ message: "No active orders found", currentOrders: [] });
        }

        res.status(200).json({ currentOrders });
    }
    catch (err) {
        console.log("Error in getCurrentOrderController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getOrdersController = async (req, res) => {
    try {
        const companyId = req.user?._id;
        if (!companyId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const allOrders = await orderModel.find({ customerId: companyId })
            .sort({ scheduleAt: -1 })
            .populate("acceptedDriverId", "fullName email phone")
            .populate("acceptedTruckId", "vehicleNumber truckType")
            .populate("acceptedTransporterId", "fullName email phone");

        if (!allOrders.length) {
            return res.status(200).json({ message: "No orders found", allOrders: [] });
        }

        res.status(200).json({ allOrders });
    }
    catch (err) {
        console.log("Error in getOrdersController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getCurrentDriverOrderController = async (req, res) => {
    try {
        const driverId = req.user?._id;
        if (!driverId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const currentOrder = await orderModel.findOne({
            acceptedDriverId: driverId,
            status: { $in: ["in_transit", "pending", "delayed"] }
        }).sort({ scheduleAt: -1 })
            .populate("customerId", "fullName email phone")
            .populate("acceptedTruckId", "vehicleNumber truckType")
            .populate("acceptedTransporterId", "fullName phone");

        if (!currentOrder) {
            return res.status(200).json({ message: "No active order found", currentOrder: null });
        }

        res.status(200).json({ currentOrder });
    }
    catch (err) {
        console.log("Error in getCurrentDriverOrderController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getTransporterAllOrdersController = async (req, res) => {
    try {
        const transporterId = req.user?._id;
        if (!transporterId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const transporterOrders = await orderModel.find({ acceptedTransporterId: transporterId })
            .sort({ scheduleAt: -1 })
            .populate("customerId", "fullName email phone")
            .populate("acceptedDriverId", "fullName phone currentMode")
            .populate("acceptedTruckId", "vehicleNumber truckType");

        if (!transporterOrders.length) {
            return res.status(200).json({ message: "No orders found", transporterOrders: [] });
        }

        res.status(200).json({ transporterOrders });
    }
    catch (err) {
        console.log("Error in getTransporterAllOrdersController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getTransporterOrderStatusController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        const transporterId = req.user?._id;
        const { orderId } = req.params;

        if (!transporterId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const order = await orderModel.findOne({ _id: orderId, acceptedTransporterId: transporterId })
            .populate("acceptedDriverId", "fullName phone currentMode")
            .populate("acceptedTruckId", "vehicleNumber truckType")
            .populate("customerId", "fullName email phone");

        if (!order) {
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
    catch (err) {
        console.log("Error in getTransporterOrderStatusController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getTransporterActiveOrdersController = async (req, res) => {
    try {
        const transporterId = req.user?._id;
        if (!transporterId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const activeOrders = await orderModel.find({
            acceptedTransporterId: transporterId,
            status: { $in: ["pending", "in_transit", "delayed"] }
        }).sort({ scheduleAt: -1 })
            .populate("customerId", "fullName email phone")
            .populate("acceptedDriverId", "fullName phone")
            .populate("acceptedTruckId", "vehicleNumber truckType");

        if (!activeOrders.length) {
            return res.status(200).json({ message: "No active orders found", activeOrders: [] });
        }

        res.status(200).json({ activeOrders });
    }
    catch (err) {
        console.log("Error in getTransporterActiveOrdersController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getDriverHistoryController = async (req, res) => {
    try {
        const driverId = req.user?._id;
        if (!driverId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const completedOrders = await orderModel.find({
            acceptedDriverId: driverId,
            status: "delivered"
        }).sort({ scheduleAt: -1 })
            .populate("customerId", "fullName email phone")
            .populate("acceptedTruckId", "vehicleNumber truckType")
            .populate("acceptedTransporterId", "fullName phone");

        if (!completedOrders.length) {
            return res.status(200).json({ message: "No completed orders found", completedOrders: [] });
        }

        res.status(200).json({ completedOrders });
    }
    catch (err) {
        console.log("Error in getDriverHistoryController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateOrderStatusController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const driverId = req.user?._id;
    const { orderId } = req.params;
    const { status } = req.body;

    if (!driverId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const order = await orderModel.findOne({ _id: orderId, acceptedDriverId: driverId });
    if (!order) {
      return res.status(404).json({ message: "No order found" });
    }

    let newStatus = order.status;
    let currentStatus = order.currentStatus;
    let tripStatus = order.tripStatus;
    let deliveryTimeline = { ...order.deliveryTimeline };
    const now = new Date();

    let notificationType = "";
    let notificationTitle = "";
    let notificationMessage = "";

    switch (status) {
      case "arrived":
        if (order.status !== "pending") {
          return res.status(400).json({ message: "Invalid status transition" });
        }
        tripStatus = "Arrived at Pickup";
        currentStatus = "in-progress";
        deliveryTimeline.startedAt = deliveryTimeline.startedAt || now;
        deliveryTimeline.lastknownProgress = "in-progress";

        notificationType = "arrived";
        notificationTitle = "Truck Arrived at Pickup";
        notificationMessage = `Your assigned truck has arrived at the pickup location for Order ${orderId}.`;
        break;

      case "loaded":
        if (order.tripStatus !== "Arrived at Pickup") {
          return res.status(400).json({ message: "Cannot load before arriving at pickup" });
        }
        newStatus = "in_transit";
        tripStatus = "In Transit";
        currentStatus = "in-progress";
        deliveryTimeline.lastknownProgress = "in-progress";

        notificationType = "loaded";
        notificationTitle = "Goods Loaded";
        notificationMessage = `The truck has been loaded for Order ${orderId}.`;
        break;

      case "reached":
        tripStatus = "At Stop";

        notificationType = "reached";
        notificationTitle = "Reached Stop";
        notificationMessage = `Truck has reached an intermediate stop for Order ${orderId}.`;
        break;

      case "unloaded":
        newStatus = "delivered";
        currentStatus = "delivered";
        tripStatus = "Delivered";
        deliveryTimeline.completedAt = now;
        deliveryTimeline.lastknownProgress = "delivered";

        notificationType = "unloaded";
        notificationTitle = "Order Delivered";
        notificationMessage = `Order ${orderId} has been delivered successfully.`;
        break;

      default:
        return res.status(400).json({ message: "Invalid status update" });
    }

    order.status = newStatus;
    order.currentStatus = currentStatus;
    order.tripStatus = tripStatus;
    order.deliveryTimeline = deliveryTimeline;

    await order.save();

    // Send Notifications to company and transporter
    const notificationPayload = {
      type: notificationType,
      title: notificationTitle,
      message: notificationMessage,
      relatedBookingId: orderId,
      deliveryMode: currentStatus,
      metadata: { driverId }
    };

    // Notify Company
    await sendNotification({
      ...notificationPayload,
      role: "company",
      relatedUserId: order.customerId,
    });

    // Notify Transporter
    if (order.acceptedTransporterId) {
      await sendNotification({
        ...notificationPayload,
        role: "transporter",
        relatedUserId: order.acceptedTransporterId,
      });
    }

    res.status(200).json({ message: "Order status updated successfully", updatedOrder: order });

  } catch (err) {
    console.log("Error in updateOrderStatusController: ", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const cancelOrderController = async (req, res) => {
  try {
    const companyId = req.user?._id;
    const { orderId } = req.params;

    if (!companyId) {
      return res.status(404).json({ message: "Unauthorized access" });
    }

    const order = await orderModel.findOne({ _id: orderId, customerId: companyId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (["delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({ message: `Cannot cancel the order that is already ${order.status}` });
    }

    order.status = "cancelled";
    order.currentStatus = "cancelled";
    await order.save();

    const baseNotification = {
      type: "cancelled",
      title: "Order Cancelled",
      message: `Order ${orderId} has been cancelled by the company.`,
      relatedBookingId: orderId,
      deliveryMode: "cancelled",
      metadata: { companyId },
    };

    // Notify Driver
    if (order.acceptedDriverId) {
      await sendNotification({
        ...baseNotification,
        role: "driver",
        relatedUserId: order.acceptedDriverId,
      });
    }

    // Notify Transporter
    if (order.acceptedTransporterId) {
      await sendNotification({
        ...baseNotification,
        role: "transporter",
        relatedUserId: order.acceptedTransporterId,
      });
    }

    // (Optional) Notify Company
    await sendNotification({
      ...baseNotification,
      role: "company",
      relatedUserId: companyId,
      title: "Order Cancelled Confirmation",
      message: `You have cancelled order ${orderId}.`,
    });

    res.status(200).json({ message: "Order cancelled successfully", cancelledOrder: order });

  } catch (err) {
    console.log("Error in cancelOrderController:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateOrderLocationController = async (req, res) => {
  try {
    const { orderId, lat, lng } = req.body;

    if (!orderId || lat == null || lng == null) {
      return res.status(400).json({ message: "orderId, lat, and lng are required" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update current location
    order.currentLocation = {
      type: "Point",
      coordinates: [parseFloat(lng), parseFloat(lat)],
      updatedAt: new Date(),
    };

    // Append to tracking history
    const locationUpdate = {
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      timeStamp: new Date(),
    };

    order.trackingHistory.push(locationUpdate);

    await order.save();

    // Notify Company
    await sendNotification({
      role: "company",
      relatedUserId: order.customerId || order.companyId,
      relatedBookingId: order._id,
      title: "Order Location Updated",
      message: `Driver has updated the location.`,
      type: "tracking",
      deliveryMode: "info",
      metadata: locationUpdate,
    });

    // Notify Transporter (if assigned)
    if (order.assignedTransporter) {
      await sendNotification({
        relatedUserId: order.assignedTransporter,
        relatedBookingId: order._id,
        title: "Order Location Updated",
        message: `Track the live location for Order ${order._id}.`,
        type: "tracking",
        deliveryMode: "info",
        metadata: locationUpdate,
        role: "transporter"
      });
    }

    res.status(200).json({ message: "Order location updated successfully" });
  } catch (err) {
    console.error("Error updating order location:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderByIdController = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId || orderId.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID"
      });
    }

    const order = await orderModel.findById(orderId)
      .populate("customerId", "companyName email")
      .populate("acceptedTransporterId", "transporterName contactNumber")
      .populate("acceptedTruckId", "registrationNumber truckType")
      .populate("acceptedDriverId", "name phone")
      .populate("ratingByCustomer", "companyName")
      .populate("ratingByDriver.reviews", "review stars createdAt")

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order
    });

  } catch (error) {
    console.error("❌ Error in getOrderByIdController:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching order"
    });
  }
};

export const getOpenBiddingOrdersController = async (req, res) => {
    try {
        // Sirf pending status waale orders laayeinge.
        // `acceptedTransporterId: null` wala filter hata diya gaya hai taaki accepted orders bhi list mein dikhe.
        const availableOrders = await orderModel.find({
            status: "pending",
        }).sort({ createdAt: -1 })
          .populate("customerId", "companyName email");

        if (!availableOrders.length) {
            return res.status(200).json({ message: "No available orders found at the moment.", orders: [] });
        }
        
        // Orders ke saath-saath, jo transporter logged in hai, uski ID bhi bhejein.
        res.status(200).json({ 
            message: "Available orders fetched successfully", 
            orders: availableOrders,
            transporterId: req.user._id // Yeh frontend ke liye zaroori hai
        });

    } catch (err) {
        console.error("❌ Error in getOpenBiddingOrdersController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const acceptFixedPriceOrderController = async (req, res) => {
    try {
        console.log("➡️ Incoming Fixed Price Order Acceptance Request");
        const { orderId } = req.params;
        const transporterId = req.user?._id;

        if (!transporterId) {
            console.log("❌ Transporter ID not found (unauthorized)");
            return res.status(401).json({ message: "Unauthorized access. Please log in as a Transporter." });
        }

        const order = await orderModel.findById(orderId);

        if (!order) {
            console.log("❌ Order not found with ID:", orderId);
            return res.status(404).json({ message: "Order not found." });
        }

        if (order.isBiddingEnabled) {
            console.log("❌ Attempted to accept a bidding-enabled order via fixed price route.");
            return res.status(400).json({ message: "This order is for bidding, not direct acceptance." });
        }
        
        if (order.status !== 'pending' || order.acceptedTransporterId) {
            console.log("❌ Order already accepted or not in a valid state.");
            return res.status(400).json({ message: "This order is no longer available for acceptance." });
        }
        
        // --- Truck se sambandhit logic hata diya gaya hai ---

        // Order ko update karein
        order.acceptedTransporterId = transporterId;
        // order.acceptedTruckId wala part hata diya gaya hai
        order.finalBidAmount = order.fare; 
        order.biddingStatus = 'accepted';

        await order.save();
        console.log(`✅ Order ${orderId} accepted by transporter ${transporterId}`);

        // Company ko notification bhejein
        await sendNotification({
            role: "company",
            relatedUserId: order.customerId,
            relatedBookingId: order._id,
            title: "Order Accepted!",
            message: `Your Order #${order._id.toString().slice(-6)} has been accepted by a transporter for the fixed price of ₹${order.fare}.`,
            type: "order_accepted",
            metadata: { 
                orderId: order._id,
                transporterId: transporterId 
            }
        });

        // Frontend ko updated order bhejein taaki UI update ho sake
        res.status(200).json({ 
            message: "Order accepted successfully!", 
            order 
        });

    } catch (err) {
        console.error("❌ Error in acceptFixedPriceOrderController:", err.message);
        console.error("🧨 Full error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
