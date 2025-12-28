

import React, { useState } from 'react';
import Card from '@/common/components/composites/Card';
import Modal from '@/common/components/composites/Modal';
import { CreditCard, Edit2, CheckCircle2 } from 'lucide-react';
import CustomInput from '@/common/components/composites/CustomInput';
import { useUpdatePaymentDetails } from '../hooks/useProfileUpdate';

interface PaymentData {
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
}

interface PaymentDetailsProps {
  data: PaymentData;
  verified?: boolean;
  onUpdate?: (data: PaymentData) => void;
}

interface PaymentDetailsModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: PaymentData;
  onSubmit: (data: PaymentData) => void;
  isLoading?: boolean;
}

const PaymentField: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-neutral-500">{label}</label>
      <div className="pl-4 pr-4 py-5 bg-neutral-50/50 rounded-2xl border border-neutral-200/50">
        <span className="text-sm text-neutral-900">{value}</span>
      </div>
    </div>
  );
};

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  open,
  onClose,
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<PaymentData>(
    initialData || {
      accountName: '',
      accountNumber: '',
      bankName: '',
      ifscCode: '',
    }
  );

  const { updatePaymentDetails, isPending } = useUpdatePaymentDetails({
    onSuccess: () => {
      onSubmit(formData);
      onClose();
    }
  });

  const handleFieldChange = (field: keyof PaymentData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.accountName || !formData.accountNumber || !formData.bankName || !formData.ifscCode) {
      return;
    }
    updatePaymentDetails(formData);
  };

  const handleClose = () => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        accountName: '',
        accountNumber: '',
        bankName: '',
        ifscCode: '',
      });
    }
    onClose();
  };

  const isFormValid = 
    formData.accountName?.trim() !== '' &&
    formData.accountNumber?.trim() !== '' &&
    formData.bankName?.trim() !== '' &&
    formData.ifscCode?.trim() !== '';

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={initialData ? 'Edit Payment Details' : 'Add Payment Details'}
      description="Update your bank account information for receiving payments"
      submitText={initialData ? 'Update' : 'Add'}
      onSubmit={handleSubmit}
      disabled={!isFormValid || isPending}
    >
      <div className="flex flex-col gap-5 py-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-neutral-700">
            Account Name
            <span className="text-red-500 ml-1">*</span>
          </label>
          <CustomInput
            value={formData.accountName}
            onChange={(e) => handleFieldChange('accountName', e.target.value)}
            placeholder="Enter account holder name"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-700">
              Account Number
              <span className="text-red-500 ml-1">*</span>
            </label>
            <CustomInput
              value={formData.accountNumber}
              onChange={(e) => handleFieldChange('accountNumber', e.target.value)}
              placeholder="Enter account number"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-700">
              Bank Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <CustomInput
              value={formData.bankName}
              onChange={(e) => handleFieldChange('bankName', e.target.value)}
              placeholder="Enter bank name"
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-xs text-neutral-700">
            IFSC Code
            <span className="text-red-500 ml-1">*</span>
          </label>
          <CustomInput
            value={formData.ifscCode}
            onChange={(e) => handleFieldChange('ifscCode', e.target.value.toUpperCase())}
            placeholder="Enter IFSC code"
          />
        </div>
      </div>
    </Modal>
  );
};

export const PaymentDetails: React.FC<PaymentDetailsProps> = ({ data, verified = false, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdate = (updatedData: PaymentData) => {
    if (onUpdate) {
      onUpdate(updatedData);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <Card className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CreditCard size={20} className="text-neutral-600" />
            <h2 className="text-base text-neutral-900">Payment Details</h2>
            {verified && (
              <CheckCircle2 size={18} className="text-green-600" />
            )}
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-[10px] hover:bg-neutral-100 transition-colors"
          >
            <Edit2 size={16} className="text-neutral-500" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PaymentField label="Account Name" value={data.accountName} />
          <PaymentField label="Account Number" value={data.accountNumber} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PaymentField label="Bank Name" value={data.bankName} />
          <PaymentField label="IFSC Code" value={data.ifscCode} />
        </div>
      </Card>

      <PaymentDetailsModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={data}
        onSubmit={handleUpdate}
      />
    </>
  );
};
