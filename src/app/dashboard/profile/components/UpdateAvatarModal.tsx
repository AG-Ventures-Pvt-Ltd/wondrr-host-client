'use client';

import React, { useState, useRef } from 'react';
import Modal from '@/common/components/composites/Modal';
import { Upload, User } from 'lucide-react';
import Image from '@/common/components/atoms/Image';
import useS3Upload from '@/common/hooks/useS3Upload';
import usePostData from '@/common/services/usePostData';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { useSession } from 'next-auth/react';

interface UpdateAvatarModalProps {
  open: boolean;
  onClose: () => void;
  currentAvatar?: string;
  onSuccess?: () => void;
}

const UpdateAvatarModal: React.FC<UpdateAvatarModalProps> = ({
  open,
  onClose,
  currentAvatar,
  onSuccess,
}) => {
  const { data: session } = useSession();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImages, isUploading } = useS3Upload();
  
  const { mutate: updateAvatar, isPending } = usePostData({
    url: API_ENDPOINTS.PROFILE.UPDATE_AVATAR,
    onSuccess: () => {
      handleClose();
      onSuccess?.();
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    try {
      // Upload to S3
      const userId = session?.user?.id;
      const key = userId ? `${userId}/avatar` : undefined;
      const results = await uploadImages([{ file: selectedFile, key }]);
      
      if (results.length > 0 && results[0].success) {
        // Update avatar via API
        updateAvatar({
          avatar: results[0].url,
        });
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  const isLoading = isUploading || isPending;
  const displayAvatar = previewUrl || currentAvatar;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Update Profile Picture"
      description="Upload a new profile picture for your company profile"
      submitText={isLoading ? 'Uploading...' : 'Update Avatar'}
      onSubmit={handleSubmit}
      disabled={!selectedFile || isLoading}
    >
      <div className="flex flex-col items-center gap-6 py-4">
        {/* Avatar Preview */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-neutral-200 bg-neutral-100 flex items-center justify-center">
            {displayAvatar ? (
              <Image
                src={displayAvatar}
                alt="Avatar preview"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={48} className="text-neutral-400" />
            )}
          </div>
          
          {/* Upload overlay button */}
          <button
            onClick={handleUploadClick}
            disabled={isLoading}
            className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
          >
            <Upload size={24} className="text-white" />
          </button>
        </div>

        {/* Upload Button */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={handleUploadClick}
            disabled={isLoading}
            className="px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedFile ? 'Change Image' : 'Choose Image'}
          </button>
          <p className="text-xs text-neutral-500">
            JPG, PNG or GIF. Max size 5MB
          </p>
          {selectedFile && (
            <p className="text-sm text-neutral-700 font-medium">
              {selectedFile.name}
            </p>
          )}
        </div>

        {/* Hidden file input */}
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

export default UpdateAvatarModal;
