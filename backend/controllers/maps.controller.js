import axios from "axios";
import driverModel from "../models/driverModel.js";
import orderModel from "../models/orderModel.js";
import { geocodeAddress } from "../utils/geocodeAddress.js";

export const updateLocation = async (req, res) => {
  const { lat, lng } = req.body;
  const driverId = req.user._id;
  if (!lat || !lng) {
    return res.status(400).json({ success: false, message: "Latitude and longitude are required" });
  }
  try {
    // 1. Update the driver's location
    await driverModel.findByIdAndUpdate(driverId, {
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });
    // 2. Emit the location to all connected clients via Socket.IO
    if (req.io) {
      req.io.emit("locationUpdate", {
        driverId,
        lat,
        lng,
        timestamp: Date.now(),
      });
    }
    return res.status(200).json({ success: true, message: "Location updated successfully" });
  } catch (err) {
    console.error("Location update error:", err);
    return res.status(500).json({ success: false, message: "Failed to update location" });
  }
};

export const updateDriverStatus = async (req, res) => {
  const { mode } = req.body; // "work_mode" or "rest_mode"
  const { driverId } = req.params;

  if (!["work_mode", "rest_mode"].includes(mode)) {
    return res.status(400).json({ success: false, message: "Invalid mode" });
  }

  try {
    const driver = await driverModel.findById(driverId);
    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    driver.currentMode = mode;
    driver.lastModeUpdateTime = Date.now();
    await driver.save();

    // 🔄 Get the active order where this driver is assigned
    const activeOrder = await orderModel.findOne({
      acceptedDriverId: driverId,
      status: { $in: ["in_transit", "delayed"] },
    });

    if (req.io && activeOrder?._id) {
      // Emit to only the relevant order room
      req.io.to(`order_${activeOrder._id}`).emit("driverStatusUpdate", {
        driverId,
        mode,
        timestamp: driver.lastModeUpdateTime,
      });
    }

    return res.status(200).json({ success: true, message: "Driver status updated" });
  } catch (err) {
    console.error("Status update error:", err);
    return res.status(500).json({ success: false, message: "Failed to update driver status" });
  }
};

export const calculateETA = async (req, res) => {
  try {
    let { start, end } = req.body;

    // Step 1: Convert addresses to coordinates if they are strings
    if (typeof start === "string") {
      start = await geocodeAddress(start); // returns [lng, lat]
    }

    if (typeof end === "string") {
      end = await geocodeAddress(end); // returns [lng, lat]
    }

    if (!Array.isArray(start) || !Array.isArray(end)) {
      return res.status(400).json({ message: "Invalid coordinates or address" });
    }

    // Step 2: Call ORS directions API
    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      {
        coordinates: [start, end],
      },
      {
        headers: {
          Authorization: process.env.ORS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    const { distance, duration } = data.routes[0].summary;

    res.status(200).json({
      message: "ETA calculated successfully",
      distanceInKm: (distance / 1000).toFixed(2), // meters to km
      durationInMin: (duration / 60).toFixed(2),  // seconds to minutes
    });
  } catch (err) {
    console.error("Error in calculateETA:", err.message);
    res.status(500).json({ message: "Failed to calculate ETA", error: err.message });
  }
};

export const getNearbyDrivers = async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const radiusInKm = 20; // Customize this as needed

    const nearbyDrivers = await driverModel.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: radiusInKm * 1000, // Convert to meters
        },
      },
      currentMode: "work_mode", // only show available drivers
    });

    res.status(200).json({
      success: true,
      drivers: nearbyDrivers,
    });
  } catch (err) {
    console.error("Error fetching nearby drivers:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch nearby drivers" });
  }
};

