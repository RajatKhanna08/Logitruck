import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '../lib/axios.js';

const fetchUserProfile = async () => {
    const endpoints = [
        '/company/profile',
        '/transporter/profile',
        '/driver/profile',
        '/admin/profile'
    ];

    for (let endpoint of endpoints) {
        try {
            const res = await axiosInstance.get(endpoint, { withCredentials: true });
            
            if (res.data) {
                return { ...res.data, role: endpoint.split('/')[1] };
            }
        }
        catch(err){
            console.warn(`Failed to fetch from ${endpoint}:`, err.response?.status);
        }
    }

    throw new Error("No active users found");
};

export const useUserProfile = () => {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: fetchUserProfile,
        staleTime: 1000 * 60 * 5,
        retry: false
    });
};