import React from 'react'
import CustomInput from '@/common/components/composites/CustomInput'
import { Mail, User, Phone } from 'lucide-react'

interface Step2ContactDetailsProps {
  username: string
  email: string
  contactNumber: string
  emailError: string
  usernameError: string
  onUsernameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onContactNumberChange: (value: string) => void
  onEmailBlur: () => void
  onUsernameBlur: () => void
}

const Step2ContactDetails: React.FC<Step2ContactDetailsProps> = ({
  username,
  email,
  contactNumber,
  emailError,
  usernameError,
  onUsernameChange,
  onEmailChange,
  onContactNumberChange,
  onEmailBlur,
  onUsernameBlur
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-medium text-maintext mb-1">
          How can we reach you?
        </h2>
        <p className="text-sm text-subtext">
          Your contact information helps us keep you updated
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">
            Pick a unique username ✨
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <CustomInput
              type="text"
              placeholder="cool_traveler"
              className="pl-12"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value.toLowerCase().replace(/\s/g, '_'))}
              onBlur={onUsernameBlur}
              required
            />
          </div>
          {usernameError && <p className="text-xs text-red-500">{usernameError}</p>}
          <p className="text-xs text-neutral-500">This will be your unique identifier</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">
            What&apos;s your email address? 📧
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <CustomInput
              type="email"
              placeholder="you@example.com"
              className="pl-12"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              onBlur={onEmailBlur}
              required
            />
          </div>
          {emailError && <p className="text-xs text-red-500">{emailError}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">
            WhatsApp number for quick updates? 📱
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <span className="absolute left-12 top-1/2 -translate-y-1/2 text-neutral-600 font-medium text-sm">+91</span>
            <CustomInput
              type="tel"
              placeholder="1234567898"
              className="pl-20"
              value={contactNumber}
              onChange={(e) => onContactNumberChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
              required
            />
          </div>
          <p className="text-xs text-neutral-500">We&apos;ll send important notifications here</p>
        </div>
      </div>
    </div>
  )
}

export default Step2ContactDetails