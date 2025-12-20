import { useState } from 'react'
import { useBatchFormStore } from '../store'
import { validateBatchForm, prepareSubmissionData, scrollToTop } from '../utils'
import  usePostData  from '@/common/services/usePostData'
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints'


interface UseFormSubmissionProps {
  tripId?: string 
  isEditMode?: boolean
  batchId?: string
  onSuccess?: () => void
}

export const useFormSubmission = ({ tripId, isEditMode = false, batchId, onSuccess }: UseFormSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formData = useBatchFormStore()
  const { setValidationErrors } = useBatchFormStore()

  // Create batch mutation
  const { mutate: createBatch } = usePostData({
    url: `/api/client/v1/trips/host/trip/batch/create`,
    onSuccess: () => {
      onSuccess?.()
      setIsSubmitting(false)
    },
  })

  // Edit batch mutation
  const { mutate: editBatch } = usePostData({
    url: isEditMode && batchId ? API_ENDPOINTS.TRIPS.EDIT_BATCH(batchId) : '',
    onSuccess: () => {
      onSuccess?.()
      setIsSubmitting(false)
    },
  })

  const handleSubmit = async () => {
    scrollToTop()
    
    const validation = validateBatchForm(formData)

    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      return
    }

    setIsSubmitting(true)

    try {
      const submissionData = prepareSubmissionData(formData, tripId!)
      
      if (isEditMode && batchId) {
        editBatch(submissionData)
      } else {
        createBatch(submissionData)
      }
      setIsSubmitting(false)
      
      // Temporary success simulation
      console.log(isEditMode ? 'Batch edit data:' : 'Batch submission data:', submissionData)
      
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} batch:`, error)
      setIsSubmitting(false)
      setValidationErrors([`An error occurred while ${isEditMode ? 'updating' : 'creating'} the batch. Please try again.`])
    }
  }

  return {
    handleSubmit,
    isSubmitting,
  }
}
