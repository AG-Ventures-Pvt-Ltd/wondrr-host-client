import { useMutation } from '@tanstack/react-query'
import { baseAPI } from '@/common/services/baseApi'
import { logError } from '@/common/utils/logError'
import { notify } from '@/common/utils/notify'
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints'

interface UpdateTripStatusParams {
  tripId: string
  status: string
}

export const useUpdateTripStatus = () => {
  return useMutation({
    mutationFn: async ({ tripId, status }: UpdateTripStatusParams) => {
      const response = await baseAPI.post(API_ENDPOINTS.TRIPS.CHANGE_TRIP_STATUS, { tripId, status })
      return response.data
    },
    onSuccess: () => {
      notify.success('Trip status updated successfully!')
    },
    onError: (error: Error) => {
      const axiosError = error as { response?: { data?: { message?: string } } }
      const errorMessage = axiosError?.response?.data?.message || error?.message || 'Failed to update trip status'
      notify.error(errorMessage)
      logError({
        error: errorMessage,
        location: 'useUpdateTripStatus',
        when: 'updating trip status',
      })
    },
  })
}