import fs from 'fs';
import { promises as fsPromises } from 'fs';
import { validationResult } from "express-validator";

import companyModel from "../models/companyModel.js";
import orderModel from '../models/orderModel.js';
import truckModel from '../models/truckModel.js';
import driverModel from '../models/driverModel.js';

import { sendCompanyWelcomeEmail, sendCompanyLoginEmail } from "../emails/companyEmail.js";
import { sendWhatsAppRegistration, sendWhatsAppLogin } from '../services/whatsapp.service.js';
import { sendNotification } from '../utils/sendNotification.js';

export const registerCompanyController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let {
            companyName,
            companyEmail,
            companyPhone,
            password,
            address,
            registrationNumber,
            industry,
            contactPerson
        } = req.body;

        companyEmail = companyEmail.toLowerCase();

        const existingCompany = await companyModel.findOne({ companyEmail });
        if (existingCompany) {
            return res.status(409).json({ message: "Email already exists" });
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

        // Safely parse JSON fields
        let parsedContactPerson = {};
        let parsedAddress = {};
        try {
            parsedContactPerson = JSON.parse(contactPerson);
            parsedAddress = JSON.parse(address);
        } catch (parseError) {
            return res.status(400).json({
                message: "Invalid JSON format in contactPerson or address",
                error: parseError.message
            });
        }

        const hashedPassword = await companyModel.hashPassword(password);
        const newCompany = await companyModel.create({
            companyName,
            companyEmail,
            companyPhone,
            password: hashedPassword,
            profileImg: "https://static.vecteezy.com/system/resources/previews/020/911/740/non_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png",
            contactPerson: parsedContactPerson,
            address: parsedAddress,
            registrationNumber,
            industry,
            documents: {
                idProof: files.idProof[0].path,
                businessLicense: files.businessLicense[0].path,
                gstCertificate: files.gstCertificate[0].path
            }
        });

        await sendCompanyWelcomeEmail(companyEmail, companyName);
        await sendWhatsAppRegistration(newCompany.companyPhone, newCompany.companyName, "company");

        await sendNotification({
            role: "company",
            type: "general",
            title: "Welcome to Logitruck!",
            message: `Dear ${companyName}, your account has been successfully registered.`,
            relatedBookingId: "N/A",
            relatedUserId: newCompany._id.toString(),
            deliveryMode: "pending",
            metadata: {
                industry,
                registrationNumber
            }
        });

        const token = newCompany.generateAuthToken();
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        });

        res.status(201).json({
            message: "Company registered successfully",
            company: {
                _id: newCompany._id,
                companyName: newCompany.companyName,
                email: newCompany.companyEmail,
                role: newCompany.role
            }
        });

    } catch (err) {
        console.log("Error in registerCompanyController:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const loginCompanyController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { companyEmail, password } = req.body;

        const existingCompany = await companyModel.findOne({ companyEmail });
        if (!existingCompany) {
            return res.status(404).json({ message: "Company not found" });
        }

        const isCorrectPassword = await existingCompany.comparePassword(password);
        if (!isCorrectPassword) {
            return res.status(400).json({ message: "Email or password is incorrect" });
        }

        const token = existingCompany.generateAuthToken();
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        });
        await sendCompanyLoginEmail(existingCompany.companyEmail, existingCompany.companyName);
        await sendWhatsAppLogin(existingCompany.companyPhone, existingCompany.companyName, "Company");
        await sendNotification({
            role: "company",
            type: "activity",
            title: "Login Alert",
            message: `Hi ${existingCompany.companyName}, your account was just logged in.`,
            relatedBookingId: "N/A",
            relatedUserId: existingCompany._id.toString(),
            deliveryMode: "pending",
            metadata: {
                loginTime: new Date().toISOString()
            }
        });
        res.status(200).json({
            message: "Company logged in successfully",
            company: existingCompany
        });

        req.user = existingCompany;
    } catch (err) {
        console.log("Error in loginCompanyController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logoutCompanyController = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            path: '/'
        });
        res.status(200).json({ message: "Company logged out successfully" });
    } catch (err) {
        console.log("Error in logoutCompanyController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getCompanyProfileController = async (req, res) => {
    try {
        const companyId = req.user?._id;

        if (!companyId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const company = await companyModel.findById(companyId).select("-password");
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.status(200).json({ company });
    } catch (err) {
        console.log("Error in getCompanyProfileController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const uploadCompanyCertificationsController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const companyId = req.user?._id;

        if (!companyId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const company = await companyModel.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const files = req.files;

        if (
            !files ||
            (!files.idProof?.[0] && !files.businessLicense?.[0] && !files.gstCertificate?.[0])
        ) {
            return res.status(400).json({ message: "At least one document must be uploaded" });
        }

        if (files.idProof?.[0]) {
            company.documents.idProof = files.idProof[0].path;
        }

        if (files.businessLicense?.[0]) {
            company.documents.businessLicense = files.businessLicense[0].path;
        }

        if (files.gstCertificate?.[0]) {
            company.documents.gstCertificate = files.gstCertificate[0].path;
        }

        await company.save();
        await sendNotification({
            role: "company",
            type: "task",
            title: "Documents Uploaded",
            message: "Your company documents were successfully uploaded.",
            relatedBookingId: "DOC_UPLOAD",
            relatedUserId: company._id.toString(),
            deliveryMode: "completed",
            metadata: {
                uploadedDocs: Object.keys(files).filter(key => files[key]?.length > 0)
            }
        });

        res.status(200).json({
            message: "Documents uploaded successfully",
            documents: company.documents
        });
    } catch (err) {
        console.log("Error in uploadCompanyCertificationsController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getCompanyCertificationsController = async (req, res) => {
    try {
        const companyId = req.user?._id;

        if (!companyId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const company = await companyModel.findById(companyId).select("documents");
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.status(200).json({ documents: company.documents });
    } catch (err) {
        console.log("Error in getCompanyCertificationsController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteCompanyCertificationsController = async (req, res) => {  
    try {
        const companyId = req.user?._id;

        if (!companyId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const company = await companyModel.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const docs = company.documents || {};
        const docKeys = ["idProof", "businessLicense", "gstCertificate"];

        for (const key of docKeys) {
            const filePath = docs[key];
            if (filePath && fs.existsSync(filePath)) {
                try {
                    await fsPromises.unlink(filePath);
                } catch (err) {
                    console.error(`Error deleting ${key}:`, err.message);
                }
                company.documents[key] = undefined;
            }   
        }

        await company.save();
        await sendNotification({
            role: "company",
            type: "alert",
            title: "Documents Deleted",
            message: "Your uploaded company documents have been deleted.",
            relatedBookingId: "DOC_DELETE",
            relatedUserId: company._id.toString(),
            deliveryMode: "completed"
        });

        res.status(200).json({
            message: "All documents deleted successfully",
            documents: company.documents
        });

    } catch (err) {
        console.log("Error in deleteCompanyCertificationsController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateCompanyProfileController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const companyId = req.user?._id;
        if (!companyId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const updates = req.body;

        const company = await companyModel.findById(companyId).select("-password");
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        // Scalar field updates
        if (updates.companyName !== undefined) company.companyName = updates.companyName;
        if (updates.industry !== undefined) company.industry = updates.industry;
        if (updates.registrationNumber !== undefined) company.registrationNumber = updates.registrationNumber;
        if (updates.companyPhone !== undefined) company.companyPhone = updates.companyPhone;
        if (updates.companyEmail !== undefined) company.companyEmail = updates.companyEmail.toLowerCase();

        // Nested updates with spread (preserves existing values)
        if (updates.contactPerson) {
            company.contactPerson = {
                ...company.contactPerson,
                ...updates.contactPerson,
            };
        }

        if (updates.address) {
            company.address = {
                ...company.address,
                ...updates.address,
            };
        }

        await company.save();
        await sendNotification({
            role: "company",
            type: "task",
            title: "Profile Updated",
            message: "Your company profile was successfully updated.",
            relatedBookingId: "PROFILE_UPDATE", 
            relatedUserId: company._id.toString(),
            deliveryMode: "completed",
            metadata: {
                updatedFields: Object.keys(updates)
            }
        });
        res.status(200).json({
            message: "Company profile updated successfully",
            company: {
                _id: company._id,
                companyName: company.companyName,
                companyEmail: company.companyEmail,
                industry: company.industry,
                registrationNumber: company.registrationNumber,
                companyPhone: company.companyPhone,
                contactPerson: company.contactPerson,
                address: company.address
            }
        });
    } catch (err) {
        console.log("Error in updateCompanyProfileController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getTruckSuggestionsController = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.customerId.toString() !== req.user?._id.toString()) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const { weightInKg, volumeInCubicMeters } = order.loadDetails || {};
        if (!weightInKg || !volumeInCubicMeters) {
            return res.status(400).json({ message: "Incomplete load details in the order" });
        }

        const suggestedTrucks = await truckModel.find({
            capacityInKg: { $gte: weightInKg },
            capacityInCubicMeters: { $gte: volumeInCubicMeters },
            status: "inactive"
        }).limit(10);

        res.status(200).json({ suggestedTrucks });
    } catch (err) {
        console.log("Error in getTruckSuggestionsController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};  

export const uploadEwayBillController = async (req, res) => {
  try {
    const companyId = req.user?._id;
    const { orderId } = req.params;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.customerId.toString() !== companyId.toString()) {
      return res.status(403).json({ message: "Unauthorized to upload eWay Bill on this order" });
    }

    const files = req.files;
    const { billNumber } = req.body;

    if (!files || !files.eWayBill) {
      return res.status(400).json({ message: "E-Way Bill file is required" });
    }

    const eWayBillFile = req.files.eWayBill[0];

    order.documents.eWayBill = {
      fileURL: eWayBillFile.path,
      billNumber: billNumber,
      uploadedAt: new Date()
    };

    await order.save();
    const notificationPayload = {
      relatedBookingId: orderId,
      type: "task",
      title: "E-Way Bill Uploaded",
      message: `E-Way Bill (${billNumber}) has been uploaded for Order #${orderId}`,
    };

    // To company (uploader)
    await sendNotification({
      ...notificationPayload,
      role: "company",
      relatedUserId: companyId.toString(),
    });

    // To transporter
    if (order.transporterId) {
      await sendNotification({
        ...notificationPayload,
        role: "transporter",
        relatedUserId: order.transporterId.toString(),
      });
    }

    // To driver
    if (order.driverId) {
      await sendNotification({
        ...notificationPayload,
        role: "driver",
        relatedUserId: order.driverId.toString(),
      });
    }

    res.status(200).json({
      message: "E Way Bill uploaded successfully",
      eWayBill: order.documents.eWayBill
    });

  } catch (err) {
    console.log("Error in uploadEwayBillController: ", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAvailableTrucksController = async (req, res) => {
    try {
        const availableTrucks = await truckModel.find({ status: "active" });

        if (!availableTrucks.length) {
            return res.status(404).json({ message: "No available trucks at the moment" });
        }

        res.status(200).json({ availableTrucks });
    } catch (err) {
        console.log("Error in getAvailableTrucksController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const filterTrucksController = async (req, res) => {
    try {
        const {
            status,
            vehicleType,
            transporterId,
            minCapacityInTon,
            maxCapacityInTon,
            minVolumeInCubicMeters,
            maxVolumeInCubicMeters,
            page = 1,
            limit = 10
        } = req.query;

        const query = {};

        if (status) query.status = status;
        if (vehicleType) query.vehicleType = vehicleType;
        if (transporterId) query.transporterId = transporterId;

        if (minVolumeInCubicMeters || maxVolumeInCubicMeters) {
            query.capacityInCubicMeters = {};
            if (minVolumeInCubicMeters) query.capacityInCubicMeters.$gte = Number(minVolumeInCubicMeters);
            if (maxVolumeInCubicMeters) query.capacityInCubicMeters.$lte = Number(maxVolumeInCubicMeters);
            if (Object.keys(query.capacityInCubicMeters).length === 0) delete query.capacityInCubicMeters;
        }

        if (minCapacityInTon || maxCapacityInTon) {
            query.capacityInTon = {};
            if (minCapacityInTon) query.capacityInTon.$gte = Number(minCapacityInTon);
            if (maxCapacityInTon) query.capacityInTon.$lte = Number(maxCapacityInTon);
            if (Object.keys(query.capacityInTon).length === 0) delete query.capacityInTon;
        }

        const skip = (page - 1) * limit;

        const filteredTrucks = await truckModel
            .find(query)
            .skip(skip)
            .limit(Number(limit));

        res.status(200).json({ filteredTrucks });
    } catch (err) {
        console.log("Error in filterTrucksController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getDriverByTruckController = async (req, res) => {
    try {
        const { truckId } = req.params;

        const driver = await driverModel.findOne({ assignedTruckId: truckId }).select("-password");
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        res.status(200).json({ driver });
    } catch (err) {
        console.log("Error in getDriverByTruckController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};