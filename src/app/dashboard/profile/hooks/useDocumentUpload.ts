import { useState } from 'react';
import useS3Upload from '@/common/hooks/useS3Upload';
import { useProfileUpdate } from './useProfileUpdate';
import { notify } from '@/common/utils/notify';

interface DocumentFiles {
  businessRegistrationCertificate?: File | null;
  cancelledCheque?: File | null;
  nonGSTDeclaration?: File | null;
}

interface DocumentUploadOptions {
  onSuccess?: () => void;
}

interface DocumentsPayload extends Record<string, unknown> {
  update_type: 'documents';
  businessRegistrationCertificate?: string;
  cancelledCheque?: string;
  nonGSTDeclaration?: string;
}

export const useDocumentUpload = (options?: DocumentUploadOptions) => {
  const { uploadImages, isUploading: isUploadingToS3 } = useS3Upload();
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useProfileUpdate('documents', {
    onSuccess: () => {
      options?.onSuccess?.();
    },
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const uploadDocuments = async (documents: DocumentFiles) => {
    setIsProcessing(true);
    try {
      // Collect files to upload
      const filesToUpload: File[] = [];
      const fileKeys: { [key: string]: number } = {}; // Maps document type to index in filesToUpload array

      if (documents.businessRegistrationCertificate) {
        fileKeys['businessRegistrationCertificate'] = filesToUpload.length;
        filesToUpload.push(documents.businessRegistrationCertificate);
      }
      if (documents.cancelledCheque) {
        fileKeys['cancelledCheque'] = filesToUpload.length;
        filesToUpload.push(documents.cancelledCheque);
      }
      if (documents.nonGSTDeclaration) {
        fileKeys['nonGSTDeclaration'] = filesToUpload.length;
        filesToUpload.push(documents.nonGSTDeclaration);
      }

      if (filesToUpload.length === 0) {
        notify.error('No files selected for upload');
        setIsProcessing(false);
        return;
      }

      // Upload all files to S3
      const uploadResults = await uploadImages(filesToUpload.map(file => ({ file })));

      const failedUploads = uploadResults.filter(result => !result.success);
      if (failedUploads.length > 0) {
        notify.error('Some files failed to upload');
        setIsProcessing(false);
        return;
      }

      const payload: DocumentsPayload = {
        update_type: 'documents',
      };

      if (documents.businessRegistrationCertificate) {
        const index = fileKeys['businessRegistrationCertificate'];
        payload.businessRegistrationCertificate = uploadResults[index].url;
      }
      if (documents.cancelledCheque) {
        const index = fileKeys['cancelledCheque'];
        payload.cancelledCheque = uploadResults[index].url;
      }
      if (documents.nonGSTDeclaration) {
        const index = fileKeys['nonGSTDeclaration'];
        payload.nonGSTDeclaration = uploadResults[index].url;
      }

      // Send to backend
      updateProfile(payload);
    } catch (error) {
      notify.error(error instanceof Error ? error.message : 'Error uploading documents');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    uploadDocuments,
    isLoading: isUploadingToS3 || isUpdatingProfile || isProcessing,
  };
};