export const getTrackingData = async (req, res) => {
  try {
    const { orderId } = req.params;
    const user = req.user; // the authenticated user

    const order = await orderModel.findById(orderId)
      .select("currentLocation acceptedDriverId acceptedTransporterId customerId status");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Role-based access check
    const isDriver = user.role === "driver" && order.acceptedDriverId?.toString() === user._id.toString();
    const isTransporter = user.role === "transporter" && order.acceptedTransporterId?.toString() === user._id.toString();
    const isCompany = user.role === "company" && order.customerId?.toString() === user._id.toString();
    const isAdmin = user.role === "admin";

    if (!(isDriver || isTransporter || isCompany || isAdmin)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    return res.status(200).json({
      success: true,
      driverId: order.acceptedDriverId,
      currentLocation: order.currentLocation,
      status: order.status
    });
  } catch (err) {
    console.error("Tracking data error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch tracking data" });
  }
};

export const getTripRoute = async (req, res) => {
  try {
    const { orderId } = req.params;
    const user = req.user;

    const order = await orderModel.findById(orderId)
      .select("pickupLocation dropLocations currentLocation status acceptedDriverId acceptedTransporterId customerId");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Role-based access control
    const isDriver = user.role === "driver" && order.acceptedDriverId?.toString() === user._id.toString();
    const isTransporter = user.role === "transporter" && order.acceptedTransporterId?.toString() === user._id.toString();
    const isCompany = user.role === "company" && order.customerId?.toString() === user._id.toString();
    const isAdmin = user.role === "admin";

    if (!(isDriver || isTransporter || isCompany || isAdmin)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    return res.status(200).json({
      success: true,
      pickupLocation: order.pickupLocation,
      dropLocations: order.dropLocations,
      currentLocation: order.currentLocation,
      status: order.status
    });
  } catch (err) {
    console.error("Trip route error:", err);
    return res.status(500).json({ success: false, message: "Failed to get trip route" });
  }
};

export const getDriverTripSummary = async (req, res) => {
  try {
    const { driverId } = req.params;
    const user = req.user;

    // Role-based access check
    const isDriver = user.role === "driver" && user._id.toString() === driverId;
    const isAdmin = user.role === "admin";

    // For transporter/company: check if they were involved in any of the driver’s orders
    const relatedOrders = await orderModel.find({
      acceptedDriverId: driverId,
      status: "delivered",
      ...(user.role === "transporter" && { acceptedTransporterId: user._id }),
      ...(user.role === "company" && { customerId: user._id }),
    }).select("distance duration fare completedStops");

    const isAuthorized = isDriver || isAdmin || (relatedOrders.length > 0);

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (!relatedOrders || relatedOrders.length === 0) {
      return res.status(404).json({ success: false, message: "No completed trips found" });
    }

    const totalDistance = relatedOrders.reduce((sum, o) => sum + (o.distance || 0), 0);
    const totalDuration = relatedOrders.reduce((sum, o) => sum + (o.duration || 0), 0);
    const totalFare = relatedOrders.reduce((sum, o) => sum + (o.fare || 0), 0);
    const totalTrips = relatedOrders.length;
    const totalStops = relatedOrders.reduce((sum, o) => sum + (o.completedStops || 0), 0);

    res.status(200).json({
      success: true,
      totalTrips,
      totalDistanceInKm: totalDistance.toFixed(2),
      totalDurationInMin: totalDuration.toFixed(2),
      totalFare,
      totalStops
    });
  } catch (err) {
    console.error("Trip summary error:", err);
    res.status(500).json({ success: false, message: "Failed to get trip summary" });
  }
};

export const getOrderRouteHistory = async (req, res) => {
  try {
    const { orderId } = req.params;
    const user = req.user;

    const order = await orderModel.findById(orderId).select("trackingHistory acceptedDriverId acceptedTransporterId customerId");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Authorization check
    const isAdmin = user.role === 'admin';
    const isDriver = user.role === 'driver' && order.acceptedDriverId?.toString() === user._id.toString();
    const isTransporter = user.role === 'transporter' && order.acceptedTransporterId?.toString() === user._id.toString();
    const isCompany = user.role === 'company' && order.customerId?.toString() === user._id.toString();

    if (!isAdmin && !isDriver && !isTransporter && !isCompany) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    return res.status(200).json({
      success: true,
      trackingHistory: order.trackingHistory
    });
  } catch (err) {
    console.error("Route history error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch route history" });
  }
};