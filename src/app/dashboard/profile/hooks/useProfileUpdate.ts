import { useQueryClient } from '@tanstack/react-query';
import usePostData from '@/common/services/usePostData';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';

type UpdateType = 'basic_info' | 'payment_details' | 'social_links';

interface BasicInfoUpdate {
  bio: string;
  location: {
    address: string;
    city: string;
    state: string;
  };
  email: string;
  phoneNumber: string;
}

interface PaymentDetailsUpdate {
  accountName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
}

interface SocialLinksUpdate {
  website: string;
  instagram: string;
  linkedin: string;
  facebook: string;
}

interface UseProfileUpdateOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useProfileUpdate = (updateType: UpdateType, options?: UseProfileUpdateOptions) => {
  const queryClient = useQueryClient();

  return usePostData({
    url: API_ENDPOINTS.PROFILE.UPDATE_BASIC_INFO,
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.PROFILE.GET_HOST_PROFILE] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};

// Helper hooks for specific update types
export const useUpdateBasicInfo = (options?: UseProfileUpdateOptions) => {
  const { mutate, isPending } = useProfileUpdate('basic_info', options);

  const updateBasicInfo = (data: BasicInfoUpdate) => {
    mutate({
      update_type: 'basic_info',
      ...data,
    });
  };

  return { updateBasicInfo, isPending };
};

export const useUpdatePaymentDetails = (options?: UseProfileUpdateOptions) => {
  const { mutate, isPending } = useProfileUpdate('payment_details', options);

  const updatePaymentDetails = (data: PaymentDetailsUpdate) => {
    mutate({
      update_type: 'payment_details',
      ...data,
    });
  };

  return { updatePaymentDetails, isPending };
};

export const useUpdateSocialLinks = (options?: UseProfileUpdateOptions) => {
  const { mutate, isPending } = useProfileUpdate('social_links', options);

  const updateSocialLinks = (data: SocialLinksUpdate) => {
    // Transform data to array of {platform, url} objects
    const socialMedia = [
      { platform: 'Website' as const, url: data.website },
      { platform: 'Instagram' as const, url: data.instagram },
      { platform: 'LinkedIn' as const, url: data.linkedin },
      { platform: 'Facebook' as const, url: data.facebook },
    ].filter(item => item.url); // Only include items with URLs

    mutate({
      update_type: 'social_links',
      socialMedia,
    });
  };

  return { updateSocialLinks, isPending };
};
