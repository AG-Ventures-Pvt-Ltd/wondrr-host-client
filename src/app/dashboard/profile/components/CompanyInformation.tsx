import React, { useState } from 'react';
import Card from '@/common/components/composites/Card';
import Modal from '@/common/components/composites/Modal';
import CustomInput from '@/common/components/composites/CustomInput';
import { Mail, Phone, MapPin, Building2, FileText, Edit2 } from 'lucide-react';
import { useUpdateBasicInfo } from '../hooks/useProfileUpdate';

interface CompanyInfoData {
  companyName: string;
  username: string;
  email: string;
  phoneNumber: string;
  location: {
    address: string;
    city: string;
    state: string;
  };
  bio: string;
}
interface CompanyInformationProps {
  data: CompanyInfoData;
  onUpdate?: (data: CompanyInfoData) => void;
}
interface CompanyInformationModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: CompanyInfoData;
  onSubmit: (data: CompanyInfoData) => void;
  isLoading?: boolean;
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

const CompanyInformationModal: React.FC<CompanyInformationModalProps> = ({
  open,
  onClose,
  initialData,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CompanyInfoData>(
    initialData ? {
      ...initialData,
      location: initialData.location || {
        address: '',
        city: '',
        state: '',
      },
    } : {
      companyName: '',
      username: '',
      email: '',
      phoneNumber: '',
      location: {
        address: '',
        city: '',
        state: '',
      },
      bio: '',
    }
  );

  const { updateBasicInfo, isPending } = useUpdateBasicInfo({
    onSuccess: () => {
      onSubmit(formData);
      onClose();
    }
  });

  const handleFieldChange = (field: keyof CompanyInfoData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (field: 'address' | 'city' | 'state', value: string) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  const handleSubmit = () => {
    // Basic validation - only check updatable fields
    if (!formData.email || !formData.phoneNumber || !formData.location?.address || !formData.location?.city || !formData.location?.state) {
      return;
    }
    
    // Send only the updatable fields to API
    updateBasicInfo({
      bio: formData.bio,
      location: formData.location,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
    });
  };

  const handleClose = () => {
    if (initialData) {
      setFormData({
        ...initialData,
        location: initialData.location || {
          address: '',
          city: '',
          state: '',
        },
      });
    } else {
      setFormData({
        companyName: '',
        username: '',
        email: '',
        phoneNumber: '',
        location: {
          address: '',
          city: '',
          state: '',
        },
        bio: '',
      });
    }
    onClose();
  };

  const isFormValid = 
    formData.email.trim() !== '' &&
    formData.phoneNumber.trim() !== '' &&
    formData.location?.address.trim() !== '' &&
    formData.location?.city.trim() !== '' &&
    formData.location?.state.trim() !== '';

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Edit Company Information"
      description="Update your company details and information"
      submitText="Update"
      onSubmit={handleSubmit}
      disabled={!isFormValid || isPending}
    >
      <div className="flex flex-col gap-5 py-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-neutral-700">
            Company Name
          </label>
          <CustomInput
            value={formData.companyName}
            disabled
            className="bg-neutral-50 cursor-not-allowed"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-xs text-neutral-700">
            Username
          </label>
          <CustomInput
            value={formData.username}
            disabled
            className="bg-neutral-50 cursor-not-allowed"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-xs text-neutral-700">
            Email Address
            <span className="text-red-500 ml-1">*</span>
          </label>
          <CustomInput
            type="email"
            value={formData.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            placeholder="Enter email address"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-xs text-neutral-700">
            Phone Number
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2.5 bg-neutral-100 rounded-2xl border border-neutral-200 text-sm text-neutral-600 font-medium shrink-0">
              +91
            </div>
            <CustomInput
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
              placeholder="Enter phone number"
              className="flex-1"
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-xs text-neutral-700">
            Address
            <span className="text-red-500 ml-1">*</span>
          </label>
          <CustomInput
            value={formData.location?.address}
            onChange={(e) => handleLocationChange('address', e.target.value)}
            placeholder="Enter street address"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-700">
              City
              <span className="text-red-500 ml-1">*</span>
            </label>
            <CustomInput
              value={formData.location?.city}
              onChange={(e) => handleLocationChange('city', e.target.value)}
              placeholder="Enter city"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-700">
              State
              <span className="text-red-500 ml-1">*</span>
            </label>
            <CustomInput
              value={formData.location?.state}
              onChange={(e) => handleLocationChange('state', e.target.value)}
              placeholder="Enter state"
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-xs text-neutral-700">
            Company Bio
          </label>
          <CustomInput
            variant="textarea"
            rows={4}
            value={formData.bio}
            onChange={(e) => handleFieldChange('bio', e.target.value)}
            placeholder="Enter company bio (optional)"
          />
        </div>
      </div>
    </Modal>
  );
};

export const CompanyInformation: React.FC<CompanyInformationProps> = ({ data, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdate = (updatedData: CompanyInfoData) => {
    if (onUpdate) {
      onUpdate(updatedData);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <Card className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-base text-neutral-900">Company Information</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-[10px] hover:bg-neutral-100 transition-colors"
          >
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
            label="Username"
            value={`@${data.username}`}
            icon={<Building2 size={16} />}
          />
          
          <InfoField
            label="Email Address"
            value={data.email}
            icon={<Mail size={16} />}
          />
          
          <InfoField
            label="Phone Number"
            value={data.phoneNumber}
            icon={<Phone size={16} />}
          />
          
          <InfoField
            label="Location"
            value={data.location ? `${data.location?.address}, ${data.location?.city}, ${data.location?.state}` : ""}
            icon={<MapPin size={16} />}
          />
          
          <InfoField
            label="Company Bio"
            value={data.bio}
            icon={<FileText size={16} />}
            multiline
          />
        </div>
      </Card>

      <CompanyInformationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={data}
        onSubmit={handleUpdate}
      />
    </>
  );
};
