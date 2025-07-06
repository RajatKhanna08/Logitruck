export const registerCompanyController = async (req, res) => {
    try{

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