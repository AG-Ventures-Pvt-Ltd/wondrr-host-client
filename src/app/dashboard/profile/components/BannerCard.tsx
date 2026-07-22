'use client';

import React, { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Image as ImageIcon, Pencil, Upload } from 'lucide-react';
import Card from '@/common/components/composites/Card';
import Modal from '@/common/components/composites/Modal';
import MyImage from '@/common/components/atoms/Image';
import useS3Upload from '@/common/hooks/useS3Upload';
import { notify } from '@/common/utils/notify';
import { useUpdateMedia } from '../hooks/useProfileUpdate';

interface BannerCardProps {
  banner?: string;
}

const BannerUploadModal: React.FC<{
  open: boolean;
  onClose: () => void;
  currentBanner?: string;
}> = ({ open, onClose, currentBanner }) => {
  const { data: session } = useSession();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImages, isUploading } = useS3Upload();

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  const { updateMedia, isPending } = useUpdateMedia({ onSuccess: handleClose });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notify.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      notify.error('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    const userId = session?.user?.id;
    const key = userId ? `${userId}/banner` : undefined;
    const results = await uploadImages([{ file: selectedFile, key }]);

    if (results.length > 0 && results[0].success) {
      updateMedia({ banner: results[0].url });
    }
  };

  const isLoading = isUploading || isPending;
  const displayBanner = previewUrl || currentBanner;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Update Cover Banner"
      description="Shown at the top of your public profile"
      submitText={isLoading ? 'Uploading...' : 'Update Banner'}
      onSubmit={handleSubmit}
      disabled={!selectedFile || isLoading}
    >
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="relative w-full">
          <div className="aspect-[3/1] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 flex items-center justify-center">
            {displayBanner ? (
              <MyImage
                src={displayBanner}
                alt="Banner preview"
                width={0}
                height={0}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon size={32} className="text-neutral-400" />
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 transition-opacity hover:opacity-100 disabled:cursor-not-allowed"
          >
            <Upload size={22} className="text-white" />
          </button>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="rounded-lg bg-neutral-900 px-6 py-2 text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {selectedFile ? 'Change Image' : 'Choose Image'}
        </button>
        <p className="text-xs text-neutral-500">JPG or PNG. Max size 5MB. Recommended 1500x500.</p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </Modal>
  );
};

export const BannerCard: React.FC<BannerCardProps> = ({ banner }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base text-neutral-900">Cover Banner</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-[10px] p-2 transition-colors hover:bg-neutral-100"
          >
            <Pencil size={16} className="text-neutral-500" />
          </button>
        </div>

        <div className="flex aspect-[3/1] w-full items-center justify-center overflow-hidden rounded-2xl border border-neutral-200/60 bg-neutral-50">
          {banner ? (
            <MyImage src={banner} alt="Cover banner" width={0} height={0} className="h-full w-full object-cover" />
          ) : (
            <span className="px-6 text-center text-xs text-neutral-400">
              No custom banner set — the default banner is shown on your public profile
            </span>
          )}
        </div>
      </Card>

      <BannerUploadModal open={isModalOpen} onClose={() => setIsModalOpen(false)} currentBanner={banner} />
    </>
  );
};
