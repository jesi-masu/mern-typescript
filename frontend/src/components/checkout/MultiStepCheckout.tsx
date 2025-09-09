import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
// --- UPDATED: Import the new custom hook ---
import { useCheckoutState } from "@/hooks/useCheckoutState";
import { isStepValid } from "@/utils/checkoutValidation";

import { Product } from "@/types/product";
import { fetchProductById } from "@/services/productService";
import ProductNotFound from "@/components/common/ProductNotFound";

import CustomerInfoStep from "./steps/CustomerInfoStep";
import PaymentStep from "./steps/PaymentStep";
import ContractStep from "./steps/ContractStep";
import OrderSummary from "./OrderSummary";
import CheckoutSteps from "./CheckoutSteps";
import CheckoutNavigation from "./CheckoutNavigation";

const uploadFileToCloudinary = async (file: File): Promise<string> => {
  const signatureResponse = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/upload/signature`,
    {
      method: "POST",
    }
  );
  if (!signatureResponse.ok) {
    throw new Error("Failed to get a signature from the server.");
  }
  const { timestamp, signature } = await signatureResponse.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY as string);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!uploadResponse.ok) {
    const errorData = await uploadResponse.json();
    throw new Error(`Cloudinary upload failed: ${errorData.error.message}`);
  }

  const uploadResult = await uploadResponse.json();
  return uploadResult.secure_url;
};

const MultiStepCheckout = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- UPDATED: All local state management is now handled by the custom hook ---
  const {
    currentStep,
    customerInfo,
    paymentInfo,
    contractInfo,
    handleCustomerInfoChange,
    handlePaymentInfoChange,
    handleContractInfoChange,
    handleNext,
    handlePrevious,
  } = useCheckoutState();

  useEffect(() => {
    const getProduct = async () => {
      if (!id) {
        setError("Product ID is missing.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const fetchedProduct = await fetchProductById(id);
        setProduct(fetchedProduct);
      } catch (err: any) {
        setError(err.message || "Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading Product...</h1>
        <p>Fetching product details. Please wait.</p>
      </div>
    );
  }

  if (error || !product) {
    return <ProductNotFound />;
  }

  const steps = [
    {
      number: 1,
      title: "Customer Information",
      description: "Personal and delivery details",
    },
    {
      number: 2,
      title: "Payment & Location",
      description: "Upload documents and location",
    },
    {
      number: 3,
      title: "Contract & Finalize",
      description: "Review and sign contract",
    },
  ];

  const progress = (currentStep / steps.length) * 100;

  const handleOrderSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const paymentReceiptUploads = (paymentInfo.paymentReceipts || []).map(
        (file) => uploadFileToCloudinary(file as File)
      );
      const locationImageUploads = (paymentInfo.locationImages || []).map(
        (file) => uploadFileToCloudinary(file as File)
      );

      const paymentReceiptsUrls = await Promise.all(paymentReceiptUploads);
      const locationImagesUrls = await Promise.all(locationImageUploads);

      const orderPayload = {
        productId: product._id,
        customerInfo: {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phoneNumber: customerInfo.phoneNumber,
          deliveryAddress: {
            street: paymentInfo.deliveryAddress?.street ?? "",
            subdivision: paymentInfo.deliveryAddress?.subdivision ?? "",
            additionalAddressLine:
              paymentInfo.deliveryAddress?.additionalAddressLine ?? "",
            cityMunicipality:
              paymentInfo.deliveryAddress?.cityMunicipality ?? "",
            province: paymentInfo.deliveryAddress?.province ?? "",
            postalCode: paymentInfo.deliveryAddress?.postalCode ?? "",
            country: paymentInfo.deliveryAddress?.country ?? "",
          },
        },
        paymentInfo: {
          paymentMethod: paymentInfo.paymentMethod,
          installmentStage: paymentInfo.installmentStage,
          paymentMode: paymentInfo.paymentMode,
          paymentTiming: paymentInfo.paymentTiming,
          paymentReceipts: paymentReceiptsUrls,
        },
        contractInfo: {
          signature: contractInfo.signature,
          agreedToTerms: contractInfo.agreedToTerms,
        },
        locationImages: locationImagesUrls,
        totalAmount: product.productPrice,
      };

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderPayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create the order.");
      }

      const newOrder = await response.json();
      toast({
        title: "Order placed successfully!",
        description: `Order #${newOrder._id} has been created.`,
      });
      navigate("/order-history");
    } catch (submitError: any) {
      console.error("Failed to place order:", submitError);
      toast({
        title: "Order Failed",
        description:
          submitError.message || "There was an error placing your order.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepValid = isStepValid(
    currentStep,
    customerInfo,
    paymentInfo,
    contractInfo
  );

  return (
    <div className="container py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle>Checkout Process</CardTitle>
                <span className="text-sm text-gray-500">
                  Step {currentStep} of {steps.length}
                </span>
              </div>
              <Progress value={progress} className="mb-4" />
              <CheckoutSteps currentStep={currentStep} steps={steps} />
            </CardHeader>
            <CardContent>
              {currentStep === 1 && (
                <CustomerInfoStep
                  customerInfo={customerInfo}
                  onChange={handleCustomerInfoChange}
                />
              )}
              {currentStep === 2 && (
                <PaymentStep
                  paymentInfo={paymentInfo}
                  onChange={handlePaymentInfoChange}
                  product={product}
                />
              )}
              {currentStep === 3 && (
                <ContractStep
                  contractInfo={contractInfo}
                  onChange={handleContractInfoChange}
                  customerInfo={customerInfo}
                  product={product}
                />
              )}
              <CheckoutNavigation
                currentStep={currentStep}
                totalSteps={steps.length}
                isStepValid={stepValid}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSubmit={handleOrderSubmit}
                isSubmitting={isSubmitting}
              />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <OrderSummary product={product} />
        </div>
      </div>
    </div>
  );
};

export default MultiStepCheckout;
