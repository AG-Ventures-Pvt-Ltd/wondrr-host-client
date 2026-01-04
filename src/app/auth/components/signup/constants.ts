import { Step } from './types'

export const steps: Step[] = [
  { id: 1, name: 'About You', description: 'Tell us who you are' },
  { id: 2, name: 'Contact Details', description: 'How can we reach you?' },
  { id: 3, name: 'Social Presence', description: 'Connect your socials' },
  { id: 4, name: 'Security', description: 'Secure your account' },
  { id: 5, name: 'Verify Email', description: 'Confirm your email address' }
]

export const OTP_TIMER_DURATION = 300 