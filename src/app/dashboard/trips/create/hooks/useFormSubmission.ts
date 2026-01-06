import { useTripFormStore } from '../store'
import usePostData from '@/common/services/usePostData'
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints'
import { validateTripForm, prepareSubmissionData, scrollToTop } from '../utils'

interface UseFormSubmissionOptions {
  onSuccess?: (tripId?: string) => void
  onError?: (error: Error) => void
  isEditMode?: boolean
  tripId?: string
}

export const useFormSubmission = ({ onSuccess, onError, isEditMode = false, tripId }: UseFormSubmissionOptions = {}) => {
  const { setValidationErrors, resetForm } = useTripFormStore()

  const createTripMutation = usePostData({
    url: isEditMode && tripId ? API_ENDPOINTS.TRIPS.EDIT_HOST_TRIP(tripId) : API_ENDPOINTS.TRIPS.CREATE_HOST_TRIP,
    onSuccess: (data: unknown) => {
      if (!isEditMode) {
        resetForm()
      }
      const responseData = data as { trip?: { id?: string } }
      const newTripId = responseData?.trip?.id || tripId
      onSuccess?.(newTripId)
    },
    onError: (error) => {
      onError?.(error as Error)
    },
  })

  const handleSubmit = () => {
    const formData = useTripFormStore.getState()
    const validation = validateTripForm(formData)

    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      scrollToTop()
      return
    }

    const submissionData = prepareSubmissionData(formData)
    createTripMutation.mutate(submissionData)
  }

  return {
    handleSubmit,
    isSubmitting: createTripMutation.isPending,
    error: createTripMutation.error,
  }
}
