"use client";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { baseAPI } from "./baseApi";
import { logError } from "@/common/utils/logError";
import { notify } from "@/common/utils/notify";

type MutationPayload = Record<string, unknown>;

const usePostData = ({url,...rest} : {url : string} & Omit<
    UseMutationOptions<unknown, Error, MutationPayload>,
    "mutationFn"
  >) => {
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await baseAPI.post(url, payload);
      return res.data;
    },
    onSuccess: (data: unknown) => {
      const successMessage = (data as { message?: string })?.message || "Success!";
      notify.success(successMessage);
    },
    onError: (error: Error) => {
        const axiosError = error as { response?: { data?: { message?: string } } };
        const errorMessage = axiosError?.response?.data?.message || error?.message || "Something went wrong!";
        notify.error(errorMessage);
        logError({
            error: errorMessage,
            location: "traveller-client/src/services/usePostData.ts",
            when: "posting data",
        });
    },
    ...rest
  });
}

export default usePostData;