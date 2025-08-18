"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const createToken = (id, role) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET must be defined in the environment variables");
    }
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "3d" });
};
const registerUser = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, password, address, role } = req.body;
    if (!firstName ||
        !lastName ||
        !email ||
        !phoneNumber ||
        !password ||
        !address) {
        res.status(400).json({ error: "Please include all required fields." });
        return;
    }
    try {
        const existingUser = await userModel_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: "Email already in use." });
            return;
        }
        const newUser = await userModel_1.default.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            address,
            role,
        });
        // === FIX HERE: Added '!' for non-null assertion ===
        const token = createToken(newUser._id.toString(), newUser.role);
        res.status(201).json({
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
            token,
        });
    }
    catch (error) {
        console.error("Error during user registration:", error.message);
        res.status(400).json({ error: error.message });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "Please enter both email and password." });
        return;
    }
    try {
        const user = await userModel_1.default.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            res.status(400).json({ error: "Invalid credentials." });
            return;
        }
        // === FIX HERE: Added '!' for non-null assertion ===
        const token = createToken(user._id.toString(), user.role);
        res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            token,
        });
    }
    catch (error) {
        console.error("Error during user login:", error.message);
        res.status(400).json({ error: error.message });
    }
};
exports.loginUser = loginUser;
