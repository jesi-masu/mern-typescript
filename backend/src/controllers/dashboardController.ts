import { RequestHandler } from "express";

/**
 * Minimal dashboard stats endpoint.
 * Protected by authMiddleware + checkRole(["admin","personnel"])
 *
 * Important: do NOT `return res.status(...).json(...)` because that makes the async
 * function return a `Response` which is not assignable to Express's expected
 * handler return type (void | Promise<void>). Instead call res.status(...).json(...)
 * and then `return;` so the function's Promise resolves to void.
 */
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
