import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../../store/useUserStore";
import { useNavigate } from "react-router-dom";
import { loginTransporter, registerTransporter } from "../../api/transporterApi";

export const useRegisterTransporter = () => {
    const setUser = useUserStore((state) => state.setUser);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return (useMutation({
        mutationFn: registerTransporter,
        onSuccess: async () => {
            try{
                const profile = await queryClient.invalidateQueries(['userProfile']);
                setUser(profile);
                navigate('/');
            }
            catch(err){
                console.log("Failed to fetch profile after signup", err.data.message);
            }
        },

        onError: (err) => {
            console.log("Signup failed: ", err.message);
            alert("Signup failed. Please try again");
        }
    }));
};

export const useLoginTransporter = () => {
    const setUser = useUserStore((state) => state.setUser);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: loginTransporter,

        onSuccess: async () => {
            try{
                const profile = await queryClient.invalidateQueries(['userProfile']);
                setUser(profile);
                navigate('/');
            }
            catch(err){
                console.log("Failed to fetch company profile after login: ", err.message);
            }
        },

        onError: (err) => {
            console.log("Login failed: ", err.message);
            alert("Login failed. Please check your credentials");
        } 
    });
};