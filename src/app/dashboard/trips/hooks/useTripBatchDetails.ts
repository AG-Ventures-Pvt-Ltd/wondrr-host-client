import { useGetData } from '@/common/services/useGetData';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { TripBatchesResponse } from '../types';

export const useTripBatchDetails = (slug: string, page: number = 1, limit: number = 2) => {
  const { data, isLoading, error, refetch } = useGetData<TripBatchesResponse>(
    API_ENDPOINTS.TRIPS.GET_TRIP_BATCHES(slug, page, limit)
  );

  return {
    tripBatches: data?.batches || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || limit,
    title: data?.tripTitle,
    location: data?.tripLocation,    hasNextPage: data?.hasNextPage || false,
    hasPrevPage: data?.hasPrevPage || false,
    totalPages: data?.totalPages || 0,    
    isLoading,
    error,
    refetch,
  };
};

