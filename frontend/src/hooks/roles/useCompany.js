import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../../store/useUserStore.js"
import { useNavigate } from "react-router-dom";
import { loginCompany, registerCompany } from "../../api/companyApi.js";

export const useRegisterCompany = () => {
    const setUser = useUserStore((state) => state.setUser);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return (useMutation({
        mutationFn: registerCompany,
        
        onSuccess: async () => {
            try{
                const profile = await queryClient.invalidateQueries(['userProfile']);
                setUser(profile);
                navigate('/');
            }
            catch(err){
                console.log("Failed to fetch profile after signup", err.data.message);
                throw err;
            }
        },

        onError: (err) => {
            console.log("Signup failed: ", err.message);
            alert("Signup failed. Please try again");
        }
    }));
};

export const useLoginCompany = () => {
    const setUser = useUserStore((state) => state.setUser);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: loginCompany,

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