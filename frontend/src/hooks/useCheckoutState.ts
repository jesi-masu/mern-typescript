import { useState } from "react";
import { CustomerInfo, PaymentInfo, ContractInfo } from "@/types/checkout";

// Define the initial empty state for the form
const initialCustomerInfo: CustomerInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  address1: "",
  address2: "",
  additionalAddressLine: "",
  city: "",
  province: "",
  postalCode: "",
  country: "Philippines",
};

const initialPaymentInfo: PaymentInfo = {
  deliveryAddress: {
    street: "",
    subdivision: "",
    cityMunicipality: "",
    province: "",
    postalCode: "",
    country: "Philippines",
    additionalAddressLine: "",
  },
  paymentMethod: "",
  installmentStage: "",
  paymentMode: "",
  paymentTiming: "",
  paymentReceipts: [],
  locationImages: [],
};

const initialContractInfo: ContractInfo = {
  signature: "",
  agreedToTerms: false,
};

/**
 * A custom hook to manage the entire state of the multi-step checkout form.
 * This centralizes the logic for updating customer info, payment details, and the contract.
 */
export const useCheckoutState = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [customerInfo, setCustomerInfo] =
    useState<CustomerInfo>(initialCustomerInfo);
  const [paymentInfo, setPaymentInfo] =
    useState<PaymentInfo>(initialPaymentInfo);
  const [contractInfo, setContractInfo] =
    useState<ContractInfo>(initialContractInfo);

  // --- State Update Handlers ---

  const handleCustomerInfoChange = (info: Partial<CustomerInfo>) => {
    setCustomerInfo((prev) => ({ ...prev, ...info }));
  };

  const handlePaymentInfoChange = (info: Partial<PaymentInfo>) => {
    // This correctly merges nested objects like deliveryAddress
    setPaymentInfo((prev) => ({
      ...prev,
      ...info,
      deliveryAddress: {
        ...prev.deliveryAddress,
        ...info.deliveryAddress,
      },
    }));
  };

  const handleContractInfoChange = (info: Partial<ContractInfo>) => {
    setContractInfo((prev) => ({ ...prev, ...info }));
  };

  // --- Navigation Handlers ---

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return {
    currentStep,
    customerInfo,
    paymentInfo,
    contractInfo,
    handleCustomerInfoChange,
    handlePaymentInfoChange,
    handleContractInfoChange,
    handleNext,
    handlePrevious,
  };
};
