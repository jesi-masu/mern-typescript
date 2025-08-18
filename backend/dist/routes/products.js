"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/products.ts
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const router = express_1.default.Router();
// GET ALL products
router.get("/", productController_1.getProducts);
// GET a single product
router.get("/:id", productController_1.getProduct);
// POST a new product
router.post("/", productController_1.createProduct);
// DELETE a product
router.delete("/:id", productController_1.deleteProduct);
// UPDATE a product
router.put("/:id", productController_1.updateProduct);
exports.default = router;
