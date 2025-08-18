
import { CustomerInfo, PaymentInfo, ContractInfo } from '@/types/checkout';

export const validateCustomerInfo = (customerInfo: CustomerInfo): boolean => {
  return !!(
    customerInfo.firstName && 
    customerInfo.lastName && 
    customerInfo.email && 
    customerInfo.phone && 
    customerInfo.address1 && 
    customerInfo.city && 
    customerInfo.state && 
    customerInfo.postalCode && 
    customerInfo.country
  );
};

export const validatePaymentInfo = (paymentInfo: PaymentInfo): boolean => {
  return !!(
    paymentInfo.paymentMethod &&
    paymentInfo.locationImages && 
    paymentInfo.locationImages.length > 0 && 
    paymentInfo.paymentReceipts && 
    paymentInfo.paymentReceipts.length > 0
  );
};

export const validateContractInfo = (contractInfo: ContractInfo): boolean => {
  return !!(contractInfo.signature && contractInfo.agreedToTerms);
};

export const isStepValid = (step: number, customerInfo: CustomerInfo, paymentInfo: PaymentInfo, contractInfo: ContractInfo): boolean => {
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
