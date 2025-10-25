// frontend/src/types/checkout.ts
// (This is the complete, final file)

// This interface matches your CustomerInfoStep.tsx form
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string; // This is the BILLING phone
  address1: string;
  address2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  additionalAddressLine?: string;
}

// This interface now matches your backend model and form
export interface DeliveryAddress {
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  subdivision: string;
  cityMunicipality: string;
  province: string;
  postalCode: string;
  country: string;
  additionalAddressLine?: string;
}

// This matches your PaymentStep.tsx state
export interface PaymentInfo {
  locationImages?: File[];
  paymentReceipts?: {
    initial?: File[];
    pre_delivery?: File[];
    final?: File[];
  };
  paymentMethod: "installment" | "full" | "";
  installmentStage?: "initial" | "pre_delivery" | "final" | "";
  paymentMode?: "cash" | "bank" | "cheque" | "gcash" | "";
  paymentTiming?: "now" | "later" | "";

  // This holds the delivery address state during checkout
  deliveryAddress: DeliveryAddress;
}

// This matches your ContractStep.tsx
export interface ContractInfo {
  signature: string;
  agreedToTerms: boolean;
  signatureTimestamp?: string;
}
