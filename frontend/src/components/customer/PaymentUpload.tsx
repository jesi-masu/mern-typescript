// src/components/customer/PaymentUpload.tsx

import React, { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// --- API Service Functions (No changes needed in these functions) ---
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
  formData.append("api_key", process.env.VITE_CLOUDINARY_API_KEY as string);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`,
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

// --- Component ---

interface PaymentUploadProps {
  orderId: string;
  paymentStage?: "initial" | "pre_delivery" | "final";
  // --- START: MODIFICATION ---
  isDisabled?: boolean; // Add the new disabled prop
  // --- END: MODIFICATION ---
}

export const PaymentUpload: React.FC<PaymentUploadProps> = ({
  orderId,
  paymentStage,
  // --- MODIFICATION: Destructure the new prop ---
  isDisabled = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const receiptUrl = await uploadToCloudinary(file, token);
      await addPaymentReceipt({ orderId, receiptUrl, paymentStage, token });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message || "An unknown error occurred during upload.");
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      mutation.mutate(selectedFile);
    }
  };

  return (
    // --- MODIFICATION: Apply disabled styles to the entire container ---
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
          disabled={isDisabled || mutation.isPending} // Also disable the hidden input
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isDisabled || mutation.isPending} // Apply disabled state
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose File
        </Button>
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isDisabled || mutation.isPending} // Apply disabled state
          size="sm"
        >
          {mutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Upload"
          )}
        </Button>
      </div>
      {selectedFile && !mutation.isPending && (
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
    </div>
  );
};
