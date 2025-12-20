import React from 'react';
import Card from '@/common/components/composites/Card';
import { CreditCard, Edit2, CheckCircle2 } from 'lucide-react';

interface PaymentData {
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  upiId: string;
  verified: boolean;
}

interface PaymentDetailsProps {
  data: PaymentData;
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

export const PaymentDetails: React.FC<PaymentDetailsProps> = ({ data }) => {
  return (
    <Card className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <CreditCard size={20} className="text-neutral-600" />
          <h2 className="text-base text-neutral-900">Payment Details</h2>
        </div>
        <button className="p-2 rounded-[10px] hover:bg-neutral-100 transition-colors">
          <Edit2 size={16} className="text-neutral-500" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PaymentField label="Account Name" value={data.accountName} />
        <PaymentField label="Account Number" value={data.accountNumber} />
        <PaymentField label="Bank Name" value={data.bankName} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PaymentField label="IFSC Code" value={data.ifscCode} />
        <PaymentField label="UPI ID" value={data.upiId} />
        
        {data.verified && (
          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-500 opacity-0">Status</label>
            <div className="px-4 py-4 bg-green-50/50 rounded-2xl border border-green-100 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-600" />
              <span className="text-sm text-green-700">Verified</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
