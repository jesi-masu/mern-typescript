import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useCheckoutState } from "../../hooks/useCheckoutState";
import { isStepValid } from "../../utils/checkoutValidation";
import { CartItem } from "../../context/CartContext";
import CustomerInfoStep from "./steps/CustomerInfoStep";
import PaymentStep from "./steps/PaymentStep";
import ContractStep from "./steps/ContractStep";
import OrderSummary from "./OrderSummary";
import CheckoutSteps from "./CheckoutSteps";
import CheckoutNavigation from "./CheckoutNavigation";
import InstructionalModal from "@/components/checkout/InstructionalModal";
import PersistentHelpButton from "@/components/checkout/PersistentHelpButton";
import ConfirmationModal from "@/components/checkout/ConfirmationModal";
import ReservationSuccessModal from "@/components/checkout/ReservationSuccessModal";

// Import the product fetcher
import { fetchProductById } from "@/services/productService";

// Define the full product and parts types
type ProductPart = {
  _id: string;
  name: string;
  description?: string;
  quantity: number;
  price?: number;
  image: string;
};
type FullProduct = {
  _id: string;
  images: string[];
  productParts: ProductPart[];
  // ... (add any other fields from your full product model)
};

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

const SESSION_STORAGE_KEY = "hasSeenCheckoutIntro";

const MultiStepCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { token } = useAuth();
  const { removeItems } = useCart();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ref for scrolling to top
  const checkoutWrapperRef = useRef<HTMLDivElement>(null);

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

  // State for instructional modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHelpButton, setShowHelpButton] = useState(false);

  // State for the new confirmation modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // State for the full product details
  const [fullProduct, setFullProduct] = useState<FullProduct | null>(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);

  // Effect to load cart items from location state
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

  // Effect to fetch full product details *once*
  useEffect(() => {
    // Only run if we have items and haven't fetched the product yet
    if (items.length > 0 && !fullProduct) {
      const firstItemId = items[0].id;
      const getProductDetails = async () => {
        setIsLoadingProduct(true);
        try {
          // @ts-ignore - Assuming fetchProductById returns the full product
          const product = await fetchProductById(firstItemId);
          setFullProduct(product);
        } catch (err) {
          console.error("Failed to load full product details:", err);
        } finally {
          setIsLoadingProduct(false);
        }
      };
      getProductDetails();
    }
  }, [items, fullProduct]); // Runs when 'items' are first loaded

  // Effect for first-visit modal (using sessionStorage)
  useEffect(() => {
    try {
      const hasSeen = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (hasSeen === "true") {
        setIsModalOpen(false);
        setShowHelpButton(true);
      } else {
        setIsModalOpen(true);
        setShowHelpButton(false);
      }
    } catch (error) {
      console.error("Could not access sessionStorage: ", error);
      setShowHelpButton(true);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect for scrolling to top on step change
  useEffect(() => {
    if (checkoutWrapperRef.current) {
      checkoutWrapperRef.current.scrollIntoView({
        behavior: "smooth", // A nice, smooth scroll
        block: "start", // Aligns the top of the element to the top of the viewport
      });
    }
  }, [currentStep]); // This runs every time 'currentStep' changes

  // Handler for instructional modal "OK" button
  const handleModalClose = () => {
    setIsModalOpen(false);
    setShowHelpButton(true);
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, "true");
    } catch (error) {
      console.error("Could not write to sessionStorage: ", error);
    }
  };

  // Handler to open instructional modal from help button
  const handleHelpOpen = () => {
    setIsModalOpen(true);
  };

  const totalAmount = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Show loading screen if items or product details are not ready
  if (items.length === 0 || isLoadingProduct) {
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
      title: "Review & Finalize",
      description: "Review and agree to terms",
    },
  ];
  const progress = (currentStep / steps.length) * 100;

  // The *actual* API submission function
  const handleOrderSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // ... (file upload logic) ...
      const uploadedReceipts: { [key: string]: string[] } = {};
      if (paymentInfo.paymentReceipts) {
        for (const [stage, files] of Object.entries(
          paymentInfo.paymentReceipts
        )) {
          if (files && files.length > 0) {
            const uploadPromises = files.map((file) =>
              uploadFileToCloudinary(file)
            );
            uploadedReceipts[stage] = await Promise.all(uploadPromises);
          }
        }
      }
      const locationImageUploads = (paymentInfo.locationImages || []).map(
        (file) => uploadFileToCloudinary(file as File)
      );
      const locationImagesUrls = await Promise.all(locationImageUploads);

      const paymentInfoPayload = {
        paymentMethod: paymentInfo.paymentMethod,
        paymentMode: paymentInfo.paymentMode,
        paymentTiming: paymentInfo.paymentTiming,
        paymentReceipts: uploadedReceipts,
        installmentStage: paymentInfo.installmentStage || undefined,
      };

      const orderPayload = {
        // ... (order payload creation) ...
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
            firstName: paymentInfo.deliveryAddress?.firstName ?? "",
            lastName: paymentInfo.deliveryAddress?.lastName ?? "",
            phone: paymentInfo.deliveryAddress?.phone ?? "",
            street: paymentInfo.deliveryAddress?.street ?? "",
            subdivision: paymentInfo.deliveryAddress?.subdivision ?? "",
            additionalAddressLine:
              paymentInfo.deliveryAddress?.additionalAddressLine ?? "",
            cityMunicipality:
              paymentInfo.deliveryAddress?.cityMunicipality ?? "",
            province: paymentInfo.deliveryAddress?.province ?? "",
            postalCode: paymentInfo.deliveryAddress?.postalCode ?? "",
            country: paymentInfo.deliveryAddress?.country ?? "Philippines",
          },
        },
        paymentInfo: paymentInfoPayload,
        contractInfo: {
          agreedToTerms: contractInfo.agreedToTerms,
        },
        locationImages: locationImagesUrls,
        totalAmount: totalAmount,
      };

      // ... (fetch POST to /api/orders) ...
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
        throw new Error(
          errorData.message || "Server error while creating order."
        );
      }
      const newOrder = await response.json();

      setIsConfirmModalOpen(false); // Close modal on success
      const orderedItemIds = items.map((item) => item.id);
      removeItems(orderedItemIds);
      // ✏️ 3. MODIFY THE SUCCESS LOGIC
      // Instead of navigating, we close the confirm modal and open the success modal
      setIsConfirmModalOpen(false);
      setIsSuccessModalOpen(true);

      // We no longer show a toast, as the modal replaces it.
      // We no longer navigate, as the modal handler will do it.
    } catch (submitError: any) {
      console.error("Failed to place order:", submitError);
      toast({
        title: "Order Failed",
        description:
          submitError.message || "There was an error placing your order.",
        variant: "destructive",
      });
      setIsConfirmModalOpen(false);
      setIsSubmitting(false);
    }
    // We can set submitting to false here, but it's handled in success/error
    // setIsSubmitting(false); // This can be removed
  };

  // "trigger" function to open the confirmation modal
  const handleTriggerSubmit = () => {
    setIsConfirmModalOpen(true);
  };

  // ✏️ 4. ADD A HANDLER FOR THE SUCCESS MODAL'S "OK" BUTTON
  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    navigate("/order-history"); // Now we navigate
  };

  const stepValid = isStepValid(
    currentStep,
    customerInfo,
    paymentInfo,
    contractInfo
  );

  return (
    <div ref={checkoutWrapperRef} className="container py-8 max-w-6xl">
      {/* Render the instructional modal */}
      <InstructionalModal isOpen={isModalOpen} onClose={handleModalClose} />
      {showHelpButton && <PersistentHelpButton onClick={handleHelpOpen} />}

      {/* Render the new confirmation modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleOrderSubmit}
        isSubmitting={isSubmitting}
      />

      {/* ✏️ 5. RENDER THE NEW SUCCESS MODAL */}
      <ReservationSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
      />

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
                  deliveryAddress={paymentInfo.deliveryAddress}
                  items={items}
                  totalAmount={totalAmount}
                  fullProduct={fullProduct} // Pass prop
                />
              )}
              <CheckoutNavigation
                currentStep={currentStep}
                totalSteps={steps.length}
                isStepValid={stepValid}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSubmit={handleTriggerSubmit} // Pass the trigger function
                isSubmitting={isSubmitting}
              />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <OrderSummary
            items={items}
            totalAmount={totalAmount}
            fullProduct={fullProduct} // Pass prop
          />
        </div>
      </div>
    </div>
  );
};
export default MultiStepCheckout;
