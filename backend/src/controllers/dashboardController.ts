// backend/src/controllers/dashboardController.ts

import { RequestHandler } from "express";
import Order from "../models/orderModel";
import User from "../models/userModel";
import mongoose from "mongoose";

// Helper function to calculate percentage change
const calculateChange = (current: number, previous: number): number => {
  if (previous === 0) {
    return current > 0 ? 100 : 0; // Avoid division by zero
  }
  return parseFloat((((current - previous) / previous) * 100).toFixed(2));
};

export const getDashboardStats: RequestHandler = async (req, res) => {
  try {
    const today = new Date();
    const oneMonthAgo = new Date(new Date().setMonth(today.getMonth() - 1));
    const twoMonthsAgo = new Date(new Date().setMonth(today.getMonth() - 2));

    // --- AGGREGATION PIPELINES ---

    // 1. Revenue Aggregation
    const revenuePromise = Order.aggregate([
      { $match: { orderStatus: "Completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          // Revenue in the last month
          lastMonthRevenue: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", oneMonthAgo] }, "$totalAmount", 0],
            },
          },
          // Revenue in the month before that
          previousMonthRevenue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$createdAt", twoMonthsAgo] },
                    { $lt: ["$createdAt", oneMonthAgo] },
                  ],
                },
                "$totalAmount",
                0,
              ],
            },
          },
        },
      },
    ]);

    // 2. Products Sold Aggregation
    const productsSoldPromise = Order.aggregate([
      { $match: { orderStatus: "Completed" } },
      { $unwind: "$products" }, // Deconstruct the products array
      {
        $group: {
          _id: null,
          totalProductsSold: { $sum: "$products.quantity" },
          // Products sold in the last month
          lastMonthProductsSold: {
            $sum: {
              $cond: [
                { $gte: ["$createdAt", oneMonthAgo] },
                "$products.quantity",
                0,
              ],
            },
          },
          // Products sold in the month before that
          previousMonthProductsSold: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$createdAt", twoMonthsAgo] },
                    { $lt: ["$createdAt", oneMonthAgo] },
                  ],
                },
                "$products.quantity",
                0,
              ],
            },
          },
        },
      },
    ]);

    // --- COUNT QUERIES ---

    // 3. Active Orders Count
    const activeOrdersPromise = Order.countDocuments({
      orderStatus: { $nin: ["Completed", "Cancelled"] },
    });

    // 4. Total Customers Count (role: 'client')
    const totalCustomersPromise = User.countDocuments({ role: "client" });

    // 5. Customer changes (new customers in last 30 days vs previous 30 days)
    const lastMonthCustomersPromise = User.countDocuments({
      role: "client",
      createdAt: { $gte: oneMonthAgo },
    });
    const previousMonthCustomersPromise = User.countDocuments({
      role: "client",
      createdAt: { $gte: twoMonthsAgo, $lt: oneMonthAgo },
    });

    // 6. Active Order changes
    const lastMonthOrdersPromise = Order.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    const previousMonthOrdersPromise = Order.countDocuments({
      createdAt: { $gte: twoMonthsAgo, $lt: oneMonthAgo },
    });

    // --- EXECUTE ALL PROMISES CONCURRENTLY ---
    const [
      revenueData,
      productsSoldData,
      activeOrders,
      totalCustomers,
      lastMonthCustomers,
      previousMonthCustomers,
      lastMonthOrders,
      previousMonthOrders,
    ] = await Promise.all([
      revenuePromise,
      productsSoldPromise,
      activeOrdersPromise,
      totalCustomersPromise,
      lastMonthCustomersPromise,
      previousMonthCustomersPromise,
      lastMonthOrdersPromise,
      previousMonthOrdersPromise,
    ]);

    // --- PARSE RESULTS AND CALCULATE CHANGES ---
    const revenue = revenueData[0] || {};
    const productsSold = productsSoldData[0] || {};

    const stats = {
      totalRevenue: revenue.totalRevenue || 0,
      activeOrders: activeOrders || 0,
      totalCustomers: totalCustomers || 0,
      productsSold: productsSold.totalProductsSold || 0,
      revenueChange: calculateChange(
        revenue.lastMonthRevenue || 0,
        revenue.previousMonthRevenue || 0
      ),
      ordersChange: calculateChange(
        lastMonthOrders || 0,
        previousMonthOrders || 0
      ),
      customersChange: calculateChange(
        lastMonthCustomers || 0,
        previousMonthCustomers || 0
      ),
      productsChange: calculateChange(
        productsSold.lastMonthProductsSold || 0,
        productsSold.previousMonthProductsSold || 0
      ),
    };

    res.status(200).json(stats);
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error fetching dashboard stats." });
  }
};
