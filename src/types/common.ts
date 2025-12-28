// Common/shared types used across multiple features

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface PresignedUrlResponse {
  url: string
  key: string
}

export interface UploadResult {
  success: boolean
  url: string
  originalFile: File
  error?: string
}

export interface UseS3UploadReturn {
  uploadImages: (files: File[]) => Promise<UploadResult[]>
  isUploading: boolean
  progress: number
  error?: string
}