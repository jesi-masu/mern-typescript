
import { useState } from 'react';
import { CustomerInfo, PaymentInfo, ContractInfo } from '@/types/checkout';

export const useCheckoutState = () => {
  const [currentStep, setCurrentStep] = useState(1);
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    notes: ''
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    locationImages: [],
    paymentReceipts: [],
    paymentMethod: '',
    installmentStage: 'initial'
  });
  
  const [contractInfo, setContractInfo] = useState<ContractInfo>({
    signature: '',
    agreedToTerms: false
  });

  const handleCustomerInfoChange = (info: Partial<CustomerInfo>) => {
    setCustomerInfo(prev => ({ ...prev, ...info }));
  };

  const handlePaymentInfoChange = (info: Partial<PaymentInfo>) => {
    setPaymentInfo(prev => ({ ...prev, ...info }));
  };

  const handleContractInfoChange = (info: Partial<ContractInfo>) => {
    setContractInfo(prev => ({ ...prev, ...info }));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
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
    setCurrentStep
  };
};
