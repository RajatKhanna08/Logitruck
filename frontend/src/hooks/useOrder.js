import { useQuery } from "@tanstack/react-query"
import { getAllOrders } from "../api/orderApi"

export const useOrders = () =>{
    return useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const orders = await getAllOrders();
            console.log(orders);
            return orders;
        }
    })
}