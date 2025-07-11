import { validationResult } from "express-validator";

import transporterModel from "../models/transporterModel.js";
import driverModel from "../models/driverModel.js";
import truckModel from "../models/truckModel.js";
import orderModel from "../models/orderModel.js";

import { sendTransporterWelcomeEmail } from "../email/transporterEmail.js";
import { sendTransporterLoginEmail } from "../email/transporterEmail.js";


    export const registerTransporterController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const { transporterName, email, password } = req.body;

        const existingTransporter = await transporterModel.findOne({ email });
        if (existingTransporter) {
        return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await transporterModel.hashPassword(password);
        const newTransporter = await transporterModel.create({
        transporterName,
        email,
        password: hashedPassword,
        });
        await newTransporter.save();

        const token = newTransporter.generateAuthToken();
        res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        });
        await sendTransporterWelcomeEmail(email, transporterName);

        res.status(201).json({
        message: "Transporter registered successfully",
        newTransporter,
        });
    } catch (err) {
        console.log("Error in registerTransporterController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    };

    export const loginTransporterController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const existingTransporter = await transporterModel.findOne({ email });
        if (!existingTransporter) {
        return res.status(404).json({ message: "Transporter Not Found" });
        }

        const isPasswordCorrect = await existingTransporter.comparePassword(password); // ✅ Await here
        if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Username or password incorrect" });
        }

        const token = existingTransporter.generateAuthToken();
        res.cookie("jwt", token);
        await sendTransporterLoginEmail(email, existingTransporter.transporterName);

        res.status(200).json({ message: "Logged in Successfully" });
    } catch (err) {
        console.log("Error in loginTransporterController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    };

    export const logoutTransporterController = async (req, res) => {
        try {
            res.clearCookie("jwt");
            res.status(200).json({ message: "Transporter Log out Successfully" });
        }
        catch(err){
            console.log("Error in logoutTransporterController:", err.message);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    export const getTransporterProfileController = async (req, res) => {
    try {
        const transporterId = req.user?._id;
        if (!transporterId) {
        return res.status(400).json({ message: "Profile not found" });
        }

        const transporter = await transporterModel.findById(transporterId).select("-password");
        if (!transporter) {
        return res.status(404).json({ message: "Transporter not found" });
        }

        res.status(200).json({ transporter });
    } catch (err) {
        console.log("Error in getTransporterProfileController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    };

    export const uploadTransporterCertificationsController = async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array() });
            }

            const { transporterId } = req.params;
        
            if (!req.files?.idProof?.[0]?.path ||
                !req.files?.businessLicense?.[0]?.path ||
                !req.files?.gstCertificate?.[0].path) {
                return res.status(400).json({ message: "All certification files are required" });
            }

            const transporter = await transporterModel.findById(transporterId);
            if (!transporter) {
                return res.status(404).json({ message: "Transporter not found" });
            }

            transporter.documents = {
                idProof: req.files.idProof[0].path,
                businessLicense: req.files.businessLicense[0].path,
                gstCertificate: req.files.gstCertificate[0].path
            };
            await transporter.save();

            res.status(200).json({ message: "Certification uploaded successfully", documents: transporter.documents });
        }
        catch (err) {
            console.log("Error uplaodTransporterCertificateController:", err.message);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };

    export const getTransporterCertificationsController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
        }

        const { transporterId } = req.params;
        const transporter = await transporterModel.findById(transporterId).select("documents");
        
        if (!transporter) {
        return res.status(404).json({ message: "Transporter not found" });
        }

        res.status(200).json({ documents: transporter.documents });
    } catch (err) {
        console.log("Error in getTransporterCertificationsController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    };

    export const deleteTransporterCertificationsController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
        }

        const transporterId = req.user?._id;
        const transporter = await transporterModel.findById(transporterId);
        if (!transporter) {
        return res.status(404).json({ message: "Transporter not found" });
        }

        transporter.documents = {
        idProof: "",
        businessLicense: "",
        gstCertificate: ""
        };

        await transporter.save();

        res.status(200).json({
        message: "Certification documents deleted successfully",
        documents: transporter.documents
        });
    } catch (err) {
        console.log("Error in deleteTransporterCertificationsController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    };

    export const getTransporterDashboardController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
        }

        const transporterId = req.user?._id;
        if (!transporterId) {
        return res.status(401).json({ message: "Unauthorized access" });
        }

        const totalTrucks = await truckModel.countDocuments({ transporterId });
        const totalDrivers = await driverModel.countDocuments({ transporterId });
        const totalOrders = await orderModel.countDocuments({ acceptedTransporterId: transporterId });

        const activeOrders = await orderModel.countDocuments({
        acceptedTransporterId: transporterId,
        status: { $in: ["pending", "in_transit", "delayed"] }
        });

        const deliveredOrders = await orderModel.countDocuments({
        acceptedTransporterId: transporterId,
        status: "delivered"
        });

        const delayedOrders = await orderModel.countDocuments({
        acceptedTransporterId: transporterId,
        status: "delayed"
        });

        const transporter = await transporterModel.findById(transporterId).select("rating");

        res.status(200).json({
        message: "Dashboard fetched successfully",
        dashboard: {
            totalTrucks,
            totalDrivers,
            totalOrders,
            activeOrders,
            deliveredOrders,
            delayedOrders,
            rating: transporter?.rating || 0
        }
        });

    } catch (err) {
        console.log("Error in getTransportDashboardController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    };

    export const updateTransporterProfileController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const transporterId = req.user?._id;
        const {
        transporterName,
        ownerName,
        contactNo,
        email,
        address,
        registrationNumber,
        fleetSize
        } = req.body;

        const transporter = await transporterModel.findById(transporterId);
        if (!transporter) {
        return res.status(404).json({ message: "Transporter not found" });
        }

        if (transporterName) transporter.transporterName = transporterName;
        if (ownerName) transporter.ownerName = ownerName;
        if (contactNo) transporter.contactNo = contactNo;
        if (email) transporter.email = email;
        if (address) transporter.address = address;
        if (registrationNumber) transporter.registrationNumber = registrationNumber;
        if (fleetSize !== undefined) transporter.fleetSize = fleetSize;

        await transporter.save();

        res.status(200).json({
        message: "Transporter profile updated successfully",
        transporter: {
            transporterName: transporter.transporterName,
            ownerName: transporter.ownerName,
            contactNo: transporter.contactNo,
            email: transporter.email,
            address: transporter.address,
            registrationNumber: transporter.registrationNumber,
            fleetSize: transporter.fleetSize
        }
        });
    } catch (err) {
        console.log("Error in updateTransporterProfileController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    };

    export const updateTransporterPersonController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const transporterId = req.user?._id;
        const { ownerName, contactNo, email } = req.body;

        const transporter = await transporterModel.findById(transporterId);
        if (!transporter) {
        return res.status(404).json({ message: "Transporter not found" });
        }

        if (ownerName) transporter.ownerName = ownerName;
        if (contactNo) transporter.contactNo = contactNo;
        if (email) transporter.email = email;

        await transporter.save();

        res.status(200).json({
        message: "Transporter personal details updated successfully",
        updatedDetails: {
            ownerName: transporter.ownerName,
            contactNo: transporter.contactNo,
            email: transporter.email
        }
        });
    } catch (err) {
        console.log("Error in updateTransporterPersonController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    };

    export const addTruckController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const transporterId = req.user?._id;
        if (!transporterId) {
        return res.status(401).json({ message: "Unauthorized access" });
        }

        const {
        registrationNumber,
        brand,
        model,
        vehicleType,
        capacityInTon,
        capacityInCubicMeters,
        insuranceValidTill,
        pollutionCertificateValidTill,
        assignedDriverId
        } = req.body;

        // Required documents check
        if (
        !req.files?.rcBook?.[0]?.path ||
        !req.files?.pollutionCertificate?.[0]?.path
        ) {
        return res.status(400).json({ message: "Required documents are missing" });
        }

        const newTruck = await truckModel.create({
        transporterId,
        registrationNumber,
        brand,
        model,
        vehicleType,
        capacityInTon,
        capacityInCubicMeters,
        documents: {
            rcBook: req.files.rcBook[0].path,
            insurance: req.files.insurance?.[0]?.path || "",
            pollutionCertificate: req.files.pollutionCertificate[0].path
        },
        insuranceValidTill: insuranceValidTill || null,
        pollutionCertificateValidTill,
        assignedDriverId: assignedDriverId || null,
        status: "active"
        });

        res.status(201).json({
        message: "Truck added successfully",
        truck: newTruck
        });

    } catch (err) {
        console.log("Error in addTruckController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    };

    export const getMyTrucksController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const transporterId = req.user?._id;
        if (!transporterId) {
        return res.status(401).json({ message: "Unauthorized access" });
        }

        const trucks = await truckModel.find({ transporterId });

        res.status(200).json({
        message: trucks.length ? "Trucks fetched successfully" : "No trucks found",
        trucks,
        });

    } catch (err) {
        console.log("Error in getMyTrucksController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    };

    export const getTruckByIdController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const { truckId } = req.params;
        const transporterId = req.user?._id;

        if (!transporterId) {
        return res.status(401).json({ message: "Unauthorized access" });
        }

        const truck = await truckModel.findOne({ _id: truckId, transporterId });
        if (!truck) {
        return res.status(404).json({ message: "Truck not found" });
        }

        res.status(200).json({ message: "Truck details fetched successfully", truck });

    } catch (err) {
        console.log("Error in getTruckByIdController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    };

    export const updateTruckDetailsController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const { truckId } = req.params;
        const transporterId = req.user?._id;
        const {
        vehicleNumber,
        truckType,
        capacity,
        fuelType,
        isActive,
        } = req.body;

        const truck = await truckModel.findOne({ _id: truckId, transporterId });
        if (!truck) {
        return res.status(404).json({ message: "Truck not found" });
        }

        truck.vehicleNumber = vehicleNumber || truck.vehicleNumber;
        truck.truckType = truckType || truck.truckType;
        truck.capacity = capacity || truck.capacity;
        truck.fuelType = fuelType || truck.fuelType;
        truck.isActive = typeof isActive === "boolean" ? isActive : truck.isActive;

        await truck.save();

        res.status(200).json({
        message: "Truck updated successfully",
        truck: {
            vehicleNumber: truck.vehicleNumber,
            truckType: truck.truckType,
            capacity: truck.capacity,
            fuelType: truck.fuelType,
            isActive: truck.isActive,
        },
        });

    } catch (err) {
        console.log("Error in updateTruckDetailsController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    };

    export const uploadTruckDocumentsController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const { truckId } = req.params;
        const transporterId = req.user?._id;

        if (!transporterId) {
        return res.status(401).json({ message: "Unauthorized access" });
        }

        const truck = await truckModel.findOne({ _id: truckId, transporterId });
        if (!truck) {
        return res.status(404).json({ message: "Truck not found or not associated with you" });
        }

        if (
        !req.files?.rcBook?.[0]?.path ||
        !req.files?.insurance?.[0]?.path ||
        !req.files?.pollutionCertificate?.[0]?.path
        ) {
        return res.status(400).json({ message: "All documents are required: RC Book, Insurance, Pollution Certificate" });
        }

        // Save document paths
        truck.documents = {
        rcBook: req.files.rcBook[0].path,
        insurance: req.files.insurance[0].path,
        pollutionCertificate: req.files.pollutionCertificate[0].path,
        };

        await truck.save();

        res.status(200).json({
        message: "Truck documents uploaded successfully",
        documents: truck.documents,
        });

    } catch (err) {
        console.log("Error in uploadTruckDocumentsController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    };

    export const updateDriverReferenceController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const { driverId } = req.params;
        const { references } = req.body;

        if (!Array.isArray(references) || references.length === 0) {
        return res.status(400).json({ message: "References are required and must be a non-empty array" });
        }

        const driver = await driverModel.findById(driverId);
        if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
        }

        driver.references = references;
        await driver.save();

        res.status(200).json({
        message: "Driver references updated successfully",
        references: driver.references,
        });

    } catch (err) {
        console.log("Error in updateDriverReferenceController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    };

    export const toggleTruckActivationController = async (req, res) => {
    try {
        const transporterId = req.user?._id;
        const { truckId } = req.params;

        if (!transporterId) {
        return res.status(401).json({ message: "Unauthorized access" });
        }

        const truck = await truckModel.findOne({ _id: truckId, transporterId });
        if (!truck) {
        return res.status(404).json({ message: "Truck not found or unauthorized" });
        }

        // Toggle active status
        truck.isActive = !truck.isActive;

        // If deactivated and driver is assigned, unassign driver
        if (!truck.isActive && truck.assignedDriverId) {
        const driver = await driverModel.findById(truck.assignedDriverId);
        if (driver) {
            driver.assignedTruckId = null;
            await driver.save();
        }
        truck.assignedDriverId = null;
        }

        await truck.save();

        res.status(200).json({
        message: `Truck has been ${truck.isActive ? "activated" : "deactivated"} successfully`,
        truck,
        });

    } catch (err) {
        console.log("Error in toggleTruckActivationController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    };

    export const deleteTruckController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
        }

        const transporterId = req.user?._id;
        const { truckId } = req.params;

        if (!transporterId) {
        return res.status(401).json({ message: "Unauthorized access" });
        }

        const truck = await truckModel.findOne({ _id: truckId, transporterId });
        if (!truck) {
        return res.status(404).json({ message: "Truck not found or unauthorized" });
        }

        await truckModel.deleteOne({ _id: truckId });

        res.status(200).json({ message: "Truck deleted successfully" });

    } catch (err) {
        console.log("Error in deleteTruckController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    };

    export const getMyDriversController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
        }

        const transporterId = req.user?._id;

        if (!transporterId) {
        return res.status(401).json({ message: "Unauthorized access" });
        }

        const drivers = await driverModel.find({ transporterId }).select("-password");
        
        if (!drivers.length) {
        return res.status(200).json({ message: "No drivers found", drivers: [] });
        }

        res.status(200).json({ message: "Drivers retrieved successfully", drivers });

    } catch (err) {
        console.log("Error in getMyDriversController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    };

    export const getDriverByIdController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
        }

        const { driverId } = req.params;

        const driver = await driverModel.findById(driverId)
        .populate("assignedTruckId", "vehicleType")
        .select("-password");

        if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
        }

        res.status(200).json({ message: "Driver details retrieved", driver });

    } catch (err) {
        console.log("Error in getDriverByIdController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    };

    export const removeDriverController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
        }

        const transporterId = req.user?._id;
        const { driverId } = req.params;

        const driver = await driverModel.findById(driverId);
        if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
        }

        if (String(driver.transporterId) !== String(transporterId)) {
        return res.status(403).json({ message: "Unauthorized: Driver does not belong to you" });
        }

        // If driver has a truck assigned, unlink it
        if (driver.assignedTruckId) {
        const truck = await truckModel.findById(driver.assignedTruckId);
        if (truck) {
            truck.assignedDriverId = null;
            await truck.save();
        }
        }

        await driverModel.findByIdAndDelete(driverId);
        res.status(200).json({ message: "Driver removed successfully" });

    } catch (err) {
        console.log("Error in removeDriverController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    };

    export const uploadBiltyController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
        }

        const { orderId } = req.params;

        if (!req.file || !req.file.path) {
        return res.status(400).json({ message: "Bilty file is required" });
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
        return res.status(404).json({ message: "Order not found" });
        }

        order.bilty = {
        fileURL: req.file.path,
        uploadedBy: req.user._id,
        uploadedAt: new Date(),
        };

        await order.save();

        return res.status(200).json({ message: "Bilty uploaded successfully", bilty: order.bilty });
    } catch (err) {
        console.log("Error in uploadBiltyController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
    };