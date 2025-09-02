// backend/src/controllers/dashboardController.ts
import { RequestHandler } from "express";
export const getDashboardStats: RequestHandler = async (req, res) => {
  try {
    // Example static values — replace with DB queries/aggregations later.
    const stats = {
      totalRevenue: 0,
      activeOrders: 0,
      totalCustomers: 0,
      productsSold: 0,
      revenueChange: 0,
      ordersChange: 0,
      customersChange: 0,
      productsChange: 0,
    };

    const requester = (req as any).user || {};

    res.status(200).json({ ...stats, requester });
    return;
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Server error" });
    return;
  }
};
