import { validationResult } from "express-validator";
import companyModel from "../models/companyModel";

export const registerCompanyController = async (req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({ errors: errors.array() });
        }

        const {
            companyName,
            companyEmail,
            companyPhone,
            password,
            address,
            registrationNumber,
            industry,
            contactPerson,
            documents
        } = req.body;

        const existingCompany = await companyModel.findOne({ companyEmail: companyEmail });
        if(existingCompany){
            return res.status(400).json({ message: "Email already exists" });
        }

        const files = req.files;
        if(!files || !files.idProof || !files.businessLicense || !files.gstCertificate){
            return res.status(400).json({ message: "All documents are required: ID Proof, Business License and GST Certificate" });
        }

        const hashedPassword = companyModel.hashPassword(password);
        const newCompany = await companyModel.create({
            companyName: companyName,
            companyEmail: companyEmail,
            companyPhone: companyPhone,
            password: hashedPassword,
            contactPerson: JSON.parse(contactPerson),
            address: JSON.parse(address),
            documents: {
                idProof: files.idProof[0].path,
                businesLicense: files.businessLicense[0].path,
                gstCertificate: files.gstCertificate[0].path
            },
            registrationNumber: registrationNumber,
            industry: industry
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
                email: newCompany.companyEmail
            }
        });
    }
    catch(err){
        console.log("Error in registerCompanyController", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const loginCompanyController = async (req, res) => {

}

export const logoutCompanyController = async (req, res) => {

}

export const getCompanyProfileController = async (req, res) => {
    
}

export const uploadCompanyCertificationsController = async (req, res) => {

}

export const getCompanyCertificationsController = async (req, res) => {

}

export const deleteCompanyCertificationsController = async (req, res) => {

}

export const updateCompanyProfileController = async (req, res) => {

}

export const updateCompanyPersonController = async  (req, res) => {

}

export const getTruckSuggestionsController = async (req, res) => {

}

export const uploadEwayBillController = async (req, res) => {

}

export const getAvailableTrucksController = async (req, res) => {

}

export const filterTrucksController = async (req, res) => {

}

export const getDriverByTruckController = async (req, res) => {
    
}