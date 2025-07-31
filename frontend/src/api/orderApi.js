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
    const response = await axios.post(`${API_BASE_URL}/api/orders/book`, orderData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
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