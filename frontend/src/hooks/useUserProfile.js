import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '../lib/axios.js';
import { useUserStore } from '../store/userUserStore.js';

const fetchUserProfile = async () => {
    const endpoints = [
        '/company/profile',
        '/transporter/profile',
        '/driver/profile',
        '/admin/profile'
    ];

    for (let endpoint of endpoints) {
        try{
            const res = await axiosInstance.get(endpoint, { withCredentials: true });
            if (res.data) {
                return { ...res.data, role: endpoint.split('/')[1] };
            }
          }
        catch(err){
            if (err.response?.status === 401) {
              // Do NOT retry if unauthorized — skip to next
                continue;
            } else {
              // Other errors should stop the query
                throw err;
            }
        }
    }

      // No user found
      return null;
};

export const useUserProfile = () => {
    const setUser = useUserStore((state) => state.setUser);

    return useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const data = await fetchUserProfile();
            setUser(data);
            return data;
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
        refetchOnWindowFocus: false
    });
};