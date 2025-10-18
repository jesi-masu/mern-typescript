// backend/src/controllers/productController.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import Product, { IProduct } from "../models/productModel";
import { ProductRequestBody } from "../types/express";
import { logActivity } from "../services/logService";

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products: IProduct[] = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error: any) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products." });
  }
};

export const getProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ mssg: "Product ID is required" });
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ mssg: "Invalid product ID format" });
    return;
  }

  try {
    const product: IProduct | null = await Product.findById(id);

    if (!product) {
      res.status(404).json({ mssg: "No such product" });
      return;
    }

    res.status(200).json(product);
  } catch (error: any) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product." });
  }
};

export const createProduct = async (
  req: Request<any, any, ProductRequestBody>,
  res: Response
): Promise<void> => {
  const {
    productName,
    productPrice,
    category,
    squareFeet,
    image,
    images,
    productLongDescription,
    productShortDescription,
    threeDModelUrl,
    features,
    specifications,
    inclusion,
    leadTime,
  } = req.body;

  // Validate required fields (schema requires squareFeet)
  if (
    !productName ||
    productPrice === undefined ||
    !category ||
    squareFeet === undefined
  ) {
    res.status(400).json({
      error:
        "Please include all required fields: productName, productPrice, category, squareFeet.",
    });
    return;
  }

  try {
    const product: IProduct = await Product.create({
      productName,
      productPrice,
      category,
      squareFeet,
      image,
      images,
      productLongDescription,
      productShortDescription,
      threeDModelUrl,
      features,
      specifications,
      inclusion,
      leadTime,
    });

    await logActivity(
      req.user?._id,
      "Product Created",
      `New product "${product.productName}" (ID: ${product._id}) was created.`,
      "products"
    );

    // Use 201 for resource creation
    res.status(201).json(product);
  } catch (error: any) {
    console.error("Error creating product:", error);
    // If validation error, return 400
    const status = error?.name === "ValidationError" ? 400 : 500;
    res
      .status(status)
      .json({ error: error?.message || "Failed to create product." });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ mssg: "Product ID is required" });
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ mssg: "Invalid product ID format" });
    return;
  }

  try {
    const product: IProduct | null = await Product.findOneAndDelete({
      _id: id,
    });

    if (!product) {
      res.status(404).json({ mssg: "No such product" });
      return;
    }

    await logActivity(
      req.user?._id,
      "Product Deleted",
      `Product "${product.productName}" (ID: ${product._id}) was deleted.`,
      "products"
    );

    res.status(200).json(product);
  } catch (error: any) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product." });
  }
};

export const updateProduct = async (
  req: Request<any, any, ProductRequestBody>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  console.log("Backend: Update request received for ID:", id);
  console.log("Backend: Request Body:", req.body);

  if (!id) {
    res.status(400).json({ mssg: "Product ID is required" });
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Backend: Invalid ID format:", id);
    res.status(400).json({ mssg: "Invalid product ID format" });
    return;
  }

  try {
    const product: IProduct | null = await Product.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      console.log("Backend: Product not found for ID:", id);
      res.status(404).json({ mssg: "No such product" });
      return;
    }

    await logActivity(
      req.user?._id,
      "Product Updated",
      `Product "${product.productName}" (ID: ${product._id}) was updated.`,
      "products"
    );

    console.log("Backend: Product updated successfully:", product);
    res.status(200).json(product);
  } catch (error: any) {
    console.error("Backend: Error during product update:", error);
    const status = error?.name === "ValidationError" ? 400 : 500;
    res
      .status(status)
      .json({ error: error?.message || "Product update failed." });
  }
};

export const searchProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const query = req.query.q as string;
    if (!query) {
      res.json([]);
      return;
    }
    // Find products where the name contains the query (case-insensitive)
    const products = await Product.find({
      productName: { $regex: query, $options: "i" },
    })
      .select("_id productName") // Only return the ID and name
      .limit(10); // Limit to 10 results for performance

    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to search for products." });
  }
};
