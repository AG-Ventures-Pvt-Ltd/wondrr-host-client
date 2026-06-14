import { useMutation } from '@tanstack/react-query'
import { baseAPI } from '@/common/services/baseApi'
import { logError } from '@/common/utils/logError'
import { notify } from '@/common/utils/notify'
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints'

export const useDeleteTrip = () => {
  return useMutation({
    mutationFn: async (slug: string) => {
      const response = await baseAPI.post(API_ENDPOINTS.TRIPS.DELETE_TRIP(slug))
      return response.data
    },
    onSuccess: () => {
      notify.success('Trip deleted successfully')
    },
    onError: (error: Error) => {
      const axiosError = error as { response?: { data?: { message?: string } } }
      const message = axiosError?.response?.data?.message || error?.message || 'Failed to delete trip'
      notify.error(message)
      logError({ error: message, location: 'useDeleteTrip', when: 'deleting trip' })
    },
  })
}
