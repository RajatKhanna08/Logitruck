import { validationResult } from "express-validator";
import driverModel from "../models/driverModel";

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

        driver.documents = {
            idProof: null,
            license: null
        };


    }
    catch(err){
        console.log("Error in deleteDriverDocumentsController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getAssignedOrderController = async (req, res) => {

}

export const startOrderController = async (req, res) => {

}

export const updateOrderProgressController = async (req, res) => {

}

export const endOrderController = async (req, res) => {

}

export const getWorkModeController = async (req, res) => {

}

export const toggleWorkModeController = async (req, res) => {

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