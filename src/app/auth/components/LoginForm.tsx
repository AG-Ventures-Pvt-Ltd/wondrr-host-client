import React, { useState } from 'react'
import CustomInput from '@/common/components/composites/CustomInput'
import  Button from '@/common/components/atoms/Button'
import { useLogin } from '../hooks/useLogin'
import { useVerifyOtp } from '@/common/hooks/useVerifyOtp'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { notify } from '@/common/utils/notify'


const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const { login, isLoading, error } = useLogin()
  const { verifyOtp, isLoading: isVerifying, error: otpError } = useVerifyOtp()

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (showOtp) {
      const result = await verifyOtp({ email, otp })
      if (result.success && result.data?.verified) {
        setShowOtp(false)
        setOtp('')
        setPassword('')
      } else {
        notify.error('Invalid OTP')
      }
    } else {
      // Login
      await login({ email, password })
      if (error === 'OTP_NOT_VERIFIED') {
        setShowOtp(true)
      } else if (!error) {
        router.push('/dashboard')
        notify.success('Login Successful!')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 px-[25%]">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-maintext">Welcome back</h1>
        <p className="text-subtext">Sign in to access your dashboard</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-neutral-600">Email address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <CustomInput
              type="email"
              placeholder="you@company.com"
              className="pl-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        {!showOtp && (
          <div className="space-y-2">
            <label className="text-sm text-neutral-600">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <CustomInput
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="pl-12 pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        )}
        {showOtp && (
          <div className="space-y-2">
            <label className="text-sm text-neutral-600">OTP</label>
            <CustomInput
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
        )}
        {!showOtp && (
          <div className="flex items-center justify-end">
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>
        )}
        <Button
          type="submit"
          className="w-full py-3.5 rounded-2xl font-normal shadow-sm"
          disabled={isLoading || isVerifying}
        >
          {isLoading || isVerifying ? (showOtp ? 'Verifying...' : 'Signing in...') : (showOtp ? 'Verify OTP' : 'Sign in to Dashboard')}
          <ArrowRight className="w-5 h-5" />
        </Button>
        {(error && error !== 'OTP_NOT_VERIFIED') && (
          <p className="text-sm text-red-600 text-center mt-4">{error}</p>
        )}
        {otpError && (
          <p className="text-sm text-red-600 text-center mt-4">{otpError.message}</p>
        )}
      </div>
      <div className="">
        <p className="text-center text-sm text-neutral-600">
          Don&apos;t have an account?{' '}
          <a href="/auth?mode=signup" className="text-primary hover:underline">
            Sign up for Wondrr
          </a>
        </p>
      </div>
    </form>
  )
}

export default LoginForm
