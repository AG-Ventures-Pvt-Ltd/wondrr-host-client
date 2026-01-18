import React from 'react'
import CustomInput from '@/common/components/composites/CustomInput'
import Button from '@/common/components/atoms/Button'
import { Shield, Clock } from 'lucide-react'

interface Step5OtpVerificationProps {
  email: string
  otp: string
  otpTimer: number
  isOtpSent: boolean
  isLoading: boolean
  onOtpChange: (value: string) => void
  onResendOtp: () => void
}

const Step5OtpVerification: React.FC<Step5OtpVerificationProps> = ({
  email,
  otp,
  otpTimer,
  isOtpSent,
  isLoading,
  onOtpChange,
  onResendOtp
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-medium text-maintext mb-1">
          Verify your email
        </h2>
        <p className="text-sm text-subtext">
          We&apos;ve sent a 6-digit code to {email}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">
            Enter verification code
          </label>
          <div className="relative">
            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <CustomInput
              type="text"
              placeholder="123456"
              className="pl-12 text-center text-lg font-mono tracking-widest"
              value={otp}
              onChange={(e) => onOtpChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              maxLength={6}
            />
          </div>
          <p className="text-xs text-neutral-500">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {otpTimer > 0 && (
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Clock className="w-4 h-4" />
            <span>Resend code in {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}</span>
          </div>
        )}

        {otpTimer === 0 && isOtpSent && (
          <Button
            type="button"
            onClick={onResendOtp}
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          >
            {isLoading ? 'Sending...' : 'Resend Code'}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Step5OtpVerification