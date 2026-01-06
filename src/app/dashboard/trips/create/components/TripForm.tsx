'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Check, AlertTriangle, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BasicInfoStep from './steps/BasicInfoStep'
import PricingItineraryStep from './steps/PricingItineraryStep'
import InclusionsExclusionsStep from './steps/InclusionsExclusionsStep'
import MediaAdditionalStep from './steps/MediaAdditionalStep'
import ConfirmDiscardModal from './ConfirmDiscardModal'
import Button from '@/common/components/atoms/Button'
import BackButton from '@/common/ui/BackButton'
import Modal from '@/common/components/composites/Modal'
import { useTripFormStore } from '../store'
import { useFormSubmission } from '../hooks'
import { FORM_STEPS } from '../constants'

interface TripFormProps {
  isEditMode?: boolean
  tripId?: string
}

const TripForm: React.FC<TripFormProps> = ({ isEditMode = false, tripId }) => {

  const router = useRouter()
  const [showDiscardModal, setShowDiscardModal] = useState(false)
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<{ success: boolean; error?: string; tripId?: string } | null>(null)

  const { currentStep, validationErrors, nextStep, previousStep, title, description, category, tags, location, tripImages, faqs, basePrice, price, itinerary, inclusions, exclusions } = useTripFormStore()

  const { handleSubmit, isSubmitting } = useFormSubmission({ 
    onSuccess: (tripId?: string) => {
      setSubmissionResult({ success: true, tripId })
      setShowSubmitConfirmModal(false)
      setShowResultModal(true)
    },
    onError: (error: Error) => {
      setSubmissionResult({ success: false, error: error.message })
      setShowSubmitConfirmModal(false)
      setShowResultModal(true)
    },
    isEditMode, 
    tripId 
  })

  const hasFormData = () => {
    return (
      title.trim() !== '' ||
      description.trim() !== '' ||
      category !== '' ||
      tags.length > 0 ||
      location.address.trim() !== '' ||
      location.city.trim() !== '' ||
      location.state.trim() !== '' ||
      location.latitude !== null ||
      location.longitude !== null ||
      tripImages.length > 0 ||
      faqs.length > 0 ||
      basePrice !== null ||
      price !== null ||
      itinerary.some(day => day.title.trim() !== '' || day.description.trim() !== '' || day.activities.length > 0) ||
      inclusions.length > 0 ||
      exclusions.length > 0
    )
  }

  const handleBackToTrips = () => {
    if (hasFormData()) {
      setShowDiscardModal(true)
    } else {
      if (isEditMode && tripId) {
        router.push(`/dashboard/trips/${tripId}`)
      } else {
        router.push('/dashboard/trips')
      }
    }
  }

  const handleConfirmSubmit = () => {
    setShowSubmitConfirmModal(false)
    handleSubmit()
  }

  const handleViewTrip = () => {
    if (submissionResult?.tripId) {
      router.push(`/dashboard/trips/${submissionResult.tripId}`)
    } else {
      router.push('/dashboard/trips')
    }
    setShowResultModal(false)
  }

  const handleAddBatch = () => {
    if (submissionResult?.tripId) {
      router.push(`/dashboard/trips/${submissionResult.tripId}/batch/create`)
    }
    setShowResultModal(false)
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
          <BackButton onClick={handleBackToTrips} iconSize={32} className='mr-4' label="" />
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
              <Button variant="text" onClick={handleBackToTrips}>
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
                onClick={() => setShowSubmitConfirmModal(true)}
                disabled={isSubmitting}
              >
                {isEditMode ? 'Update Trip' : 'Create Trip'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <ConfirmDiscardModal
        open={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
      />

      {/* Trip Creation/Update Confirmation Modal */}
      <Modal
        open={showSubmitConfirmModal}
        onClose={() => setShowSubmitConfirmModal(false)}
        title={isEditMode ? "Update Trip?" : "Create Trip?"}
        description={`Are you sure you want to ${isEditMode ? 'update' : 'create'} this trip?`}
        submitText={isEditMode ? "Update Trip" : "Create Trip"}
        onSubmit={handleConfirmSubmit}
        cancelText="Cancel"
      />

      {/* Trip Result Modal */}
      <Modal
        open={showResultModal}
        onClose={() => setShowResultModal(false)}
        title=""
        description=""
        showButtons={false}
      >
        <div className="text-center py-6">
          {submissionResult?.success ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {isEditMode ? 'Trip Updated Successfully!' : 'Trip Created Successfully!'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Your trip has been {isEditMode ? 'updated' : 'created'} and is now live.
                </p>
              </div>
              <div className="flex gap-3 justify-center pt-4">
                <Button variant="outlined" onClick={handleViewTrip}>
                  See Trip
                </Button>
                <Button onClick={handleAddBatch}>
                  Add Batch
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {isEditMode ? 'Trip Update Failed' : 'Trip Creation Failed'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {submissionResult?.error || 'An unexpected error occurred. Please try again.'}
                </p>
              </div>
              <div className="flex gap-3 justify-center pt-4">
                <Button onClick={() => setShowResultModal(false)}>
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default TripForm