import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Order } from "@/types/order"; // Corrected path
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

// --- This is your existing function (NO CHANGE) ---
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

// --- This is your existing hook (NO CHANGE) ---
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

// ==========================================================
// "CANCEL RESERVATION" LOGIC
// ==========================================================

// --- This is your new API call function (NO CHANGE) ---
const fetchCancelReservation = async (
  orderId: string,
  token: string | null
): Promise<Order> => {
  if (!token) throw new Error("Authentication token not found.");

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/cancel`, // The new endpoint
    {
      method: "PATCH", // Use PATCH as defined in our backend route
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    // Try to get a specific error message from the backend
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to cancel reservation.");
  }

  return response.json();
};

// --- This is your new hook (NOW 100% FIXED) ---
export const useCancelReservation = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient(); // This is used to refresh your order list

  // ✏️ 1. WRAP EVERYTHING in a single object for useMutation
  return useMutation({
    // ✏️ 2. The function is now a property: 'mutationFn'
    mutationFn: (orderId: string) => fetchCancelReservation(orderId, token),

    // This runs on success
    onSuccess: () => {
      // ✏️ 3. 'invalidateQueries' MUST also be an object in v5
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });

      toast({
        title: "Reservation Cancelled",
        description: "Your reservation has been successfully cancelled.",
      });
    },

    // This runs if the fetch function throws an error
    onError: (error: Error) => {
      toast({
        title: "Cancellation Failed",
        description: error.message || "There was an error. Please try again.",
        variant: "destructive",
      });
    },
  });
};
