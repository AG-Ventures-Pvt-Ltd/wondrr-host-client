'use client'

import React, { useState, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Check, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BasicInfoStep from './steps/BasicInfoStep'
import PricingStep from './steps/PricingStep'
import ItineraryStep from './steps/ItineraryStep'
import InclusionsExclusionsStep from './steps/InclusionsExclusionsStep'
import MediaAdditionalStep from './steps/MediaAdditionalStep'
import ConfirmDiscardModal from './ConfirmDiscardModal'
import Button from '@/common/components/atoms/Button'
import BackButton from '@/common/ui/BackButton'
import Modal from '@/common/components/composites/Modal'
import { useTripFormStore } from '../store'
import { useFormSubmission } from '../hooks'
import { FORM_STEPS } from '../constants'
import { prepareSubmissionData } from '../utils'
import { baseAPI } from '@/common/services/baseApi'
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints'

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
  const [isSavingStep, setIsSavingStep] = useState(false)

  // Tracks the slug of an auto-saved draft for new trips so subsequent steps can update it
  const savedTripSlugRef = useRef<string | null>(isEditMode ? (tripId ?? null) : null)
  // Per-step JSON snapshots of the last successfully saved data for each step
  const stepSnapshotsRef = useRef<Record<number, string>>({})

  /** Extract only the fields that belong to a given step */
  const getStepFields = (step: number, formState: ReturnType<typeof useTripFormStore.getState>) => {
    switch (step) {
      case 1:
        return {
          title: formState.title,
          description: formState.description,
          type: formState.type,
          difficulty: formState.difficulty,
          category: formState.category,
          tags: formState.tags,
          location: formState.location,
          isFemaleOnly: formState.isFemaleOnly,
        }
      case 2:
        return {
          pricings: formState.pricings,
          addOns: formState.addOns,
          cancellationPolicy: formState.cancellationPolicy,
          isAdvanceBookingAllowed: formState.isAdvanceBookingAllowed,
          advanceBookingPrice: formState.advanceBookingPrice,
        }
      case 3:
        return { itinerary: formState.itinerary }
      case 4:
        return {
          inclusions: formState.inclusions,
          exclusions: formState.exclusions,
          highlights: formState.highlights,
          thingsToCarry: formState.thingsToCarry,
        }
      case 5:
        return {
          tripImages: formState.tripImages,
          faqs: formState.faqs,
          additionalInfo: formState.additionalInfo,
        }
      default:
        return {}
    }
  }

  const { currentStep, validationErrors, nextStep, previousStep, title, description, category, tags, location, tripImages, faqs, pricings, itinerary, inclusions, exclusions, additionalInfo, cancellationPolicy } = useTripFormStore()

  // When entering a step, snapshot its current state as the saved baseline.
  // This ensures visiting a step without editing it never triggers an API call.
  React.useEffect(() => {
    const formState = useTripFormStore.getState()
    const stepFields = getStepFields(currentStep, formState)
    const snapshot = JSON.stringify(stepFields)
    // Only set if no saved snapshot yet for this step (don't overwrite a post-save baseline)
    if (!stepSnapshotsRef.current[currentStep]) {
      stepSnapshotsRef.current[currentStep] = snapshot
    }
  }, [currentStep]) // eslint-disable-line react-hooks/exhaustive-deps

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

  /** Attempt a silent background save only if the current step's fields have changed. */
  const autoSaveStep = useCallback(async (): Promise<void> => {
    const formState = useTripFormStore.getState()
    const step = formState.currentStep
    const stepFields = getStepFields(step, formState)
    const currentSnapshot = JSON.stringify(stepFields)

    // Skip if nothing changed in this step since last save
    if (currentSnapshot === (stepSnapshotsRef.current[step] ?? '')) return

    setIsSavingStep(true)
    try {
      const submissionData = prepareSubmissionData(formState)
      if (!savedTripSlugRef.current) {
        // First save for a new trip — create the draft
        const res = await baseAPI.post(API_ENDPOINTS.TRIPS.CREATE_HOST_TRIP, submissionData as Record<string, unknown>)
        const slug = res.data?.data?.slug as string | undefined
        if (slug) {
          savedTripSlugRef.current = slug
        }
      } else {
        // Subsequent saves — update the existing trip
        await baseAPI.post(
          API_ENDPOINTS.TRIPS.EDIT_HOST_TRIP(savedTripSlugRef.current),
          submissionData as Record<string, unknown>
        )
      }
      // Update snapshot only for the current step on success
      stepSnapshotsRef.current[step] = currentSnapshot
    } catch {
      // Silent fail — local state is intact, no need to block navigation
    } finally {
      setIsSavingStep(false)
    }
  }, [getStepFields])

  const handleNext = useCallback(async () => {
    await autoSaveStep()
    nextStep()
  }, [autoSaveStep, nextStep])

  const hasFormData = () => {
    return (
      title.trim() !== '' ||
      description.trim() !== '' ||
      category.length > 0 ||
      tags.length > 0 ||
      location.address.trim() !== '' ||
      location.city.trim() !== '' ||
      location.state.trim() !== '' ||
      location.latitude !== null ||
      location.longitude !== null ||
      tripImages.length > 0 ||
      faqs.length > 0 ||
      pricings.length > 0 ||
      itinerary.some(day => day.title.trim() !== '' || day.description.trim() !== '') ||
      inclusions.length > 0 ||
      exclusions.length > 0 ||
      cancellationPolicy.length > 0 ||
      additionalInfo.trim() !== ''
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
        return <PricingStep isEditMode={isEditMode} />
      case 3:
        return <ItineraryStep isEditMode={isEditMode} />
      case 4:
        return <InclusionsExclusionsStep isEditMode={isEditMode} />
      case 5:
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
          {isSavingStep && (
            <div className="flex items-center gap-1.5 ml-4 text-xs text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Saving…
            </div>
          )}
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
              <Button onClick={handleNext} className="text-white" disabled={isSavingStep}>
                {isSavingStep ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                )}
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