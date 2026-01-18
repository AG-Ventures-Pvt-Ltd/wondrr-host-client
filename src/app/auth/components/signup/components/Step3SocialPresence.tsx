import React from 'react'
import CustomInput from '@/common/components/composites/CustomInput'
import { Link, Globe, Briefcase } from 'lucide-react'

interface Step3SocialPresenceProps {
  instagramLink: string
  websiteLink: string
  yearsOfExperience: number
  instagramError: string
  websiteError: string
  yearsOfExperienceError: string
  onInstagramLinkChange: (value: string) => void
  onWebsiteLinkChange: (value: string) => void
  onYearsOfExperienceChange: (value: number) => void
  onInstagramBlur: () => void
  onWebsiteBlur: () => void
  onYearsOfExperienceBlur: () => void
}

const Step3SocialPresence: React.FC<Step3SocialPresenceProps> = ({
  instagramLink,
  websiteLink,
  yearsOfExperience,
  instagramError,
  websiteError,
  yearsOfExperienceError,
  onInstagramLinkChange,
  onWebsiteLinkChange,
  onYearsOfExperienceChange,
  onInstagramBlur,
  onWebsiteBlur,
  onYearsOfExperienceBlur
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-medium text-maintext mb-1">
          Connect your social presence
        </h2>
        <p className="text-sm text-subtext">
          Let travelers discover more about you
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">
            Your Instagram profile <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <CustomInput
              type="url"
              placeholder="https://instagram.com/yourusername"
              className="pl-12"
              value={instagramLink}
              onChange={(e) => onInstagramLinkChange(e.target.value)}
              onBlur={onInstagramBlur}
              required
            />
          </div>
          {instagramError && <p className="text-xs text-red-500">{instagramError}</p>}
          <p className="text-xs text-neutral-500">
            This helps build trust with travelers
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">
            Website link <span className="text-neutral-400">(Optional)</span>
          </label>
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <CustomInput
              type="url"
              placeholder="https://yourwebsite.com"
              className="pl-12"
              value={websiteLink}
              onChange={(e) => onWebsiteLinkChange(e.target.value)}
              onBlur={onWebsiteBlur}
            />
          </div>
          {websiteError && <p className="text-xs text-red-500">{websiteError}</p>}
          <p className="text-xs text-neutral-500">
            Preferred, if you have one
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">
            Years of Experience <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <CustomInput
              type="number"
              placeholder="e.g., 5"
              className="pl-12"
              value={yearsOfExperience.toString()}
              onChange={(e) => onYearsOfExperienceChange(parseInt(e.target.value) || 0)}
              onBlur={onYearsOfExperienceBlur}
              min="0"
              required
            />
          </div>
          {yearsOfExperienceError && <p className="text-xs text-red-500">{yearsOfExperienceError}</p>}
          <p className="text-xs text-neutral-500">
            How many years have you been hosting experiences?
          </p>
        </div>
      </div>
    </div>
  )
}

export default Step3SocialPresence