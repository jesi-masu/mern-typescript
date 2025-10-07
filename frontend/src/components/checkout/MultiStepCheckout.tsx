import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../context/AuthContext";
import { useCheckoutState } from "../../hooks/useCheckoutState";
import { isStepValid } from "../../utils/checkoutValidation";
import { CartItem } from "../../context/CartContext";

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
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { token } = useAuth();

  const [items, setItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (
      location.state &&
      location.state.items &&
      location.state.items.length > 0
    ) {
      setItems(location.state.items);
    } else {
      toast({
        title: "Cart is empty",
        description: "Redirecting you to the shop.",
        variant: "destructive",
      });
      navigate("/shop");
    }
  }, [location, navigate, toast]);

  const totalAmount = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading Checkout...</h1>
        <p>Preparing your items. Please wait.</p>
      </div>
    );
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
        products: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
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
        totalAmount: totalAmount,
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
        description: `Your order #${newOrder._id} has been created.`,
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
                  totalAmount={totalAmount}
                />
              )}
              {currentStep === 3 && (
                <ContractStep
                  contractInfo={contractInfo}
                  onChange={handleContractInfoChange}
                  customerInfo={customerInfo}
                  items={items}
                  totalAmount={totalAmount}
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
          <OrderSummary items={items} totalAmount={totalAmount} />
        </div>
      </div>
    </div>
  );
};

export default MultiStepCheckout;
