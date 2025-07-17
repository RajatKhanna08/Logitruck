import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../../store/useUserStore"
import { useNavigate } from "react-router-dom";
import { loginDriver, registerDriver } from "../../api/driverApi";

export const useRegisterDriver = () => {
    const setUser = useUserStore((state) => state.setUser);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return (useMutation({
        mutationFn: registerDriver,

        onSuccess: async () => {
            try{
                const profile = await queryClient.invalidateQueries(['userProfile']);
                setUser(profile);
                navigate('/');
            }
            catch(err){
                console.log("Failed to fetch profile after signup: ", err);
            }
        },

        onError: (err) => {
            console.log("Signup failed: ", err.message);
            alert("Signup failed. Please try again");
        }
    }));
}

export const useLoginDriver = async () => {
    const setUser = useUserStore((state) => state.setUser);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return (useMutation({
        mutationFn: loginDriver,

        onSuccess: async () => {
            try{
                const profile = queryClient.invalidateQueries(['userProfile']);
                setUser(profile);
                navigate('/');
            }
            catch(err){
                console.log("Failed to fetch profile after login", err);
            }
        },

        onError: (err) => {
            console.log("Login failed: ", err.message);
            alert("Login failed. Please try again");
        }
    }));
}