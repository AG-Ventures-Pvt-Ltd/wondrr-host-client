import React from 'react'
import Button from '@/common/components/atoms/Button'
import { ArrowRight } from 'lucide-react'

interface NavigationButtonsProps {
  currentStep: number
  isStepValid: boolean
  isLoading: boolean
  isVerifyingOtp: boolean
  onBack: () => void
  onNext: () => void
  onSendOtp: () => void
  onVerifyOtp: () => void
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  isStepValid,
  isLoading,
  isVerifyingOtp,
  onBack,
  onNext,
  onSendOtp,
  onVerifyOtp
}) => {
  return (
    <div className="flex gap-3 pt-6">
      {currentStep > 1 && (
        <Button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-2xl bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
        >
          Back
        </Button>
      )}

      {currentStep < 4 ? (
        <Button
          type="button"
          onClick={onNext}
          disabled={!isStepValid}
          className="flex-1 py-3 rounded-2xl font-normal shadow-sm"
        >
          Continue
          <ArrowRight className="w-5 h-5" />
        </Button>
      ) : currentStep === 4 ? (
        <Button
          type="button"
          onClick={onSendOtp}
          disabled={isLoading || !isStepValid}
          className="flex-1 py-3 rounded-2xl font-normal shadow-sm"
        >
          {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
          <ArrowRight className="w-5 h-5" />
        </Button>
      ) : (
        <Button
          type="submit"
          onClick={onVerifyOtp}
          disabled={isVerifyingOtp || !isStepValid}
          className="flex-1 py-3 rounded-2xl font-normal shadow-sm"
        >
          {isVerifyingOtp ? 'Verifying...' : 'Verify & Complete'}
          <ArrowRight className="w-5 h-5" />
        </Button>
      )}
    </div>
  )
}

export default NavigationButtons