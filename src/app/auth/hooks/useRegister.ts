"use client";

import usePostData from "@/common/services/usePostData";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";

interface RegisterCredentials extends Record<string, unknown> {
  fullName: string;
  email: string;
  password: string;
  username: string;
  hostType: string;
  contactNumber: string;
  socialMedias: Array<{ platform: string; url: string }>;
  yearsOfExperience: number;
  userType: string;
  provider: string;
}

interface UseRegisterReturn {
  register: (credentials: RegisterCredentials) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
}

export const useRegister = (): UseRegisterReturn => {
  const mutation = usePostData({
    url: API_ENDPOINTS.AUTH.REGISTER,
  });

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    await mutation.mutateAsync(credentials);
  };

  return {
    register,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};