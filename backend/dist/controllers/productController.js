"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProduct = exports.deleteProduct = exports.createProduct = exports.getProduct = exports.getProducts = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const productModel_1 = __importDefault(require("../models/productModel")); // Import IProduct
// GET ALL products
const getProducts = async (req, res) => {
    const products = await productModel_1.default.find({}).sort({ createdAt: -1 });
    // console.log("Products found:", products.length); // Add this for debugging
    res.status(200).json(products);
};
exports.getProducts = getProducts;
// GET a single product
const getProduct = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        // Checks if id exists
        res.status(400).json({ mssg: "Product ID is required" });
        return;
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(404).json({ mssg: "No such product" });
        return;
    }
    const product = await productModel_1.default.findById(id);
    if (!product) {
        res.status(404).json({ mssg: "No such product" });
        return;
    }
    res.status(200).json(product);
};
exports.getProduct = getProduct;
// CREATE new product
const createProduct = async (req, res) => {
    const { productName, productPrice, category, image, images, // Make sure to destructure these if you're sending them
    productLongDescription, squareFeet, 
    // Add other fields you're passing in the body if they are new (e.g., images, features, etc.)
    productShortDescription, threeDModelUrl, features, specifications, inclusion, leadTime, } = req.body;
    // Add validation for required fields
    if (!productName || !productPrice || !category) {
        res.status(400).json({
            error: "Please include all required fields: productName, productPrice, category.",
        });
        return;
    }
    try {
        const product = await productModel_1.default.create({
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
    }
    catch (error) {
        // A more specific error message might be helpful here for development
        console.error("Error creating product:", error.message);
        res.status(400).json({ error: error.message });
    }
};
exports.createProduct = createProduct;
// DELETE a product
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    // Check if id exists
    if (!id) {
        res.status(400).json({ mssg: "Product ID is required" });
        return;
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(404).json({ mssg: "No such product" });
        return;
    }
    const product = await productModel_1.default.findOneAndDelete({ _id: id });
    if (!product) {
        res.status(400).json({ mssg: "No such product" });
        return;
    }
    res.status(200).json(product);
};
exports.deleteProduct = deleteProduct;
// UPDATE a product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    console.log("Backend: Update request received for ID:", id); //newly added
    console.log("Backend: Request Body:", req.body); //newly added
    // Check if id exists
    if (!id) {
        res.status(400).json({ mssg: "Product ID is required" });
        return;
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        console.log("Backend: Invalid ID format:", id);
        res.status(404).json({ mssg: "No such product" });
        return;
    }
    try {
        const product = await productModel_1.default.findByIdAndUpdate({ _id: id }, {
            ...req.body,
        }, { new: true });
        if (!product) {
            console.log("Backend: Product not found for ID:", id);
            res.status(400).json({ mssg: "No such product" });
            return;
        }
        console.log("Backend: Product updated successfully:", product);
        res.status(200).json(product);
    }
    catch (error) {
        console.error("Backend: Error during product update:", error.message, error);
        res.status(400).json({ error: error.message });
    }
};
exports.updateProduct = updateProduct;
