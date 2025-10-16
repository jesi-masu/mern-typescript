// src/services/orderService.ts

import { Order, OrderStatus, PaymentStatus } from "@/types/order";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// Helper to get the auth token from the correct localStorage key
const getAuthToken = (): string | null => {
  try {
    // Your main AuthContext stores the token under the key "token"
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

// Standardized function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: "An unknown error occurred",
    }));
    throw new Error(errorData.error || response.statusText);
  }
  return response.json();
}

/**
 * Fetches all orders from the backend. Requires admin/personnel authentication.
 * @returns {Promise<Order[]>} A promise that resolves to an array of all orders.
 */
export const fetchAllOrders = async (): Promise<Order[]> => {
  const token = getAuthToken();
  if (!token) {
    // This will be caught by useQuery and displayed as an error
    throw new Error("Authentication token not found. Please log in again.");
  }

  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

/**
 * Updates an order's status and/or payment status. Requires admin/personnel authentication.
 * @param {string} orderId - The ID of the order to update.
 * @param {object} updateData - The data to update (e.g., { orderStatus: "Shipped" }).
 * @returns {Promise<Order>} A promise that resolves to the updated order.
 */
export const updateOrderStatusAdmin = async (
  orderId: string,
  updateData: { orderStatus?: OrderStatus; paymentStatus?: PaymentStatus }
): Promise<Order> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }

  const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
  return handleResponse(response);
};
