import { Request, Response, RequestHandler } from "express";
import fs from "fs";
import csv from "csv-parser";
import mongoose from "mongoose";
import Order, { IOrder } from "../models/orderModel";
import User from "../models/userModel";
import Product from "../models/productModel";

const processCsv = (filePath: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
};

export const validateHistoricalOrders: RequestHandler = async (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded." });
    return;
  }
  const filePath = req.file.path;

  try {
    const rows = await processCsv(filePath);
    const errors: string[] = [];
    let validRecordCount = 0;

    const allProductIds = rows.flatMap((row) => {
      const ids = [];
      for (let i = 1; i <= 10; i++) {
        if (row[`product_id_${i}`]) ids.push(row[`product_id_${i}`]);
      }
      return ids;
    });

    const existingProducts = await Product.find({
      _id: { $in: allProductIds },
    }).select("_id");
    // ✅ FIX: Added '(p as any)' to assert the type and allow access to ._id
    const existingProductIds = new Set(
      existingProducts.map((p) => (p as any)._id.toString())
    );

    rows.forEach((row, index) => {
      let rowIsValid = true;
      if (!row.createdAt || isNaN(new Date(row.createdAt).getTime())) {
        errors.push(
          `Row ${index + 2}: 'createdAt' is missing or is not a valid date.`
        );
        rowIsValid = false;
      }
      if (!row.totalAmount || isNaN(parseFloat(row.totalAmount))) {
        errors.push(
          `Row ${index + 2}: 'totalAmount' is missing or is not a number.`
        );
        rowIsValid = false;
      }

      let hasProducts = false;
      for (let i = 1; i <= 10; i++) {
        const productId = row[`product_id_${i}`];
        if (productId) {
          hasProducts = true;
          if (!existingProductIds.has(productId)) {
            errors.push(
              `Row ${
                index + 2
              }: Product ID '${productId}' does not exist in the database.`
            );
            rowIsValid = false;
          }
        }
      }

      if (!hasProducts) {
        errors.push(
          `Row ${index + 2}: At least one product (product_id_1) is required.`
        );
        rowIsValid = false;
      }
      if (rowIsValid) validRecordCount++;
    });

    fs.unlinkSync(filePath);
    res
      .status(200)
      .json({ validRecordCount, totalRecords: rows.length, errors });
  } catch (error: any) {
    fs.unlinkSync(filePath);
    res
      .status(500)
      .json({ message: `Error during validation: ${error.message}` });
  }
};

export const importHistoricalOrders: RequestHandler = async (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded." });
    return;
  }

  const filePath = req.file.path;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const historicalUser = await User.findOne({
      email: "historicaldata@camcoprefab.com",
    }).session(session);
    if (!historicalUser) {
      throw new Error(
        "Placeholder user 'historicaldata@camcoprefab.com' not found."
      );
    }
    const historicalUserId = historicalUser._id as mongoose.Types.ObjectId;

    const rows = await processCsv(filePath);
    const ordersToCreate = rows.map((row) => {
      const products = [];
      for (let i = 1; i <= 10; i++) {
        if (row[`product_id_${i}`] && row[`quantity_${i}`]) {
          products.push({
            productId: row[`product_id_${i}`],
            quantity: parseInt(row[`quantity_${i}`], 10),
          });
        }
      }

      const newOrder: Partial<IOrder> = {
        userId: historicalUserId,
        products,
        totalAmount: parseFloat(row.totalAmount),
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.createdAt),
        orderStatus: "Completed",
        source: "manual",
        customerInfo: {
          firstName: "Historical",
          lastName: "Data (File)",
          email: "N/A",
          phoneNumber: "N/A",
          deliveryAddress: {
            street: "N/A",
            subdivision: "N/A",
            cityMunicipality: "N/A",
            province: "N/A",
            postalCode: "N/A",
            country: "N/A",
          },
        },
        paymentInfo: {
          paymentMethod: "full",
          paymentMode: "cash",
          paymentTiming: "now",
          paymentStatus: "100% Complete Paid",
        },
        contractInfo: { signature: "MANUAL_IMPORT", agreedToTerms: true },
      };
      return newOrder;
    });

    const result = await Order.insertMany(ordersToCreate, { session });

    await session.commitTransaction();

    res.status(201).json({
      message: `Successfully imported ${result.length} historical orders.`,
      importedCount: result.length,
    });
  } catch (error: any) {
    await session.abortTransaction();
    res
      .status(500)
      .json({ message: `An error occurred during import: ${error.message}` });
  } finally {
    fs.unlinkSync(filePath);
    session.endSession();
  }
};

export const createManualHistoricalOrder: RequestHandler = async (req, res) => {
  const { createdAt, totalAmount, products, customerInfo, paymentInfo } =
    req.body;

  if (
    !createdAt ||
    !totalAmount ||
    !products ||
    !Array.isArray(products) ||
    products.length === 0
  ) {
    res.status(400).json({
      message:
        "Missing required fields: createdAt, totalAmount, and at least one product.",
    });
    return;
  }

  try {
    const historicalUser = await User.findOne({
      email: "historicaldata@camcoprefab.com",
    });
    if (!historicalUser) {
      res.status(404).json({
        message: "Placeholder user 'historicaldata@camcoprefab.com' not found.",
      });
      return;
    }
    const historicalUserId = historicalUser._id as mongoose.Types.ObjectId;

    const productIds = products.map((p) => p.productId);
    const foundProducts = await Product.find({
      _id: { $in: productIds },
    }).select("_id");
    if (foundProducts.length !== productIds.length) {
      res
        .status(400)
        .json({ message: "One or more provided Product IDs do not exist." });
      return;
    }

    const newOrder = new Order({
      userId: historicalUserId,
      products: products,
      totalAmount: parseFloat(totalAmount),
      createdAt: new Date(createdAt),
      updatedAt: new Date(createdAt),
      orderStatus: "Completed",
      source: "manual",
      customerInfo: customerInfo || {
        firstName: "Historical",
        lastName: "Data (Manual)",
        email: "N/A",
        phoneNumber: "N/A",
        deliveryAddress: {
          street: "N/A",
          subdivision: "N/A",
          cityMunicipality: "N/A",
          province: "N/A",
          postalCode: "N/A",
          country: "N/A",
        },
      },
      paymentInfo: paymentInfo || {
        paymentMethod: "full",
        paymentMode: "cash",
        paymentTiming: "now",
        paymentStatus: "100% Complete Paid",
      },
      contractInfo: {
        signature: "MANUAL_ENTRY",
        agreedToTerms: true,
      },
    });

    await newOrder.save();
    res.status(201).json({ message: "Historical order created successfully." });
  } catch (error: any) {
    res.status(500).json({ message: `An error occurred: ${error.message}` });
  }
};
