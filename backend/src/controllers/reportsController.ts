import { RequestHandler } from "express";
import Order from "../models/orderModel";
import mongoose from "mongoose";

const calculateChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  const growth = ((current - previous) / previous) * 100;
  return parseFloat(growth.toFixed(2));
};

export const getReportSummary: RequestHandler = async (req, res) => {
  try {
    const year = req.query.year
      ? parseInt(req.query.year as string)
      : new Date().getFullYear();
    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
    const prevYearStartDate = new Date(`${year - 1}-01-01T00:00:00.000Z`);
    const prevYearEndDate = new Date(`${year - 1}-12-31T23:59:59.999Z`);

    const currentYearPromise = Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          orderStatus: "Completed",
        },
      },
      {
        $facet: {
          kpi: [
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$totalAmount" },
                totalOrders: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                totalRevenue: 1,
                totalOrders: 1,
                averageOrderValue: {
                  $cond: [
                    { $eq: ["$totalOrders", 0] },
                    0,
                    { $divide: ["$totalRevenue", "$totalOrders"] },
                  ],
                },
              },
            },
          ],
          salesByDay: [
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                revenue: { $sum: "$totalAmount" },
                orders: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                period: "$_id",
                revenue: 1,
                orders: 1,
                avgOrderValue: {
                  $cond: [
                    { $eq: ["$orders", 0] },
                    0,
                    { $divide: ["$revenue", "$orders"] },
                  ],
                },
              },
            },
            { $sort: { period: 1 } },
          ],
          salesByWeek: [
            {
              $group: {
                _id: { $isoWeek: "$createdAt" },
                revenue: { $sum: "$totalAmount" },
                orders: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                period: "$_id",
                revenue: 1,
                orders: 1,
                avgOrderValue: {
                  $cond: [
                    { $eq: ["$orders", 0] },
                    0,
                    { $divide: ["$revenue", "$orders"] },
                  ],
                },
              },
            },
            { $sort: { period: 1 } },
          ],
          salesByMonth: [
            {
              $group: {
                _id: { $month: "$createdAt" },
                revenue: { $sum: "$totalAmount" },
                orders: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                period: "$_id",
                revenue: 1,
                orders: 1,
                avgOrderValue: {
                  $cond: [
                    { $eq: ["$orders", 0] },
                    0,
                    { $divide: ["$revenue", "$orders"] },
                  ],
                },
              },
            },
            { $sort: { period: 1 } },
          ],
          salesByYear: [
            {
              $group: {
                _id: { $year: "$createdAt" },
                revenue: { $sum: "$totalAmount" },
                orders: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                period: "$_id",
                revenue: 1,
                orders: 1,
                avgOrderValue: {
                  $cond: [
                    { $eq: ["$orders", 0] },
                    0,
                    { $divide: ["$revenue", "$orders"] },
                  ],
                },
              },
            },
            { $sort: { period: 1 } },
          ],
          productPerformance: [
            { $unwind: "$products" },
            {
              $group: {
                _id: "$products.productId",
                quantity: { $sum: "$products.quantity" },
              },
            },
            {
              $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productDetails",
              },
            },
            { $unwind: "$productDetails" },
            {
              $project: {
                _id: 0,
                productId: "$_id",
                name: "$productDetails.productName",
                quantity: "$quantity",
                revenue: {
                  $multiply: ["$quantity", "$productDetails.productPrice"],
                },
              },
            },
            { $sort: { revenue: -1 } },
            { $limit: 10 },
          ],
        },
      },
    ]);

    const previousYearPromise = Order.aggregate([
      {
        $match: {
          createdAt: { $gte: prevYearStartDate, $lte: prevYearEndDate },
          orderStatus: "Completed",
        },
      },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);

    const [summaryResult, prevYearResult] = await Promise.all([
      currentYearPromise,
      previousYearPromise,
    ]);

    const summary = summaryResult[0];
    const prevYearData = prevYearResult[0] || { totalRevenue: 0 };
    const currentYearKpi = summary.kpi[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
    };
    const yoyGrowth = calculateChange(
      currentYearKpi.totalRevenue,
      prevYearData.totalRevenue
    );

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const formattedMonthlyData = monthNames.map((name, index) => {
      const monthNumber = index + 1;
      const dataForMonth = summary.salesByMonth.find(
        (m: any) => m.period === monthNumber
      );
      return {
        period: name,
        revenue: dataForMonth?.revenue || 0,
        orders: dataForMonth?.orders || 0,
        avgOrderValue: dataForMonth?.avgOrderValue || 0,
      };
    });

    const result = {
      kpi: currentYearKpi,
      yoyGrowth: yoyGrowth,
      salesByDay: summary.salesByDay,
      salesByWeek: summary.salesByWeek,
      monthlyData: formattedMonthlyData, // Renamed for clarity
      salesByYear: summary.salesByYear,
      productPerformance: summary.productPerformance,
    };
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error fetching report summary:", error);
    res.status(500).json({ message: "Failed to fetch report summary" });
  }
};
