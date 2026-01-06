"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { notify } from "@/common/utils/notify";


interface LoginCredentials extends Record<string, unknown> {
  email: string;
  password: string;
}

interface UseLoginReturn {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });
      if (result?.error) {
        if (result?.error == 'OTP_NOT_VERIFIED') {
          notify.info('Please verify your email before logging in!') 
        }
        return { success: false, error: result.error };
      }
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
  };
};