import React, { useState, useEffect } from 'react'
import { useRegister } from '../../hooks/useRegister'
import { useVerifyOtp } from '@/common/hooks/useVerifyOtp'
import StepIndicator from './components/StepIndicator'
import Step1AboutYou from './components/Step1AboutYou'
import Step2ContactDetails from './components/Step2ContactDetails'
import Step3SocialPresence from './components/Step3SocialPresence'
import Step4Security from './components/Step4Security'
import Step5OtpVerification from './components/Step5OtpVerification'
import NavigationButtons from './components/NavigationButtons'
import { steps, OTP_TIMER_DURATION } from './constants'

const SignupForm = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [hostType, setHostType] = useState('Individual')
  const [username, setUsername] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [instagramLink, setInstagramLink] = useState('')
  const [websiteLink, setWebsiteLink] = useState('')
  const [otp, setOtp] = useState('')
  const [otpTimer, setOtpTimer] = useState(0)
  const [isOtpSent, setIsOtpSent] = useState(false)

  const { register, isLoading, error } = useRegister()
  const { verifyOtp: verifyOtpMutation, isLoading: isVerifyingOtp, error: otpError, isSuccess: isOtpVerified, data: otpData } = useVerifyOtp()

  // OTP Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [otpTimer])

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5))
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSendOtp = async () => {
    try {
      await register({
        fullName,
        email,
        password,
        username,
        hostType,
        contactNumber,
        socialMedias: [
          { platform: 'Instagram', url: instagramLink },
          ...(websiteLink ? [{ platform: 'Website', url: websiteLink }] : [])
        ],
        userType: 'Host',
        provider: 'credentials'
      })
      setIsOtpSent(true)
      setOtpTimer(OTP_TIMER_DURATION)
      setCurrentStep(5)
    } catch (err) {
      console.error('Registration failed:', err)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await verifyOtpMutation({ email, otp })
      console.log('OTP verification response:', response)
    } catch (err) {
      console.error('OTP verification failed:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!(hostType && fullName.trim())
      case 2:
        return !!(username.trim() && email.trim() && contactNumber.trim())
      case 3:
        return !!instagramLink.trim()
      case 4:
        return !!(password && confirmPassword && password === confirmPassword)
      case 5:
        return otp.trim().length === 6
      default:
        return false
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1AboutYou
            hostType={hostType}
            fullName={fullName}
            onHostTypeChange={setHostType}
            onFullNameChange={setFullName}
          />
        )
      case 2:
        return (
          <Step2ContactDetails
            username={username}
            email={email}
            contactNumber={contactNumber}
            onUsernameChange={setUsername}
            onEmailChange={setEmail}
            onContactNumberChange={setContactNumber}
          />
        )
      case 3:
        return (
          <Step3SocialPresence
            instagramLink={instagramLink}
            websiteLink={websiteLink}
            onInstagramLinkChange={setInstagramLink}
            onWebsiteLinkChange={setWebsiteLink}
          />
        )
      case 4:
        return (
          <Step4Security
            password={password}
            confirmPassword={confirmPassword}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onToggleShowPassword={() => setShowPassword(!showPassword)}
            onToggleShowConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        )
      case 5:
        return (
          <Step5OtpVerification
            email={email}
            otp={otp}
            otpTimer={otpTimer}
            isOtpSent={isOtpSent}
            isLoading={isLoading}
            onOtpChange={setOtp}
            onResendOtp={handleSendOtp}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex gap-[2%] w-full max-w-4xl mx-auto px-[8%]">
      <StepIndicator steps={steps} currentStep={currentStep} />

      <div className="flex-1">
        <form onSubmit={currentStep === 5 ? handleVerifyOtp : handleSubmit} className="space-y-6">
          {renderCurrentStep()}

          <NavigationButtons
            currentStep={currentStep}
            isStepValid={isStepValid()}
            isLoading={isLoading}
            isVerifyingOtp={isVerifyingOtp}
            onBack={handleBack}
            onNext={handleNext}
            onSendOtp={handleSendOtp}
            onVerifyOtp={() => handleVerifyOtp({} as React.FormEvent)}
          />

          {(error || otpError) && (
            <p className="text-sm text-red-600 text-center bg-red-50 py-2 px-4 rounded-lg">
              {error?.message || otpError?.message}
            </p>
          )}

          {isOtpVerified && otpData?.data?.verified && (
            <p className="text-sm text-green-600 text-center bg-green-50 py-2 px-4 rounded-lg">
              ✅ {otpData.message || 'Email verified successfully!'}
            </p>
          )}

          <div className="text-center pt-4">
            <p className="text-sm text-neutral-600">
              Already have an account?{' '}
              <a href="/auth?mode=login" className="text-primary hover:underline font-medium">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignupForm