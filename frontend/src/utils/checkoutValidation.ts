import { CustomerInfo, PaymentInfo, ContractInfo } from "@/types/checkout";

export const validateCustomerInfo = (customerInfo: CustomerInfo): boolean => {
  // This validation remains the same
  return !!(
    customerInfo.firstName &&
    customerInfo.lastName &&
    customerInfo.email &&
    customerInfo.phoneNumber &&
    customerInfo.address1 &&
    customerInfo.city &&
    customerInfo.province &&
    customerInfo.postalCode &&
    customerInfo.country
  );
};

// --- REWRITTEN VALIDATION FUNCTION ---
export const validatePaymentInfo = (paymentInfo: PaymentInfo): boolean => {
  // Helper function for logging, to keep the code clean
  const logFailure = (reason: string) => {
    console.log(`Validation failed: ${reason}`);
    return false;
  };

  // Condition 1: A payment method must be selected
  if (!paymentInfo.paymentMethod) {
    return logFailure("Payment Method (Installment/Full) not selected");
  }

  // Condition 2: If installment is chosen, a stage must be selected
  if (
    paymentInfo.paymentMethod === "installment" &&
    !paymentInfo.installmentStage
  ) {
    return logFailure("Installment Stage not selected");
  }

  // Condition 3: A payment mode and timing must be selected
  if (!paymentInfo.paymentMode) {
    return logFailure("Payment Mode (Cash, Bank, etc.) not selected");
  }
  if (!paymentInfo.paymentTiming) {
    return logFailure("Payment Timing (Now/Later) not selected");
  }

  // Condition 4: The delivery address must be complete
  const isAddressValid =
    !!paymentInfo.deliveryAddress?.street &&
    !!paymentInfo.deliveryAddress?.subdivision &&
    !!paymentInfo.deliveryAddress?.cityMunicipality &&
    !!paymentInfo.deliveryAddress?.province &&
    !!paymentInfo.deliveryAddress?.postalCode &&
    !!paymentInfo.deliveryAddress?.country;

  if (!isAddressValid) {
    return logFailure("Delivery Address is incomplete");
  }

  // Condition 5: Location images must be uploaded
  const hasLocationImages =
    !!paymentInfo.locationImages && paymentInfo.locationImages.length > 0;
  if (!hasLocationImages) {
    return logFailure("Location Images not uploaded");
  }

  // Condition 6: If paying now, receipts must be uploaded
  if (
    paymentInfo.paymentTiming === "now" &&
    (!paymentInfo.paymentReceipts || paymentInfo.paymentReceipts.length === 0)
  ) {
    return logFailure("Payment Receipts not uploaded for 'Pay Now' option");
  }

  // If all checks pass, the step is valid
  console.log("Validation passed!");
  return true;
};

export const validateContractInfo = (contractInfo: ContractInfo): boolean => {
  // This validation remains the same
  return !!(contractInfo.signature && contractInfo.agreedToTerms);
};

export const isStepValid = (
  step: number,
  customerInfo: CustomerInfo,
  paymentInfo: PaymentInfo,
  contractInfo: ContractInfo
): boolean => {
  switch (step) {
    case 1:
      return validateCustomerInfo(customerInfo);
    case 2:
      return validatePaymentInfo(paymentInfo);
    case 3:
      return validateContractInfo(contractInfo);
    default:
      return false;
  }
};
