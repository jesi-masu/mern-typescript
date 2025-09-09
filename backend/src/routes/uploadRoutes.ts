import express from "express";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// --- Cloudinary Configuration ---
// This configures the SDK with your account credentials.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// --- API Endpoint for Generating Upload Signatures ---
// @route   POST /api/upload/signature
// @desc    Generate a signature for direct-to-Cloudinary uploads
// @access  Private (should be protected by auth middleware)
router.post("/signature", (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  try {
    // Use the Cloudinary SDK to create a secure signature.
    // This proves to Cloudinary that the upload request is coming from an authorized source.
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
      },
      process.env.CLOUDINARY_API_SECRET as string
    );

    // Send the signature and timestamp back to the frontend.
    res.status(200).json({ timestamp, signature });
  } catch (error: any) {
    console.error("Error generating Cloudinary signature:", error);
    res
      .status(500)
      .json({ message: "Server error while generating signature." });
  }
});

export default router;
