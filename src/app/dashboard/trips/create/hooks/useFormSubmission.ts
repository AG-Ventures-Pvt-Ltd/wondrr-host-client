import { useTripFormStore } from '../store'
import { useMutation } from '@tanstack/react-query'
import { baseAPI } from '@/common/services/baseApi'
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints'
import { validateTripForm, prepareSubmissionData, scrollToTop } from '../utils'
import { notify } from '@/common/utils/notify'
import { logError } from '@/common/utils/logError'

interface UseFormSubmissionOptions {
  onSuccess?: (tripId?: string) => void
  onError?: (error: Error) => void
  isEditMode?: boolean
  tripId?: string
  /**
   * Getter that returns the slug of a draft trip that was auto-saved during
   * step navigation. When provided and non-null, the final submit will UPDATE
   * that draft rather than creating a second trip.
   */
  getSavedDraftSlug?: () => string | null
}

export const useFormSubmission = ({ onSuccess, onError, isEditMode = false, tripId, getSavedDraftSlug }: UseFormSubmissionOptions = {}) => {
  const { setValidationErrors, resetForm } = useTripFormStore()

  const createTripMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      // Resolve the correct endpoint at call time:
      // 1. Edit mode with a tripId from props → update that trip
      // 2. New trip where auto-save already created a draft → update the draft (prevents double-create)
      // 3. Fresh new trip with no draft yet → create
      const savedSlug = getSavedDraftSlug?.()
      const effectiveSlug = isEditMode ? tripId : savedSlug
      const url = effectiveSlug
        ? API_ENDPOINTS.TRIPS.EDIT_HOST_TRIP(effectiveSlug)
        : API_ENDPOINTS.TRIPS.CREATE_HOST_TRIP
      const res = await baseAPI.post(url, payload)
      return res.data
    },
    onSuccess: (data: unknown) => {
      if (!isEditMode) {
        resetForm()
      }
      notify.success((data as { message?: string })?.message || 'Success!')
      const responseData = data as { trip?: { id?: string } }
      const newTripId = responseData?.trip?.id || tripId
      onSuccess?.(newTripId)
    },
    onError: (error: Error) => {
      const axiosError = error as { response?: { data?: { message?: string } } }
      const errorMessage = axiosError?.response?.data?.message || error?.message || 'Something went wrong!'
      notify.error(errorMessage)
      logError({ error: errorMessage, location: 'useFormSubmission.ts', when: 'submitting trip form' })
      onError?.(error)
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
    createTripMutation.mutate(submissionData as Record<string, unknown>)
  }

  return {
    handleSubmit,
    isSubmitting: createTripMutation.isPending,
    error: createTripMutation.error,
  }
}
