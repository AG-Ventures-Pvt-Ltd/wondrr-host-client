"use client";
import { useState } from "react";
import axios from "axios";
import { baseAPI } from "../services/baseApi";
import { notify } from "@/common/utils/notify";
import { logError } from "@/common/utils/logError";
import { PresignedUrlResponse, UploadResult, UseS3UploadReturn } from '@/types/common'


const generateRandomString = (length: number = 16): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateUniqueFilename = (originalFile: File): string => {
  const extension = originalFile.name.split(".").pop() || "";
  const randomString = generateRandomString(8);
  return `${randomString}.${extension}`;
};


const getPresignedUrl = async (
  fileName: string,
  fileType: string
): Promise<PresignedUrlResponse> => {
  try {

    const response = await baseAPI.post<{ data: PresignedUrlResponse }>(
      "/api/client/v1/s3upload/geturl",
      {
        fileName,
        fileType,
      }
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to get presigned URL"
      );
    }
    throw error;
  }
};


const uploadToS3 = async (
  presignedUrl: string,
  file: File
): Promise<void> => {
  try {
    await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message || "Failed to upload file to S3");
    }
    throw error;
  }
};

/**
 * Get S3 path (everything after the domain)
 */
const getS3Path = (presignedUrl: string): string => {
  const urlWithoutQuery = presignedUrl.split("?")[0];
  try {
    const url = new URL(urlWithoutQuery);
    // Return pathname which starts with /
    return url.pathname;
  } catch {
    // Fallback: if URL parsing fails, return the original without query
    return urlWithoutQuery;
  }
};

/**
 * Custom hook for S3 image uploads
 */
const useS3Upload = (): UseS3UploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | undefined>();

  /**
   * Upload single or multiple images to S3
   * @param files - Array of files to upload (can be a single file in an array)
   */
  const uploadImages = async (files: File[]): Promise<UploadResult[]> => {
    if (!files || files.length === 0) {
      notify.error("No files provided for upload");
      return [];
    }

    setIsUploading(true);
    setProgress(0);
    setError(undefined);

    const results: UploadResult[] = [];
    const totalFiles = files.length;

    try {
      // Upload all files in parallel
      const uploadPromises = files.map(async (file, index) => {
        try {
          // Generate unique filename
          const uniqueFilename = generateUniqueFilename(file);

          // Get presigned URL from backend
          const { url: presignedUrl } = await getPresignedUrl(
            uniqueFilename,
            file.type
          );

          // Upload to S3
          await uploadToS3(presignedUrl, file);

          // Get S3 path (without domain)
          const s3Path = getS3Path(presignedUrl);

          // Update progress
          setProgress(((index + 1) / totalFiles) * 100);

          return {
            success: true,
            url: s3Path,
            originalFile: file,
          };
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Upload failed";

          logError({
            error: errorMessage,
            location: "useS3Upload.ts/uploadImages",
            when: `uploading image ${file.name}`,
          });

          return {
            success: false,
            url: "",
            originalFile: file,
            error: errorMessage,
          };
        }
      });

      const uploadResults = await Promise.all(uploadPromises);
      results.push(...uploadResults);

      const failedUploads = uploadResults.filter((r) => !r.success);
      const successfulUploads = uploadResults.filter((r) => r.success);

      if (failedUploads.length > 0) {
        notify.error(
          `${failedUploads.length} out of ${totalFiles} images failed to upload`
        );
      } else {
        notify.success(`Successfully uploaded ${successfulUploads.length} images`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      
      notify.error(`Upload error: ${errorMessage}`);
      
      logError({
        error: errorMessage,
        location: "useS3Upload.ts/uploadImages",
        when: "uploading multiple images",
      });

      setError(errorMessage);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }

    return results;
  };

  return {
    uploadImages,
    isUploading,
    progress,
    error,
  };
};

export default useS3Upload;
