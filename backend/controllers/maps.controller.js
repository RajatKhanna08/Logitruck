import axios from "axios";
import driverModel from "../models/driverModel.js";
import orderModel from "../models/orderModel.js";
import { geocodeAddress } from "../utils/geocodeAddress.js";
import { getORSRoute } from "../utils/getORSRoute.js";  

export const updateLocation = async (req, res) => {
  let lat = parseFloat(req.body.lat);
  let lng = parseFloat(req.body.lng);
  const driverId = req.user._id;

  if (req.user.role !== "driver") {
    return res.status(403).json({ message: "Only drivers can update location" });
  }

  if (!lat || !lng) {
    return res.status(400).json({ success: false, message: "Latitude and longitude are required" });
  }

  try {
    await driverModel.findByIdAndUpdate(driverId, {
      location: { type: "Point", coordinates: [lng, lat] },
    });

    const activeOrder = await orderModel.findOne({
      acceptedDriverId: driverId,
      status: { $in: ["in_transit", "delayed"] },
    });

    if (activeOrder) {
      activeOrder.currentLocation = {
        type: "Point",
        coordinates: [lng, lat],
        updatedAt: Date.now()
      };
      activeOrder.trackingHistory.push({
        latitude: lat.toString(),
        longitude: lng.toString(),
        timeStamp: Date.now()
      });
      await activeOrder.save();
    }

    if (req.io) {
      req.io.to(`order_${activeOrder?._id}`).emit("locationUpdate", {
        driverId,
        lat,
        lng,
        timestamp: Date.now(),
        orderId: activeOrder?._id,
      });
    }

    return res.status(200).json({ success: true, message: "Location updated successfully" });
  } catch (err) {
    console.error("Location update error:", err);
    return res.status(500).json({ success: false, message: "Failed to update location" });
  }
};

export const updateDriverStatus = async (req, res) => {
  const { mode } = req.body;
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

    const activeOrder = await orderModel.findOne({
      acceptedDriverId: driverId,
      status: { $in: ["in_transit", "delayed"] },
    });

    if (req.io && activeOrder?._id) {
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

    if (typeof start === "string") start = await geocodeAddress(start);
    if (typeof end === "string") end = await geocodeAddress(end);

    if (!Array.isArray(start) || !Array.isArray(end)) {
      return res.status(400).json({ success: false, message: "Invalid start or end format" });
    }

    const routeData = await getORSRoute(start, end);

    return res.status(200).json({
      success: true,
      message: "ETA calculated successfully",
      ...routeData, // includes distanceInKm, durationInMin, polyline
    });
  } catch (err) {
    console.error("Error in calculateETA:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to calculate ETA",
      error: err.message,
    });
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

    const isDriver = user.role === "driver" && order.acceptedDriverId?.toString() === user._id.toString();
    const isTransporter = user.role === "transporter" && order.acceptedTransporterId?.toString() === user._id.toString();
    const isCompany = user.role === "company" && order.customerId?.toString() === user._id.toString();
    const isAdmin = user.role === "admin";

    if (!(isDriver || isTransporter || isCompany || isAdmin)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const start = order.pickupLocation?.coordinates;

    // Use last drop location if multiple, otherwise the first (single-stop also works)
    const dropCount = order.dropLocations?.length || 0;
    const end = dropCount > 0 ? order.dropLocations[dropCount - 1]?.coordinates : null;

    if (!start || !end) {
      return res.status(400).json({ success: false, message: "Invalid route coordinates" });
    }

    const routeData = await getORSRoute(start, end);

    return res.status(200).json({
      success: true,
      pickupLocation: order.pickupLocation,
      dropLocations: order.dropLocations,
      currentLocation: order.currentLocation,
      status: order.status,
      route: routeData,
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

export const updateTripStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body; // "pending", "in-progress", "delivered", etc.

    const allowed = ["pending", "in-progress", "delivered"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.deliveryTimeline.lastknownProgress = status;
    if (status === "in-progress") order.deliveryTimeline.startedAt = new Date();
    if (status === "delivered") order.deliveryTimeline.completedAt = new Date();

    await order.save();

    if (req.io) {
      req.io.to(`order_${order._id}`).emit("tripStatusUpdate", {
        orderId: order._id,
        status,
        timestamp: Date.now()
      });
    }

    res.status(200).json({ success: true, message: "Trip status updated", status });
  } catch (err) {
    console.error("updateTripStatus error:", err);
    res.status(500).json({ success: false, message: "Failed to update trip status" });
  }
};

export const markStopAsReached = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { stopIndex, skipUntilLast } = req.body;
    const user = req.user;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const totalStops = order.dropLocations?.length || 0;

    // ========== Admin: can skip all stops and mark as delivered ==========
    if (skipUntilLast) {
      if (user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Only admin can skip all stops" });
      }

      order.completedStops = totalStops;
      order.status = "delivered";
      order.currentStatus = "delivered";
      order.deliveryTimeline.completedAt = new Date();

      await order.save();

      if (req.io) {
        req.io.to(`order_${order._id}`).emit("stopReached", {
          orderId: order._id,
          skipUntilLast: true,
          completedStops: order.completedStops,
          timestamp: Date.now(),
        });
      }

      return res.status(200).json({
        success: true,
        message: "All remaining stops skipped. Order marked as delivered.",
        completedStops: totalStops,
      });
    }

    // ========== Driver: must follow sequential stop logic ==========
    if (user.role !== "driver" || order.acceptedDriverId?.toString() !== user._id.toString()) {
      return res.status(403).json({ success: false, message: "Only the assigned driver can mark stops as reached" });
    }

    if (typeof stopIndex !== "number" || stopIndex < 0 || stopIndex >= totalStops) {
      return res.status(400).json({ success: false, message: "Invalid stop index" });
    }

    const expectedStopIndex = order.completedStops || 0;
    if (stopIndex !== expectedStopIndex) {
      return res.status(400).json({
        success: false,
        message: `Invalid stop sequence. Next expected stop index: ${expectedStopIndex}`,
      });
    }

    order.completedStops = expectedStopIndex + 1;

    if (order.completedStops === totalStops) {
      order.status = "delivered";
      order.currentStatus = "delivered";
      order.deliveryTimeline.completedAt = new Date();
    }

    await order.save();

    if (req.io) {
      req.io.to(`order_${order._id}`).emit("stopReached", {
        orderId: order._id,
        stopIndex,
        completedStops: order.completedStops,
        timestamp: Date.now(),
        skipUntilLast: false,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Stop ${stopIndex + 1} marked as reached.`,
      completedStops: order.completedStops,
    });
  } catch (err) {
    console.error("markStopAsReached error:", err);
    res.status(500).json({ success: false, message: "Failed to update stop" });
  }
};

export const getORSFullRoute = async (req, res) => {
  try {
    const { pickup, drop, stops = [] } = req.body;

    if (!pickup || !drop) {
      return res.status(400).json({ message: "Pickup and drop locations are required" });
    }

    // Step 1: Geocode pickup, drop, and stops
    const pickupCoords = (await geocodeAddress(pickup)).coordinates;
    const dropCoords = (await geocodeAddress(drop)).coordinates;
    const stopCoords = await Promise.all(
      stops.map(async (stop) => (await geocodeAddress(stop)).coordinates)
    );

    // Step 2: Get route from ORS
    const routeData = await getORSRoute(pickupCoords, dropCoords, stopCoords);

    res.status(200).json(routeData);
  } catch (error) {
    console.error("Error in getORSRoute controller:", error);
    res.status(500).json({ message: "Failed to get route", error: error.message });
  }
};
