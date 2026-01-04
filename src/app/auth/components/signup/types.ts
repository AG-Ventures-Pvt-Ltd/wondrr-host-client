export type Step = {
  id: number
  name: string
  description: string
}

export interface SignupFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  hostType: string
  username: string
  contactNumber: string
  instagramLink: string
  websiteLink: string
  otp: string
}

export interface SignupFormState extends SignupFormData {
  currentStep: number
  showPassword: boolean
  showConfirmPassword: boolean
  otpTimer: number
  isOtpSent: boolean
}