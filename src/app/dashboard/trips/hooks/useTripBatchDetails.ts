import { useGetData } from '@/common/services/useGetData';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';

interface TripBatch {
  id: string;
  date: string;
  status: string;
  duration: string;
  priceRange: string;
  seats: string;
  revenue: string;
  occupancy: string;
}

export const useTripBatchDetails = (slug: string) => {
  const { data, isLoading, error, refetch } = useGetData<TripBatch[]>(
    API_ENDPOINTS.TRIPS.GET_TRIP_BATCHES(slug)
  );

  return {
    tripBatches: data || [],
    isLoading,
    error,
    refetch,
  };
};

