import React from 'react';
import Card from '@/common/components/composites/Card';
import { Mail, Phone, MapPin, Building2, FileText, Edit2 } from 'lucide-react';

interface CompanyInfoData {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  description: string;
}

interface CompanyInformationProps {
  data: CompanyInfoData;
}

const InfoField: React.FC<{
  label: string;
  value: string;
  icon: React.ReactNode;
  multiline?: boolean;
}> = ({ label, value, icon, multiline = false }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-neutral-500">{label}</label>
      <div className={`pl-4 pr-4 py-4 bg-neutral-50/50 rounded-2xl border border-neutral-200/50 flex items-${multiline ? 'start' : 'center'} gap-3`}>
        <div className="text-neutral-400 shrink-0 mt-0.5">
          {icon}
        </div>
        <div className={`text-sm text-neutral-900 ${multiline ? 'leading-6' : 'leading-5'}`}>
          {value}
        </div>
      </div>
    </div>
  );
};

export const CompanyInformation: React.FC<CompanyInformationProps> = ({ data }) => {
  return (
    <Card className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-base text-neutral-900">Company Information</h2>
        <button className="p-2 rounded-[10px] hover:bg-neutral-100 transition-colors">
          <Edit2 size={16} className="text-neutral-500" />
        </button>
      </div>
      
      <div className="flex flex-col gap-5">
        <InfoField
          label="Company Name"
          value={data.companyName}
          icon={<Building2 size={16} />}
        />
        
        <InfoField
          label="Email Address"
          value={data.email}
          icon={<Mail size={16} />}
        />
        
        <InfoField
          label="Phone Number"
          value={data.phone}
          icon={<Phone size={16} />}
        />
        
        <InfoField
          label="Registered Address"
          value={data.address}
          icon={<MapPin size={16} />}
        />
        
        <InfoField
          label="Company Description"
          value={data.description}
          icon={<FileText size={16} />}
          multiline
        />
      </div>
    </Card>
  );
};
