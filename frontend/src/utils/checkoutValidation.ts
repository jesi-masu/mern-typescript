import { CustomerInfo, PaymentInfo, ContractInfo } from "@/types/checkout";

export const validateCustomerInfo = (customerInfo: CustomerInfo): boolean => {
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

export const validatePaymentInfo = (paymentInfo: PaymentInfo): boolean => {
  const logFailure = (reason: string) => {
    console.log(`Validation failed: ${reason}`);
    return false;
  };

  if (!paymentInfo.paymentMethod) {
    return logFailure("Payment Method (Installment/Full) not selected");
  }

  if (
    paymentInfo.paymentMethod === "installment" &&
    !paymentInfo.installmentStage
  ) {
    return logFailure("Installment Stage not selected");
  }

  if (!paymentInfo.paymentMode) {
    return logFailure("Payment Mode (Cash, Bank, etc.) not selected");
  }
  if (!paymentInfo.paymentTiming) {
    return logFailure("Payment Timing (Now/Later) not selected");
  }

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

  if (paymentInfo.paymentTiming === "now") {
    const hasReceipts =
      Object.values(paymentInfo.paymentReceipts || {}).flat().length > 0;
    if (!hasReceipts) {
      return logFailure("Payment Receipts not uploaded for 'Pay Now' option");
    }
  }

  console.log("Validation passed!");
  return true;
};

// --- THIS IS THE FIX ---
// We only need to check if they agreed to the terms now.
export const validateContractInfo = (contractInfo: ContractInfo): boolean => {
  return contractInfo.agreedToTerms === true;
};
// --- END OF FIX ---

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
      return validateContractInfo(contractInfo); // This will now use the corrected function
    default:
      return false;
  }
};
