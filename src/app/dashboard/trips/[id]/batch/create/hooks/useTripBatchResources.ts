import { useGetData } from '@/common/services/useGetData'
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints'
import { TripBatchResources } from '../types'

export const useTripBatchResources = (tripSlug: string) => {
  const url = tripSlug
    ? API_ENDPOINTS.TRIPS.GET_TRIP_BATCH_RESOURCES(tripSlug)
    : ''

  const { data, isLoading, error, refetch } = useGetData<TripBatchResources>(
    url,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { enabled: !!tripSlug, queryKey: [url] } as any
  )

  return {
    locations: data?.locations ?? [],
    totalDays: data?.totalDays ?? 0,
    isLoading: !!tripSlug && isLoading,
    error,
    refetch,
  }
}

