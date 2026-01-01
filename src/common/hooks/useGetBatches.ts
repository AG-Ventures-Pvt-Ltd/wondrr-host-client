import { useGetData } from '@/common/services/useGetData';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import type { UseQueryOptions } from '@tanstack/react-query';

export interface BatchItem {
  _id: string;
  tripTitle: string;
  startDate: string;
  endDate: string;
  totalBookings: number;
  totalSeats: number;
  status: string;
}

interface UseGetBatchesOptions {
  enabled?: boolean;
}

export const useGetBatches = (options: UseGetBatchesOptions = {}) => {
  const {  enabled = true } = options;

  const { data, isLoading, error, refetch } = useGetData<BatchItem[]>(
    API_ENDPOINTS.HOME.GET_UPCOMING_BATCHES(4),
    {
      enabled,
    } as UseQueryOptions<BatchItem[], Error>
  );

  return {
    batches: data || [],
    isLoading,
    error,
    refetch,
  };
};
