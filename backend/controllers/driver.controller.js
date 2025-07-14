import fs from "fs";
import { validationResult } from "express-validator";
import driverModel from "../models/driverModel.js";
import orderModel from "../models/orderModel.js";

import { sendWelcomeEmail, sendLoginAlertEmail } from "../emails/driverEmail.js";
import { sendWhatsAppRegistration, sendWhatsAppLogin } from "../services/whatsapp.service.js";

export const registerDriverController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            transporterId,
            fullName,
            phone,
            email,
            password,
            vehicleType,
            currentLocation,
            experience
        } = req.body;

        const files = req.files;
        if (
            !files ||
            !Array.isArray(files.idProof) ||
            !Array.isArray(files.license) ||
            !files.idProof[0] ||
            !files.license[0]
        ) {
            return res.status(400).json({ message: "All documents are required" });
        }

        const existingDriver = await driverModel.findOne({ email: email });
        if (existingDriver) {
            return res.status(400).json({ message: "Driver already exists" });
        }

        const hashedPassword = await driverModel.hashPassword(password);
        const newDriver = await driverModel.create({
            transporterId: transporterId,
            fullName: fullName,
            email: email,
            phone: phone,
            password: hashedPassword,
            vehicleType: vehicleType,
            currentLocation: {
                latitude: currentLocation?.latitude ?? 0,
                longitude: currentLocation?.longitude ?? 0
            },
            experience: experience,
            documents: {
                idProof: files.idProof[0].path,
                license: files.license[0].path
            }
        });

        const token = newDriver.generateAuthToken();
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        });
        await sendWelcomeEmail(newDriver);
        await sendWhatsAppRegistration(newDriver.phone, newDriver.fullName, "driver");
        res.status(201).json({
            message: "Driver registered successfully",
            driver: {
                _id: newDriver._id,
                fullName: newDriver.fullName,
                phone: newDriver.phone,
                email: newDriver.email,
                vehicleType: newDriver.vehicleType
            }
        });
    } catch (err) {
        console.error("Error in registerDriverController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const loginDriverController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        const existingDriver = await driverModel.findOne({ email: email });
        if (!existingDriver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        const isPasswordCorrect = await existingDriver.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Incorrect email or password" });
        }

        const token = existingDriver.generateAuthToken();
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        });
        await sendLoginAlertEmail(existingDriver);
        await sendWhatsAppLogin(existingDriver.phone, existingDriver.fullName, "Driver");
        res.status(200).json({
            message: "Driver logged in successfully",
            driver: {
                fullName: existingDriver.fullName,
                email: existingDriver.email
            }
        });
    }
    catch (err) {
        console.log("Error in loginDriverController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logoutDriverController = async (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "Driver logged out successfully" });
    }
    catch (err) {
        console.log("Error in logoutDriverController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getDriverProfileController = async (req, res) => {
    try {
        const driverId = req.user?._id;

        if (!driverId) {
            return res.status(400).json({ message: "Driver ID missing or unauthorized" });
        }

        const driver = await driverModel.findById(driverId)
            .select("-password")
            .populate("transporterId rating assignedTruckId activeBookingId");

        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        res.status(200).json({ driver });
    } catch (err) {
        console.log("Error in getDriverProfileController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateDriverProfileController = async (req, res) => {
    try {
        const driverId = req.user?._id;

        if (!driverId) {
            return res.status(400).json({ message: "Unauthorized or missing driver ID" });
        }

        const {
            fullName,
            phone,
            vehicleType,
            experience,
            availabilityStatus
        } = req.body;

        const driver = await driverModel.findById(driverId).select("-password");
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        if (fullName !== undefined) driver.fullName = fullName;
        if (phone !== undefined) driver.phone = phone;
        if (vehicleType !== undefined) driver.vehicleType = vehicleType;
        if (experience !== undefined) driver.experience = experience;
        if (availabilityStatus !== undefined) driver.availabilityStatus = availabilityStatus;

        await driver.save();

        res.status(200).json({
            message: "Driver updated successfully",
            updatedDriver: driver
        });
    } catch (err) {
        console.log("Error in updateDriverProfileController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const uploadDriverDocumentsController = async (req, res) => {
    try {
        const driverId = req.user?._id;

        if (!driverId) {
            return res.status(400).json({ message: "Unauthorized or missing driver ID" });
        }

        const files = req.files;

        if (!files || !files.idProof || !files.license || !files.idProof[0] || !files.license[0]) {
            return res.status(400).json({ message: "All documents are required" });
        }

        const driver = await driverModel.findById(driverId);
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        driver.documents = {
            idProof: files.idProof[0].path,
            license: files.license[0].path,
        };
        await driver.save();

        res.status(200).json({ message: "Documents uploaded successfully" });
    } catch (err) {
        console.log("Error in uploadDriverDocumentsController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteDriverDocumentsController = async (req, res) => {
    try {
        const driverId = req.user?._id;

        if (!driverId) {
            return res.status(400).json({ message: "Unauthorized or missing driver ID" });
        }

        const driver = await driverModel.findById(driverId);
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        const docs = driver.documents || {};
        const docKeys = ["idProof", "license"];

        docKeys.forEach((key) => {
            const filePath = docs[key];
            if (filePath) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.log(`Error deleting ${key}:`, err.message);
                    }
                });
                driver.documents[key] = undefined;
            }
        });

        await driver.save();

        res.status(200).json({ message: "Driver documents deleted successfully" });
    } catch (err) {
        console.log("Error in deleteDriverDocumentsController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAssignedOrderController = async (req, res) => {
    try {
        const driverId = req.user?._id;

        if (!driverId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const assignedOrders = await orderModel
            .find({ acceptedDriverId: driverId })
            .sort({ createdAt: -1 })
            .limit(1)
            .populate("customerId");

        if (!assignedOrders.length) {
            return res.status(200).json({ message: "No assigned order currently" });
        }

        res.status(200).json({ assignedOrder: assignedOrders[0] });
    } catch (err) {
        console.log("Error in getAssignedOrderController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateOrderByDriverController = async (req, res) => {
    try {
        const driverId = req.user?._id;
        const { orderId } = req.params;
        const { action, location, currentStatus, completedStops } = req.body;

        if (!driverId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const order = await orderModel.findOne({ _id: orderId, acceptedDriverId: driverId });
        if (!order) {
            return res.status(404).json({ message: "Order not found or not assigned to you" });
        }

        const now = new Date();

        switch (action) {
            case "start":
                if (order.startTime) {
                    return res.status(400).json({ message: "Order already started" });
                }

                order.startTime = now;
                order.currentStatus = "in-progress";
                order.status = "in_transit";
                order.deliveryTimeline = {
                    ...order.deliveryTimeline,
                    startedAt: now,
                    lastknownProgress: "in-progress"
                };
                break;

            case "update":
                if (!order.startTime) {
                    return res.status(400).json({ message: "Order hasn't started yet" });
                }

                if (currentStatus) {
                    order.currentStatus = currentStatus;
                    order.status = currentStatus === "delivered" ? "delivered" : currentStatus;
                }

                if (typeof completedStops === "number") {
                    order.completedStops = completedStops;
                }

                if (location?.latitude && location?.longitude) {
                    order.currentLocation = {
                        latitude: location.latitude,
                        longitude: location.longitude,
                        updatedAt: now
                    };

                    order.trackingHistory.push({
                        latitude: location.latitude,
                        longitude: location.longitude,
                        timeStamp: now
                    });
                }

                if (order.deliveryTimeline) {
                    order.deliveryTimeline.lastknownProgress = order.currentStatus;
                }
                break;

            case "end":
                if (!order.startTime) {
                    return res.status(400).json({ message: "Order hasn't started yet" });
                }

                order.endTime = now;
                order.currentStatus = "delivered";
                order.status = "delivered";

                if (order.deliveryTimeline) {
                    order.deliveryTimeline.completedAt = now;
                    order.deliveryTimeline.lastknownProgress = "delivered";
                }
                break;

            default:
                return res.status(400).json({ message: "Invalid action. Use 'start', 'update', or 'end'" });
        }

        await order.save();
        res.status(200).json({ message: `Order ${action}ed successfully`, order });

    } catch (err) {
        console.log("Error in updateOrderByDriverController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getWorkModeController = async (req, res) => {
    try {
        const driverId = req.user?._id;

        const driver = await driverModel.findById(driverId).select("currentMode");
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        res.status(200).json({ currentMode: driver.currentMode });
    } catch (err) {
        console.log("Error in getWorkModeController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const toggleWorkModeController = async (req, res) => {
    try {
        const driverId = req.user?._id;

        const driver = await driverModel.findById(driverId).select("currentMode");
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        driver.currentMode = driver.currentMode === "work_mode" ? "rest_mode" : "work_mode";
        await driver.save();

        res.status(200).json({
            message: `Driver mode updated to ${driver.currentMode}`,
            currentMode: driver.currentMode
        });
    } catch (err) {
        console.log("Error in toggleWorkModeController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getOrdersHistoryController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        const companyId = req.user?._id;
        if (!companyId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const orders = await orderModel.find({
            customerId: companyId,
            status: { $in: ["delivered", "cancelled"] }
        })
            .sort({ scheduledAt: -1 })
            .populate("acceptedDriverId", "fullname phone email")
            .populate("acceptedTruckId", "registrationNumber brand model vehicleType")
            .populate("acceptedTransporterId", "transporterName contactNo email");

        if (!orders || orders.length === 0) {
            return res.status(200).json({
                message: "No completed or cancelled orders found",
                orderHistory: []
            });
        }

        res.status(200).json({
            message: "Order history fetched successfully",
            orderHistory: orders
        });

    } catch (err) {
        console.log("Error in getOrdersHistoryController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const requestEWayExtensionController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        const { orderId } = req.params;
        const { reason, newExpiryDate } = req.body;
        const driverId = req.user?._id;

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.acceptedDriverId.toString() !== driverId.toString()) {
            return res.status(403).json({ message: "Unauthorized, not your order" });
        }

        if (!order.documents?.eWayBill?.fileURL) {
            return res.status(400).json({ message: "E-way Bill not found for this order" });
        }

        order.documents.eWayBill.extensionRequest = {
            requestedAt: new Date(),
            reason,
            requestedBy: driverId,
            newExpiryDate
        };

        await order.save();

        res.status(200).json({
            message: "E-way Bill request submitted",
            extensionRequest: order.documents.eWayBill.extensionRequest
        });
    } catch (err) {
        console.log("Error in requestEWayExtensionController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getDriverCurrentLocationController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        const driverId = req.user?._id;

        if (!driverId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const driver = await driverModel.findById(driverId);

        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        res.status(200).json({
            message: "Driver current location fetched successfully",
            location: driver.currentLocation
        });
    } catch (err) {
        console.log("Error in getDriverCurrentLocationController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getDriverDashboardController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        const driverId = req.user?._id;

        if (!driverId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const driver = await driverModel
            .findById(driverId)
            .populate("assignedTruckId")
            .populate("activeBookingId"); 

        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        const activeOrder = await orderModel.findById(driver.activeBookingId);

        res.status(200).json({
            message: "Driver dashboard fetched successfully",
            dashboard: {
                fullName: driver.fullName,
                email: driver.email,
                phone: driver.phone,
                availabilityStatus: driver.availabilityStatus,
                currentMode: driver.currentMode,
                currentLocation: driver.currentLocation,
                assignedTruck: driver.assignedTruckId,
                activeBooking: activeOrder,
                totalDistanceTravelledInKm: driver.totalDistanceTravelledInKm,
                totalHoursDriven: driver.totalHoursDriven,
                totalDaysWorked: driver.totalDaysWorked
            }
        });
    } catch (err) {
        console.log("Error in getDriverDashboardController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const uploadKataParchiBeforeController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        const { orderId } = req.params;

        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: "Kata Parchi before document is required" });
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.documents.kataParchiBefore = {
            fileURL: req.file.path,
            uploadedAt: new Date()
        };

        await order.save();

        res.status(200).json({
            message: "Kata Parchi before uploaded successfully",
            document: order.documents.kataParchiBefore
        });
    } catch (err) {
        console.log("Error in uploadKataParchiBeforeController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const uploadKataParchiAfterController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        const driverId = req.user?._id;
        if (!driverId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const driver = await driverModel.findById(driverId);
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: "Kata Parchi (after delivery) document is required" });
        }

        driver.kataParchiAfter = {
            fileURL: req.file.path,
            uploadedAt: new Date()
        };

        await driver.save();

        res.status(200).json({
            message: "Kata Parchi uploaded successfully after delivery",
            kataParchiAfter: driver.kataParchiAfter
        });

    } catch (err) {
        console.log("Error in uploadKataParchiAfterController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};