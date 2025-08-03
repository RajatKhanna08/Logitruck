import { validationResult } from "express-validator";

import transporterModel from "../models/transporterModel.js";
import driverModel from "../models/driverModel.js";
import truckModel from "../models/truckModel.js";
import orderModel from "../models/orderModel.js";

import { sendTransporterWelcomeEmail, sendTransporterLoginEmail } from "../emails/transporterEmail.js";
import { sendWhatsAppRegistration, sendWhatsAppLogin } from "../services/whatsapp.service.js";
import { sendNotification } from '../utils/sendNotification.js';

export const registerTransporterController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      transporterName,
      ownerName,
      email,
      password,
      contactNo,
      address,
      registrationNumber
    } = req.body;

    const existingTransporter = await transporterModel.findOne({ email });
    if (existingTransporter) {
      return res.status(400).json({ message: "User already exists" });
    }

    const files = req.files;
    if (
      !files?.idProof?.[0] ||
      !files?.businessLicense?.[0] ||
      !files?.gstCertificate?.[0]
    ) {
      return res.status(400).json({
        message: "All documents are required: ID Proof, Business License and GST Certificate"
      });
    }

    const hashedPassword = await transporterModel.hashPassword(password);

    const newTransporter = await transporterModel.create({
      transporterName,
      ownerName,
      contactNo,
      email,
      password: hashedPassword,
      address: JSON.parse(address),
      registrationNumber,
      documents: {
        idProof: files.idProof[0].path,
        businessLicense: files.businessLicense[0].path,
        gstCertificate: files.gstCertificate[0].path
      },
      profileImg: "https://static.vecteezy.com/system/resources/previews/020/911/740/non_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
    });

    const token = newTransporter.generateAuthToken();
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    // Send welcome email and WhatsApp
    await sendTransporterWelcomeEmail(email, transporterName);
    await sendWhatsAppRegistration(newTransporter.contactNo, newTransporter.transporterName, "transporter");
    await sendNotification({
        role: 'transporter',
        relatedUserId: newTransporter._id,
        title: 'Welcome to Logitruck!',
        message: `Hi ${transporterName}, your transporter account has been registered successfully.`,
        type: 'info',
        deliveryMode: 'instant',
    });

    res.status(201).json({
      message: "Transporter registered successfully",
      newTransporter,
    });

  } catch (err) {
    console.error("Error in registerTransporterController:", err);
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

        const isPasswordCorrect = await existingTransporter.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Username or password incorrect" });
        }

        const token = existingTransporter.generateAuthToken();
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        });

        // Send Emails / WhatsApp
        await sendTransporterLoginEmail(email, existingTransporter.transporterName);
        await sendWhatsAppLogin(existingTransporter.contactNo, existingTransporter.transporterName, "transporter");
        await sendNotification({
            role: "transporter",
            relatedUserId: existingTransporter._id,
            title: "Login Successful",
            message: `Welcome back, ${existingTransporter.transporterName}!`,
            type: "activity",
        });

        res.status(200).json({ message: "Logged in Successfully" });

    } catch (err) {
        console.error("Error in loginTransporterController:", err.message);
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

        const transporter = await transporterModel.findById(transporterId)
            .select("-password")
            .populate('trucks');
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
        
            if (!req.files?.idProof?.[0] ||
                !req.files?.businessLicense?.[0] ||
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
    await sendNotification({
      role: "transporter",
      relatedUserId: transporterId,
      title: "Profile Updated",
      message: `Hello ${transporter.transporterName}, your profile was updated successfully.`,
        type: "task",
    });

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
        await sendNotification({
            role: "transporter",
            relatedUserId: transporterId,
            title: "Personal Details Updated",
            message: `Hello ${transporter.ownerName}, your contact details were updated successfully.`,
            type: "task",
        });

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


        const newTruck = await truckModel.create({
            transporterId,
            registrationNumber,
            brand,
            model,
            vehicleType,
            capacityInTon,
            capacityInCubicMeters,
            documents: { // Documents are initially empty strings
                    rcBook: "",
                    insurance: "",
                    pollutionCertificate: ""
            },
            insuranceValidTill: insuranceValidTill || null,
            pollutionCertificateValidTill,
            assignedDriverId: assignedDriverId || null,
            status: "active"
        });

        // <<< START OF CHANGE >>>
        // Increment fleet size and add truck reference to transporter
        await transporterModel.findByIdAndUpdate(
            transporterId,
            {
                $inc: { fleetSize: 1 }, // fleetSize ko 1 se badhao
                $push: { trucks: newTruck._id } // naye truck ki ID ko trucks array me daalo
            }
        );
        // <<< END OF CHANGE >>>

        await sendNotification({
            role: "transporter",
            relatedUserId: transporterId,
            title: "Truck Added Successfully",
            message: `Truck with registration number ${registrationNumber} has been added to your fleet.`,
            type: "activity"
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

        const truck = await truckModel.findOne({ _id: truckId, transporterId });
        if (!truck) {
        return res.status(404).json({ message: "Truck not found" });
        }

        const {
            registrationNumber,
            brand,
            model,
            vehicleType,
            capacityInTon,
            capacityInCubicMeters,
            pollutionCertificateValidTill,
            insuranceValidTill,
            assignedDriverId,
        } = req.body;

        // Update fields if they are provided in the request
        if (registrationNumber) truck.registrationNumber = registrationNumber;
        if (brand) truck.brand = brand;
        if (model) truck.model = model;
        if (vehicleType) truck.vehicleType = vehicleType;
        if (capacityInTon) truck.capacityInTon = capacityInTon;
        if (capacityInCubicMeters) truck.capacityInCubicMeters = capacityInCubicMeters;
        if (pollutionCertificateValidTill) truck.pollutionCertificateValidTill = pollutionCertificateValidTill;
        if (insuranceValidTill) truck.insuranceValidTill = insuranceValidTill;
        
        // Allow un-assigning driver
        truck.assignedDriverId = assignedDriverId ? assignedDriverId : null;

        const updatedTruck = await truck.save();
        await sendNotification({
            role: "transporter",
            relatedUserId: transporterId,
            title: "Truck Details Updated",
            message: `The truck with vehicle number ${truck.registrationNumber} has been updated successfully.`, // Corrected to registrationNumber
            type: "task"
        });
        res.status(200).json({
        message: "Truck updated successfully",
        truck: updatedTruck,
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

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: "No document files were uploaded." });
        }

        // Update document paths if they exist in the request
        if (req.files.rcBook) {
            truck.documents.rcBook = req.files.rcBook[0].path;
        }
        if (req.files.insurance) {
            truck.documents.insurance = req.files.insurance[0].path;
        }
        if (req.files.pollutionCertificate) {
            truck.documents.pollutionCertificate = req.files.pollutionCertificate[0].path;
        }

        const updatedTruck = await truck.save();

        res.status(200).json({
            message: "Truck documents uploaded successfully",
            documents: updatedTruck.documents,
            truck: updatedTruck, // Return the updated truck object
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
        await sendNotification({
            role: "driver",
            relatedUserId: driverId,
            title: "References Updated",
            message: `Your references have been successfully updated.`,
            type: "activity"
        });

        res.status(200).json({
        message: "Driver references updated successfully",
        references: driver.references,
        });

    } catch (err) {
        console.log("Error in updateDriverReferenceController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ NEW
export const activateTruckController = async (req, res) => {
    try {
        const transporterId = req.user?._id;
        const { truckId } = req.params;

        const truck = await truckModel.findOne({ _id: truckId, transporterId });
        if (!truck) {
            return res.status(404).json({ message: "Truck not found or unauthorized" });
        }

        truck.status = 'active';
        await truck.save();

        res.status(200).json({
            message: "Truck has been activated successfully",
            truck,
        });

    } catch (err) {
        console.log("Error in activateTruckController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ NEW
export const deactivateTruckController = async (req, res) => {
    try {
        const transporterId = req.user?._id;
        const { truckId } = req.params;

        const truck = await truckModel.findOne({ _id: truckId, transporterId });
        if (!truck) {
            return res.status(404).json({ message: "Truck not found or unauthorized" });
        }

        truck.status = 'inactive';
        await truck.save();

        res.status(200).json({
            message: "Truck has been deactivated successfully",
            truck,
        });

    } catch (err) {
        console.log("Error in deactivateTruckController:", err.message);
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
        
        // <<< START OF CHANGE >>>
        // Decrement fleet size and remove truck reference from transporter
        await transporterModel.findByIdAndUpdate(
            transporterId,
            {
                $inc: { fleetSize: -1 }, // fleetSize ko 1 se ghatao
                $pull: { trucks: truckId } // truck ki ID ko trucks array se nikalo
            }
        );
        // <<< END OF CHANGE >>>

        // Unassign driver if any
        if (truck.assignedDriverId) {
            await driverModel.findByIdAndUpdate(truck.assignedDriverId, { $set: { assignedTruckId: null } });
        }

        await truckModel.deleteOne({ _id: truckId });

        await sendNotification({
            role: 'transporter', // Corrected role to transporter
            relatedUserId: transporterId, 
            title: 'Truck Deleted', 
            message: `Truck with registration number ${truck.registrationNumber} has been removed from your fleet.`, 
            type: 'status',
        });

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
        const notificationData = {
            type: "status",
            title: "Bilty Uploaded",
            message: `Bilty has been uploaded for Order ID: ${order._id}`,
            relatedBookingId: order._id,
        };
        if (order.companyId) {
            await sendNotification({
                ...notificationData,
                role: "company",
                relatedUserId: order.companyId.toString(),
            });
        }
        if (order.transporterId) {
            await sendNotification({
                ...notificationData,
                role: "transporter",
                relatedUserId: order.transporterId.toString(),
            });
        }
        if (order.driverId) {
            await sendNotification({
                ...notificationData,
                role: "driver",
                relatedUserId: order.driverId.toString(),
            });
        }
        return res.status(200).json({ message: "Bilty uploaded successfully", bilty: order.bilty });
    } catch (err) {
        console.log("Error in uploadBiltyController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const activateTruckWithDriverController = async (req, res) => {
  try {
    const { truckId, driverId } = req.body;

    const truck = await truckModel.findById(truckId);
    const driver = await driverModel.findById(driverId);

    if (!truck || !driver) {
      return res.status(404).json({ message: "Truck or driver not found" });
    }

    truck.assignedDriverId = driverId;
    driver.assignedTruckId = truckId;
    truck.isActive = true;

    await truck.save();
    await driver.save();

    res.status(200).json({ message: "Truck and driver activated for loading" });
  } catch (err) {
    console.error("Error in activateTruckWithDriverController:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deactivateTruckWithDriverController = async (req, res) => {
  try {
    const { truckId, driverId } = req.body;

    const truck = await truckModel.findById(truckId);
    const driver = await driverModel.findById(driverId);

    if (!truck || !driver) {
      return res.status(404).json({ message: "Truck or driver not found" });
    }

    truck.assignedDriverId = null;
    driver.assignedTruckId = null;
    truck.isActive = false;

    await truck.save();
    await driver.save();

    res.status(200).json({ message: "Truck and driver deactivated from loading" });
  } catch (err) {
    console.error("Error in deactivateTruckWithDriverController:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};