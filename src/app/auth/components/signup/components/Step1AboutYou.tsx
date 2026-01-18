import React from 'react'
import CustomInput from '@/common/components/composites/CustomInput'
import CustomSelect from '@/common/components/composites/CustomSelect'
import { Building2, User } from 'lucide-react'

interface Step1AboutYouProps {
  hostType: string
  fullName: string
  onHostTypeChange: (value: string) => void
  onFullNameChange: (value: string) => void
}

const Step1AboutYou: React.FC<Step1AboutYouProps> = ({
  hostType,
  fullName,
  onHostTypeChange,
  onFullNameChange
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-xl font-medium text-maintext mb-1">
          Let&apos;s start with the basics
        </h2>
        <p className="text-sm text-subtext">
          Help us understand who we&apos;re working with
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">
            Are you joining us as an individual or representing an organization?
          </label>
          <CustomSelect
            value={hostType}
            onChange={onHostTypeChange}
            options={[
              { value: 'Individual', label: 'Individual - Just me!' },
              { value: 'Organization', label: 'Organization - We\'re a team' }
            ]}
            placeholder="Choose your type"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700">
            {hostType === 'Organization'
              ? 'What\'s your company called?'
              : 'What\'s your full name?'}
          </label>
          <div className="relative">
            {hostType === 'Organization' ? (
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            ) : (
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            )}
            <CustomInput
              type="text"
              placeholder={hostType === 'Organization' ? 'Acme Travel Co.' : 'John Doe'}
              className="pl-12"
              value={fullName}
              onChange={(e) => onFullNameChange(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step1AboutYou