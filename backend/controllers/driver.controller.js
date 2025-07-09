import { validationResult } from "express-validator";

import driverModel from "../models/driverModel.js";
import orderModel from "../models/orderModel.js"

export const registerDriverController = async (req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
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
        if(!files || !files.idProof || !files.license){
            return res.status(400).json({ message: "All documents are required" });
        }

        const existingDriver = await driverModel.findOne({ email: email });
        if(existingDriver){
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
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude
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
    }
    catch(err){
        console.log("Error in registerDriverController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const loginDriverController = async (req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        
        const existingDriver = await driverModel.findOne({ email: email });
        if(!existingDriver){
            return res.status(404).json({ message: "Driver not found" });
        }

        const isPasswordCorrect = await existingDriver.comparePassword(password);
        if(!isPasswordCorrect){
            return res.status(400).json({ message: "Incorrect email or password" });
        }

        const token = existingDriver.generateAuthToken();
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        });

        res.status(200).json({
            message: "Driver logged in successfully",
            driver: {
                fullName: existingDriver.fullName,
                email: existingDriver.email
            }
        });
    }
    catch(err){
        console.log("Error in loginDriverController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logoutDriverController = async (req, res) => {
    try{
        res.clearCookie("jwt");
        res.status(200).json({ message: "Driver logged out successfully" });
    }
    catch(err){
        console.log("Error in logoutDriverController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getDriverProfileController = async (req, res) => {
    try{
        const driverId = req.user?._id;

        const driver = await driverModel.findById(driverId)
            .select("-password")
            .populate("transporterId rating assignedTruckId activeBookingId");
        if(!driver){
            return res.status(404).json({ message: "Driver not found" });
        }

        res.status(200).json({ driver });
    }
    catch(err){
        console.log("Error in getDriverProfileController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateDriverProfileController = async (req, res) => {
    try{
        const driverId = req.user?._id;

        const {
            fullName,
            phone,
            vehicleType,
            experience,
            availabilityStatus
        } = req.body;

        const driver = await driverModel.findById(driverId).select("-password");
        if(!driver){
            return res.status(404).json({ message: "Driver not found" });
        }

        if(fullName !== undefined) driver.fullName = fullName;
        if(phone !== undefined) driver.phone = phone;
        if(vehicleType !== undefined) driver.vehicleType = vehicleType;
        if(experience !== undefined) driver.experience = experience;
        if(availabilityStatus !== undefined) driver.availabilityStatus = availabilityStatus;

        await driver.save();

        res.status(200).json({ message: "Driver updated successfully", updatedDriver: driver })
    }
    catch(err){
        console.log("Error in updateDriverProfileController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const uploadDriverDocumentsController = async (req, res) => {
    try{
        const driverId = req.user?._id;
        const files = req.files;

        if(!files || !files.idProof || !files.license || !files.idProof[0] || !files.license[0]){
            return res.status(400).json({ message: "All documents are required" });
        }

        const driver = await driverModel.findById(driverId);
        if(!driver){
            return res.status(404).json({ message: "Driver not found" });
        }

        driver.documents = {
            idProof: files.idProof[0].path,
            license: files.license[0].path,
        };
        await driver.save();

        res.status(200).json({ message: "Documents uploaded successfully" });
    }
    catch(err){
        console.log("Error in uploadDriverDocumentsController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteDriverDocumentsController = async (req, res) => {
    try{
        const driverId = req.user?._id;

        const driver = await driverModel.findById(driverId);
        if(!driver){
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
    }
    catch(err){
        console.log("Error in deleteDriverDocumentsController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getAssignedOrderController = async (req, res) => {
    try{
        const driverId = req.user?._id;

        const assignedOrder = await orderModel.find({ acceptedDriverId: driverId })
            .sort({ createdAt: -1 })
            .limit(1)
            .populate("customerId");
        if(!assignedOrder.length){
            return res.status(200).json({ message: "No assigned order currently" });
        }

        res.status(200).json({ assignedOrder: assignedOrder[0] });
    }
    catch(err){
        console.log("Error in getAssignedOrderController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateOrderByDriverController = async (req, res) => {
    try{
        const driverId = req.user?._id;
        const { orderId } = req.params;
        const {
            action,
            location,
            currentStatus,
            completedStops
        } = req.body;

        const order = await orderModel.findOne({ _id: orderId, acceptedDriverId: driverId });
        if(!order){
            return res.status(404).json({ message: "Order not found or not assigned to you" });
        }

        const now = new Date();

        if(action === "start"){
            if(order.startTime){
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
        }
        else if(action === "update"){
            if(!order.startTime){
                return res.status(400).json({ message: "Order hasn't started yet" });
            }

            if(currentStatus){
                order.currentStatus = currentStatus;
                order.status = currentStatus === "delivered" ? "delivered" : currentStatus;
            }

            if(typeof completedStops === "number"){
                order.completedStops = completedStops;
            }

            if(location?.latitude && location?.longitude){
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

            if(order.deliveryTimeline){
                order.deliveryTimeline.lastknownProgress = order.currentStatus;
            }
        }
        else if(action === "end"){
            if(!order.status){
                return res.status(400).json({ message: "Order hasn't started yet" });
            }

            order.endTime = now;
            order.currentStatus = "delivered";
            order.status = "delivered";

            if(order.deliveryTimeline){
                order.deliveryTimeline.completedAt = now;
                order.deliveryTimeline.lastknownProgress = "delivered";
            }
        }
        else{
            return res.status(400).json({ message: "Invalid action. Use 'start', 'update' or 'end'" });
        }

        await order.save();
        res.status(200).json({ message: `Order ${action}ed successfully`, order });
    }
    catch(err){
        console.log("Error in updateOrderByDriverController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getWorkModeController = async (req, res) => {
    try{
        const driverId = req.user?._id;

        const driver = await driverModel.findById(driverId)
            .select("currentMode");

        if(!driver){
            return res.status(404).json({ message: "Driver not found" });
        }

        res.status(200).json({ driverWorkMode: driver });
    }
    catch(err){
        console.log("Error in getWorkModeController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const toggleWorkModeController = async (req, res) => {
    try{
        const driverId = req.user?._id;

        const driver = await driverModel.findById(driverId).select("currentMode");
        if(!driver){
            return res.status(404).json({ message: "Driver not found" });
        }

        driver.currentMode = driver.currentMode === "work_mode" ? "rest_mode" : "work_mode";
        await driver.save();

        res.status(200).json({
            message: `Driver is now in ${driver.currentMode}`,
            currentMode: driver.currentMode
        });
    }
    catch(err){
        console.log("Error in toggleWorkModeController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getOrdersHistoryController = async (req, res) => {

}

export const requestEWayExtensionController = async (req, res) => {

}

export const reportEmergencyController = async (req, res) => {

}

export const getDriverCurrentLocationController = async (req, res) => {

}

export const getDriverDashboardController = async (req, res) => {
    
}

export const uploadKataParchiBeforeController = async (req, res) => {

}

export const uploadKataParchiAfterController = async (req, res) => {

}

export const uploadReceivingDocumentController = async (req, res) => {
    
}