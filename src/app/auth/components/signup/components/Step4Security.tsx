import React from 'react'
import CustomInput from '@/common/components/composites/CustomInput'
import { Lock, Eye, EyeOff } from 'lucide-react'

interface Step4SecurityProps {
  password: string
  confirmPassword: string
  showPassword: boolean
  showConfirmPassword: boolean
  passwordError: string
  onPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onToggleShowPassword: () => void
  onToggleShowConfirmPassword: () => void
  onPasswordBlur: () => void
}

const Step4Security: React.FC<Step4SecurityProps> = ({
  password,
  confirmPassword,
  showPassword,
  showConfirmPassword,
  passwordError,
  onPasswordChange,
  onConfirmPasswordChange,
  onToggleShowPassword,
  onToggleShowConfirmPassword,
  onPasswordBlur
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-medium text-maintext mb-1">
          Secure your account
        </h2>
        <p className="text-sm text-subtext">
          Create a strong password to protect your data
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">
            Choose a strong password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <CustomInput
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter a secure password"
              className="pl-12 pr-12"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              onBlur={onPasswordBlur}
              required
            />
            <button
              type="button"
              onClick={onToggleShowPassword}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}
          <p className="text-xs text-neutral-500">
            Use at least 8 characters with a mix of letters and numbers
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">
            Confirm your password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <CustomInput
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              className="pl-12 pr-12"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={onToggleShowConfirmPassword}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {password !== confirmPassword && confirmPassword && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              Passwords don&apos;t match
            </p>
          )}
          {password === confirmPassword && confirmPassword && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              Passwords match!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Step4Security