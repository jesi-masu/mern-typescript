// backend/src/controllers/productController.ts

import { Request, Response } from "express";
import mongoose from "mongoose";
import Product, { IProduct } from "../models/productModel";
import { ProductRequestBody } from "../types/express";

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const products: IProduct[] = await Product.find({}).sort({ createdAt: -1 });
  res.status(200).json(products);
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
    res.status(404).json({ mssg: "No such product" });
    return;
  }

  const product: IProduct | null = await Product.findById(id);

  if (!product) {
    res.status(404).json({ mssg: "No such product" });
    return;
  }

  res.status(200).json(product);
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

  if (!productName || !productPrice || !category) {
    res.status(400).json({
      error:
        "Please include all required fields: productName, productPrice, category.",
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
    res.status(200).json(product);
  } catch (error: any) {
    console.error("Error creating product:", error.message);
    res.status(400).json({ error: error.message });
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
    res.status(404).json({ mssg: "No such product" });
    return;
  }

  const product: IProduct | null = await Product.findOneAndDelete({ _id: id });

  if (!product) {
    res.status(400).json({ mssg: "No such product" });
    return;
  }

  res.status(200).json(product);
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
    res.status(404).json({ mssg: "No such product" });
    return;
  }

  try {
    const product: IProduct | null = await Product.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
      },
      { new: true }
    );

    if (!product) {
      console.log("Backend: Product not found for ID:", id);
      res.status(400).json({ mssg: "No such product" });
      return;
    }

    console.log("Backend: Product updated successfully:", product);
    res.status(200).json(product);
  } catch (error: any) {
    console.error(
      "Backend: Error during product update:",
      error.message,
      error
    );
    res.status(400).json({ error: error.message });
  }
};
