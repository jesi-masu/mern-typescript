//frontend/src/components/checkout/MultiStepCheckout.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useOrders } from "@/context/OrderContext";
import { useCheckoutState } from "@/hooks/useCheckoutState";
import { isStepValid } from "@/utils/checkoutValidation";
import { OrderStatus, PaymentStatus } from "@/data/orders";

// Import the Product type and the API service function
import { Product } from "@/types/product";
import { fetchProductById } from "@/services/productService";

// Import the refactored ProductNotFound component
import ProductNotFound from "@/components/common/ProductNotFound";

import CustomerInfoStep from "./steps/CustomerInfoStep";
import PaymentStep from "./steps/PaymentStep";
import ContractStep from "./steps/ContractStep";
import OrderSummary from "./OrderSummary";
import CheckoutSteps from "./CheckoutSteps";
import CheckoutNavigation from "./CheckoutNavigation";

const MultiStepCheckout = () => {
  const { id } = useParams<{ id: string }>(); // 'id' from URL
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addNewOrder } = useOrders();

  // State for fetching product data
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State to handle order submission loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect hook to fetch product data from the API
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
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

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

  // Handle loading state while fetching product
  if (loading) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading Product...</h1>
        <p>Fetching product details. Please wait.</p>
      </div>
    );
  }

  // Handle error or product not found
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
    // Prevent double submissions
    if (isSubmitting) return;

    setIsSubmitting(true);

    const orderData = {
      firstName: customerInfo.firstName,
      lastName: customerInfo.lastName,
      email: customerInfo.email,
      address: customerInfo.address1,
      city: customerInfo.city,
      state: customerInfo.state,
      zipCode: customerInfo.postalCode,
    };

    try {
      // Use the fetched product's properties for the new order
      const newOrder = addNewOrder({
        customerId: orderData.email,
        customerName: `${orderData.firstName} ${orderData.lastName}`,
        customerEmail: orderData.email,
        products: [{ productId: product._id, quantity: 1 }],
        status: "Pending" as OrderStatus,
        paymentStatus: "Pending" as PaymentStatus,
        totalAmount: product.productPrice,
      });

      toast({
        title: "Order placed successfully!",
        description: `Order #${newOrder.id} has been created. You will receive a confirmation email shortly.`,
      });

      navigate("/order-history");
    } catch (submitError) {
      console.error("Failed to place order:", submitError);
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
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
                isSubmitting={isSubmitting} // Pass the new prop
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
