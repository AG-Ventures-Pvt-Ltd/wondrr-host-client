'use client'

import React from 'react'
import { ChevronLeft, ChevronRight, Check, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BasicInfoStep from './steps/BasicInfoStep'
import PricingItineraryStep from './steps/PricingItineraryStep'
import InclusionsExclusionsStep from './steps/InclusionsExclusionsStep'
import MediaAdditionalStep from './steps/MediaAdditionalStep'
import Button from '@/common/components/atoms/Button'
import { useTripFormStore } from '../store'
import { useFormSubmission } from '../hooks'
import { FORM_STEPS } from '../constants'

interface TripFormProps {
  onCancel?: () => void
  onSuccess?: () => void
  isEditMode?: boolean
  tripId?: string
}

const TripForm: React.FC<TripFormProps> = ({ onCancel, onSuccess, isEditMode = false, tripId }) => {

  const router = useRouter()

  const { currentStep, validationErrors, nextStep, previousStep } = useTripFormStore()

  const { handleSubmit, isSubmitting } = useFormSubmission({ onSuccess, isEditMode, tripId })

  const handleBackToTrips = () => {
    if (isEditMode && tripId) {
      router.push(`/dashboard/trips/${tripId}`)
    } else {
      router.push('/dashboard/trips')
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep isEditMode={isEditMode} />
      case 2:
        return <PricingItineraryStep isEditMode={isEditMode} />
      case 3:
        return <InclusionsExclusionsStep isEditMode={isEditMode} />
      case 4:
        return <MediaAdditionalStep />
      default:
        return null
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div >
        <div className="flex items-center">
          <ArrowLeft size={32} className='mr-4 cursor-pointer' onClick={handleBackToTrips} />
          <h1 className="text-xl font-normal text-neutral-900">{isEditMode ? 'Edit Trip' : 'Create New Trip'}</h1>
        </div>
        <div className="mb-8 bg-white border-b border-b-[#d9d7d7] p-6 sticky -top-10 flex justify-between items-center z-10">
          <div className="flex-1 flex items-center gap-2">
            {FORM_STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${currentStep === step.id
                      ? 'border-primary bg-primary text-white'
                      : currentStep > step.id
                        ? 'bg-success-bg text-white'
                        : 'border-gray-300 bg-white text-gray-500'
                      }`}
                  >
                    {currentStep > step.id ? (
                      <Check className={`w-5 h-5 ${currentStep >= step.id ? 'text-success' : ''}`} strokeWidth={3}/>
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="hidden md:block flex-1">
                    <p
                      className={`text-sm font-medium ${currentStep >= step.id ? 'text-primary' : 'text-gray-500'
                        }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < FORM_STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 transition-colors ${currentStep > step.id ? 'bg-primary' : 'bg-gray-300'
                      }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        {validationErrors.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm text-red-700">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className='px-12 pr-12'>
          {renderStepContent()}
        </div>
      </div>
      <div className="py-6 px-12 pr-24">
        <div className="flex w-full justify-end gap-4">
          <div>
            {currentStep === 1 && (
              <Button variant="text" onClick={onCancel}>
                Cancel
              </Button>
            )}
            {currentStep > 1 && (
              <Button variant="text" onClick={previousStep}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep < FORM_STEPS.length ? (
              <Button onClick={nextStep} className="text-white">
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (isEditMode ? 'Updating Trip...' : 'Creating Trip...') : (isEditMode ? 'Update Trip' : 'Create Trip')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripForm