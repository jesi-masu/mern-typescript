import { Order, OrderStatus } from "@/types/order"; // We will create this type file next

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

// Helper to get the auth token from localStorage
const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

// Standardized function to handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "An unknown error occurred",
    }));
    throw new Error(errorData.message || response.statusText);
  }
  return response.json();
}

/**
 * Fetches all orders from the backend. Requires admin/personnel authentication.
 * @returns {Promise<Order[]>} A promise that resolves to an array of all orders.
 */
export const fetchAllOrders = async (): Promise<Order[]> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token not found.");

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
  updateData: { orderStatus?: OrderStatus; paymentStatus?: string }
): Promise<Order> => {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token not found.");

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
