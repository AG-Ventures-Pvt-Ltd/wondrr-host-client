import { useInfiniteQuery } from '@tanstack/react-query';
import { getData } from '@/common/services/baseApi';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { TripBatchesResponse } from '../types';

export const useInfiniteTripBatches = (slug: string, limit: number = 10, status?: string) => {
  const query = useInfiniteQuery<TripBatchesResponse>({
    queryKey: ['tripBatches', slug, limit, status],
    queryFn: ({ pageParam = 1 }) =>
      getData<TripBatchesResponse>(
        API_ENDPOINTS.TRIPS.GET_TRIP_BATCHES(slug, pageParam as number, limit, status)
      ),
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? (lastPage.page ?? 1) + 1 : undefined,
    initialPageParam: 1,
  });

  const tripBatches = query.data?.pages.flatMap((p) => p.batches) ?? [];
  const title = query.data?.pages[0]?.tripTitle;
  const location = query.data?.pages[0]?.tripLocation;

  return {
    tripBatches,
    title,
    location,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
  };
};
