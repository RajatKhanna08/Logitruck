import axios from 'axios';
import { axiosInstance } from "../lib/axios";

export const getAllOrders = async () => {
    try{
        const res = await axiosInstance.get("/order/company/all-orders");
        return res.data.allOrders;
    }
    catch(err){
        console.log("Error in getAllOrders: ", err.message);
        throw err;
    }
}

export const bookOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post('/order/create', orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getLiveLocation = async (orderId) => {
    const res  = await axiosInstance.get(`/order/company/track/${orderId}`);
    return res.data;
}

export const updateLiveLocation = async ({ orderId, lat, lng }) => {
    const res = await axiosInstance.post(`/order/company/track/${orderId}`, {
        latitude: lat,
        longitude: lng
    });

    return res.data;
}

export const getOrderById = async (orderId) => {
    try {
        const res = await axiosInstance.get(`/order/company/order/${orderId}`);
        if (!res.data || !res.data.data) {
            throw new Error('Invalid response format from server');
        }
        console.log('API Response:', res.data); // Debug log
        return res.data.data;
    } catch (error) {
        console.error('Error in getOrderById:', error);
        throw error.message || 'Failed to fetch order details';
    }
};

export const initiatePayment = async (orderId) => {
    try {
        const res = await axiosInstance.post(`/order/company/payment/initiate/${orderId}`);
        return res.data;
    } catch (error) {
        throw error.message;
    }
};