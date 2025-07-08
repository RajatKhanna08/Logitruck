import transporterModel from "../models/transporterModel";

export const registerTransporterController = async (req, res) => {
    try {
        
    }
    catch(err){
        console.log("Error in registerTransporterController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const loginTransporterController = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const existingTransporter = await transporterModel.findOne({ email:email });
        if(!existingTransporter){
            return res.status(404).json({ message: "Transporter Not Found" });
        }

        const isPasswordCorrect = existingTransporter.comparePassword(password);
        if(!isPasswordCorrect){
            return res.status(400).json({ message: "Username or paswword incorrect" });
        }

        const token = existingTransporter.generateAuthToken();
        res.cookie("jwt", token);
        res.status(200).json({ message: "Logged in Successfully" });
    }
    catch(err){
        console.log("Error in loginTransporterController: ", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

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
        
    }
    catch(err){
        console.log("Error in getTransporterProfileController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const uploadTransporterCertificationsController = async (req, res) => {
    try {
        
    }
    catch(err){
        console.log("Error in registerTransporterController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getTransporterCertificationsController = async (req, res) => {
    try {
        
    }
    catch(err){
        console.log("Error in registerTransporterController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteTransporterCertificationsController = async (req, res) => {
    try {
        
    }
    catch(err){
        console.log("Error in registerTransporterController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getTransporterDashboardController = async (req, res) => {
    try {
        
    }
    catch(err){
        console.log("Error in registerTransporterController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateTransporterProfileController = async (req, res) => {
    try {
        
    }
    catch(err){
        console.log("Error in registerTransporterController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateTransporterPersonController = async (req, res) => {
    try {
        
    }
    catch(err){
        console.log("Error in registerTransporterController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const addTruckController = async (req, res) => {
    try {
        
    }
    catch(err){
        console.log("Error in registerTransporterController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getMyTrucksController = async (req, res) => {
    try {
        
    }
    catch(err){
        console.log("Error in registerTransporterController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getTruckByIdController = async (req, res) => {
    try {
        
    }
    catch(err){
        console.log("Error in registerTransporterController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateTruckDetailsController = async (req, res) => {
    try {
        
    }
    catch(err){
        console.log("Error in registerTransporterController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const uploadTruckDocumentsController = async (req, res) => {
    try {
        
    }
    catch(err){
        console.log("Error in registerTransporterController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateDriverReferenceController = async (req, res) => {
    try {
        
    }
    catch(err){
        console.log("Error in registerTransporterController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const activateTruckWithDriverController = async (req, res) => {
    try {
        
    }
    catch(err){
        console.log("Error in registerTransporterController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deactivateTruckWithDriverController = async (req, res) => {
    try {
        
    }
    catch(err){
        console.log("Error in registerTransporterController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteTruckController = async (req, res) => {
    try {
        
    }
    catch(err){
        console.log("Error in registerTransporterController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getMyDriversController = async (req, res) => {
    try {
        
    }
    catch(err){
        console.log("Error in registerTransporterController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getDriverByIdController = async (req, res) => {
    try {
        
    }
    catch(err){
        console.log("Error in registerTransporterController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const removeDriverController = async (req, res) => {
    try {
        
    }
    catch(err){
        console.log("Error in registerTransporterController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const uploadBiltyController = async (req, res) => {
    try {
        
    }
    catch(err){
        console.log("Error in registerTransporterController:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }   
}