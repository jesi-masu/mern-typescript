import React, { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// --- API Service Functions ---

// 1. Get signature from our backend
const getUploadSignature = async (token: string | null) => {
  if (!token) throw new Error("Authentication token not found.");
  const res = await fetch(
    `${process.env.VITE_BACKEND_URL}/api/upload/signature`,
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

// 2. Upload file directly to Cloudinary
const uploadToCloudinary = async (file: File, token: string | null) => {
  const { timestamp, signature } = await getUploadSignature(token);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("api_key", process.env.VITE_CLOUDINARY_API_KEY as string);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`, // Use 'auto' for resource_type
    {
      method: "POST",
      body: formData,
    }
  );
  if (!res.ok) throw new Error("Cloudinary upload failed.");
  const data = await res.json();
  return data.secure_url; // The URL of the uploaded file
};

// 3. Update our order with the new receipt URL
const addPaymentReceipt = async ({
  orderId,
  receiptUrl,
  token,
}: {
  orderId: string;
  receiptUrl: string;
  token: string | null;
}) => {
  if (!token) throw new Error("Authentication token not found.");
  const res = await fetch(
    `${process.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paymentReceiptUrl: receiptUrl }),
    }
  );
  if (!res.ok) throw new Error("Failed to update order with payment receipt.");
  return res.json();
};

// --- Component ---

interface PaymentUploadProps {
  orderId: string;
}

export const PaymentUpload: React.FC<PaymentUploadProps> = ({ orderId }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const receiptUrl = await uploadToCloudinary(file, token);
      await addPaymentReceipt({ orderId, receiptUrl, token });
    },
    onSuccess: () => {
      // Invalidate and refetch the order query to show updated data
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      setSelectedFile(null); // Clear the file input
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
      // Basic validation
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
    <div className="mt-4 p-4 border-t">
      <h4 className="text-sm font-medium mb-2">Upload Payment Proof</h4>
      <div className="flex items-center gap-2">
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".jpg, .jpeg, .png, .pdf"
          className="hidden"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={mutation.isPending}
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose File
        </Button>
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || mutation.isPending}
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
