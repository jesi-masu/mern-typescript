// src/components/customer/PaymentUpload.tsx
import React, { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// --- MODIFICATION: Import CheckCircle icon ---
import { Loader2, Upload, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// API Service Functions (no changes here)
const getUploadSignature = async (token: string | null) => {
  if (!token) throw new Error("Authentication token not found.");
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/upload/signature`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to get upload signature.");
  return res.json();
};
const uploadToCloudinary = async (file: File, token: string | null) => {
  const { timestamp, signature } = await getUploadSignature(token);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY as string);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );
  if (!res.ok) throw new Error("Cloudinary upload failed.");
  const data = await res.json();
  return data.secure_url;
};
const addPaymentReceipt = async ({
  orderId,
  receiptUrl,
  paymentStage,
  token,
}: {
  orderId: string;
  receiptUrl: string;
  paymentStage?: "initial" | "pre_delivery" | "final";
  token: string | null;
}) => {
  if (!token) throw new Error("Authentication token not found.");
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        paymentReceiptUrl: receiptUrl,
        paymentStage: paymentStage,
      }),
    }
  );
  if (!res.ok) throw new Error("Failed to update order with payment receipt.");
  return res.json();
};

// Component
interface PaymentUploadProps {
  orderId: string;
  paymentStage?: "initial" | "pre_delivery" | "final";
  isDisabled?: boolean;
}

export const PaymentUpload: React.FC<PaymentUploadProps> = ({
  orderId,
  paymentStage,
  isDisabled = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  // --- MODIFICATION: Add state to track success ---
  const [success, setSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const receiptUrl = await uploadToCloudinary(file, token);
      await addPaymentReceipt({ orderId, receiptUrl, paymentStage, token });
    },
    // --- MODIFICATION: Update onSuccess handler ---
    onSuccess: () => {
      setSuccess(true); // Show the success message
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      setError(null);

      // Reset the form after a short delay so the user can see the success message
      setTimeout(() => {
        setSuccess(false);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 3000); // Hide message and reset after 3 seconds
    },
    onError: (err: Error) => {
      setError(err.message || "An unknown error occurred during upload.");
      setSuccess(false); // Ensure success message is hidden on error
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Basic file validation
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        setError("Invalid file type. Please upload a JPG, PNG, or PDF.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("File is too large. Maximum size is 5MB.");
        return;
      }
      setSelectedFile(file);
      setError(null);
      setSuccess(false); // --- MODIFICATION: Clear previous success message
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      mutation.mutate(selectedFile);
    }
  };

  return (
    <div
      className={`mt-4 p-4 border-t ${
        isDisabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <h4 className="text-sm font-medium mb-2">Upload Payment Proof</h4>
      <div className="flex items-center gap-2">
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".jpg, .jpeg, .png, .pdf"
          className="hidden"
          disabled={isDisabled || mutation.isPending}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isDisabled || mutation.isPending}
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose File
        </Button>
        <Button
          onClick={handleUpload}
          disabled={
            !selectedFile || isDisabled || mutation.isPending || success
          } // Also disable on success
          size="sm"
        >
          {mutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Upload"
          )}
        </Button>
      </div>
      {selectedFile && !mutation.isPending && !success && (
        <p className="text-xs text-gray-500 mt-2">
          Selected: {selectedFile.name}
        </p>
      )}
      {error && (
        <div className="flex items-center text-red-600 text-xs mt-2">
          <AlertCircle className="h-4 w-4 mr-1" />
          <p>{error}</p>
        </div>
      )}
      {/* --- MODIFICATION: Add success indicator message --- */}
      {success && (
        <div className="flex items-center text-green-600 text-xs mt-2">
          <CheckCircle className="h-4 w-4 mr-1" />
          <p>Upload successful!</p>
        </div>
      )}
    </div>
  );
};
