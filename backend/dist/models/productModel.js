"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/models/productModel.ts
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.Schema({
    productName: {
        type: String,
        required: true,
    },
    productPrice: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    squareFeet: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    productLongDescription: {
        type: String,
        required: false,
    },
    productShortDescription: {
        // Newly added
        type: String,
        required: false,
    },
    threeDModelUrl: {
        type: String,
        required: false,
    },
    images: {
        // Newly added
        type: [String], // Array of strings
        required: false,
    },
    features: {
        // Newly added
        type: [String], // Array of strings
        required: false,
    },
    specifications: {
        // Newly added
        type: {
            // Nested Object
            dimensions: String,
            height: String,
            foundation: String,
            structure: String,
            roof: String,
            windows: String,
            electrical: String,
            plumbing: String,
        },
        required: false,
        _id: false,
    },
    inclusion: {
        // Newly added
        type: [String], // Array of strings
        required: false,
    },
    leadTime: {
        // Newly added
        type: String,
        required: false,
    },
}, { timestamps: true });
// Use IProduct as the generic type for mongoose.model
const Product = mongoose_1.default.model("Product", productSchema);
exports.default = Product;
