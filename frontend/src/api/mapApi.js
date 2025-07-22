import { axiosInstance } from "../lib/axios"

export const getPolyline = async ({ pickup, drop, stops = [] }) => {
    const res = await axiosInstance.post('/map/full-route', {
        pickup, drop, stops
    });
    return res.data;
}