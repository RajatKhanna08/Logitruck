import { axiosInstance } from "../lib/axios";

export const registerCompany = async (companyRegisterData) => {
    try{
        const res = await axiosInstance.post("/company/register" ,companyRegisterData);
        return res.data;
    }
    catch(err){
        console.log("Error in registerCompany: ", err.message);
    }
}

export const loginCompany = async (companyLoginData) => {
    try{
        const res = await axiosInstance.post("/company/login", companyLoginData);
        return res.data;
    }
    catch(err){
        console.log("Error in loginCompany: ", err.message);
    }
}

export const logoutCompany = async () => {
    try{
        const res = await axiosInstance.delete("/company/logout");
        return res.data;
    }
    catch(err){
        console.log("Error in logoutCompany: ", err.message);
    }
}

export const getCompanyProfile = async () => {
    try{
        const res = await axiosInstance.get("/company/profile");
        return res.data;
    }
    catch(err){
        console.log("Erorr in getCompanyProfile: " , err.message);l
    }
}

export const uploadCompanyCertificates = async (companyCertficates) => {
    try{
        const res = await axiosInstance.put("/company/certifications", companyCertficates);
        return res.data;
    }
    catch(err){
        console.log("Error in uploadCompanyCertificates: ", err.message);
    }
}

export const getCompanyCertificates = async (companyId) => {
    try{
        const res = await axiosInstance.get(`/company/certifications/${companyId}`);
        return res.data;
    }
    catch(err){
        console.log("Error in getCompanyCertificates: ", err.message);
    }
}

export const deleteCompanyCertificates = async (companyId) => {
    try{
        const res = await axiosInstance.delete(`/company/certifications/${companyId}`);
        return res.data;
    }
    catch(err){
        console.log("Error in deleteCompanyCertificates: ", err.message);
    }
}

export const upadteCompanyProfile = async (updatedCompanyData) => {
    try{
        const res = await axiosInstance.put("/company/profile", updatedCompanyData);
        return res.data;
    }
    catch(err){
        console.log("Error in updateCompanyProfile: ", err.messge);
    }
}

export const truckSuggestions = async (orderId) => {
    try{
        const res = await axiosInstance.get(`/company/suggestions/${orderId}`);
        return res.data;
    }
    catch(err){
        console.log("Error in truckSuggestions: ", err.message);
    }
}

export const uploadEWayBill = async (orderId, eWayBill) => {
    try{
        const res = await axiosInstance.put(`/company/order/eway/${orderId}`, eWayBill);
        return res.data;
    }
    catch(err){
        console.log("Error in uploadEWayBill: ", err.message);
    }
}

export const availableTrucks = async () => {
    try{
        const res = await axiosInstance.get("/company/trucks");
        return res.data;
    }
    catch(err){
        console.log("Error in availableTrucks: ", err.message);
    }
}

export const filterTrucks = async (filters) => {
    try{
        const res = await axiosInstance.get("/company/filter", filters);
        return res.data;
    }
    catch(err){
        console.log("Error in filterTrucks: ", err.message);
    }
}

export const driverByTruck = async (truckId) => {
    try{
        const res = await axiosInstance.get(`/company/driver/${truckId}`);
        return res.data;
    }
    catch(err){
        console.log("Error in driverByTruck: ", err.message);
    }
}
export const createOrder = async (orderData) => {
  try {
    const res = await axiosInstance.post("/order", orderData);
    return res.data;
  } catch (err) {
    console.log("Error in createOrder: ", err.message);
  }
};