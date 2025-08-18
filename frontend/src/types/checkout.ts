
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes?: string;
}

export interface PaymentInfo {
  locationImages?: File[];
  paymentReceipts?: File[];
  paymentMethod: 'installment' | 'full' | '';
  installmentStage?: 'initial' | 'pre_delivery' | 'final';
}

export interface ContractInfo {
  signature: string;
  agreedToTerms: boolean;
}
