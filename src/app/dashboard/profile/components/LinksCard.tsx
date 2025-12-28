import React, { useState } from 'react';
import Card from '@/common/components/composites/Card';
import Modal from '@/common/components/composites/Modal';
import CustomInput from '@/common/components/composites/CustomInput';
import { Globe, Instagram, Edit2, Linkedin, Facebook } from 'lucide-react';
import { useUpdateSocialLinks } from '../hooks/useProfileUpdate';

interface LinksData {
  website: string;
  instagram: string;
  linkedin: string;
  facebook: string;
}

interface LinksCardProps {
  data: LinksData;
  onUpdate?: (data: LinksData) => void;
}

interface LinksCardModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: LinksData;
  onSubmit: (data: LinksData) => void;
  isLoading?: boolean;
}

const LinkField: React.FC<{
  label: string;
  value: string;
  icon: React.ReactNode;
}> = ({ label, value, icon }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-neutral-500">{label}</label>
      <div className="pl-4 pr-4 py-4 bg-neutral-50/50 rounded-2xl border border-neutral-200/50 flex items-center gap-3">
        <div className="text-neutral-400 shrink-0">
          {icon}
        </div>
        <div className="text-sm text-neutral-900 truncate">
          {value || 'Not provided'}
        </div>
      </div>
    </div>
  );
};

const LinksCardModal: React.FC<LinksCardModalProps> = ({
  open,
  onClose,
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<LinksData>(
    initialData || {
      website: '',
      instagram: '',
      linkedin: '',
      facebook: '',
    }
  );

  const { updateSocialLinks, isPending } = useUpdateSocialLinks({
    onSuccess: () => {
      onSubmit(formData);
      onClose();
    }
  });

  const handleFieldChange = (field: keyof LinksData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    updateSocialLinks(formData);
  };

  const handleClose = () => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        website: '',
        instagram: '',
        linkedin: '',
        facebook: '',
      });
    }
    onClose();
  };

  const isFormValid = true; // Links are optional

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={initialData ? 'Edit Links' : 'Add Links'}
      description="Update your website and social media links"
      submitText={initialData ? 'Update' : 'Add'}
      onSubmit={handleSubmit}
      disabled={isPending}
    >
      <div className="flex flex-col gap-5 py-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-neutral-700">
            Website URL
          </label>
          <CustomInput
            type="url"
            value={formData.website}
            onChange={(e) => handleFieldChange('website', e.target.value)}
            placeholder="https://www.example.com"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-neutral-700">
            Instagram Profile
          </label>
          <CustomInput
            value={formData.instagram}
            onChange={(e) => handleFieldChange('instagram', e.target.value)}
            placeholder="https://www.instagram.com/username"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs text-neutral-700">
            LinkedIn Profile
          </label>
          <CustomInput
            value={formData.linkedin}
            onChange={(e) => handleFieldChange('linkedin', e.target.value)}
            placeholder="https://www.linkedin.com/in/username"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs text-neutral-700">
            Facebook Page
          </label>
          <CustomInput
            value={formData.facebook}
            onChange={(e) => handleFieldChange('facebook', e.target.value)}
            placeholder="https://www.facebook.com/pagename"
          />
        </div>
      </div>
    </Modal>
  );
};

export const LinksCard: React.FC<LinksCardProps> = ({ data, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdate = (updatedData: LinksData) => {
    if (onUpdate) {
      onUpdate(updatedData);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <Card className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-base text-neutral-900">Links</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-[10px] hover:bg-neutral-100 transition-colors"
          >
            <Edit2 size={16} className="text-neutral-500" />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <LinkField
            label="Website"
            value={data.website}
            icon={<Globe size={16} />}
          />

          <LinkField
            label="Instagram"
            value={data.instagram}
            icon={<Instagram size={16} />}
          />

          <LinkField
            label="LinkedIn"
            value={data.linkedin}
            icon={<Linkedin size={16} />}
          />

          <LinkField
            label="Facebook"
            value={data.facebook}
            icon={<Facebook size={16} />}
          />
        </div>
      </Card>

      <LinksCardModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={data}
        onSubmit={handleUpdate}
      />
    </>
  );
};