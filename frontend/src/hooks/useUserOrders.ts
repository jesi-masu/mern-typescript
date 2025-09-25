// src/hooks/useUserOrders.ts

import { useQuery } from "@tanstack/react-query";
import { Order } from "@/types/order"; // Corrected path

const fetchUserOrders = async (token: string | null): Promise<Order[]> => {
  if (!token) throw new Error("Authentication token not found.");

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch orders.");
  }

  return response.json();
};

export const useUserOrders = (
  userId: string | undefined,
  token: string | null
) => {
  return useQuery<Order[]>({
    queryKey: ["userOrders", userId],
    queryFn: () => fetchUserOrders(token),
    enabled: !!userId,
  });
};
