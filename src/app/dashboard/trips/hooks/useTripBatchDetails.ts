import { useGetData } from '@/common/services/useGetData';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { TripBatchDetails } from '../types';

export const useTripBatchDetails = (slug: string) => {
  const { data, isLoading, error, refetch } = useGetData<TripBatchDetails[]>(
    API_ENDPOINTS.TRIPS.GET_TRIP_BATCHES(slug)
  );

  return {
    tripBatches: data || [],
    isLoading,
    error,
    refetch,
  };
};

