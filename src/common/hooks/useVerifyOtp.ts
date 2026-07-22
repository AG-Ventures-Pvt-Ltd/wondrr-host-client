"use client";

import usePostData from "@/common/services/usePostData";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";

interface VerifyOtpCredentials extends Record<string, unknown> {
  email: string;
  otp: string;
  purpose: 'signup' | 'login';
}

interface VerifyOtpResponse {
  statusCode: number;
  data: {
    verified: boolean;
  };
  message: string;
  success: boolean;
}

interface UseVerifyOtpReturn {
  verifyOtp: (credentials: VerifyOtpCredentials) => Promise<VerifyOtpResponse>;
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
  data: VerifyOtpResponse | null;
}

export const useVerifyOtp = (): UseVerifyOtpReturn => {
  const mutation = usePostData({
    url: API_ENDPOINTS.AUTH.VERIFY_OTP,
  });

  const verifyOtp = async (credentials: VerifyOtpCredentials): Promise<VerifyOtpResponse> => {
    const result = await mutation.mutateAsync(credentials);
    return result as VerifyOtpResponse;
  };

  return {
    verifyOtp,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data as VerifyOtpResponse | null,
  };
};