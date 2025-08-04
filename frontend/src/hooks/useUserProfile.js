import { useQuery } from '@tanstack/react-query';

import { axiosInstance } from '../lib/axios.js';
import { useUserStore } from '../store/useUserStore.js';

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
            if (err.response?.status === 401 || err.response?.status === 404) {
                continue;
            } else {
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
            try{
                const data = await fetchUserProfile();
                setUser(data);
                return data;
            }
            catch(err){
                console.log(err);
            }
        },
        staleTime: 1000 * 60 * 5,
        retry: false,
        refetchOnWindowFocus: false
    });
};