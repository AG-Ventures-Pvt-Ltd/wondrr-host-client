import { useGetData } from '@/common/services/useGetData';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';

interface TripApiResponse {
  _id: string;
  title: string;
  batches: number;
  slug: string;
}

interface Trip {
  id: string;
  name: string;
  batches: string;
  slug: string;
}

export const useTrips = () => {
  const { data, isLoading, error, refetch } = useGetData<TripApiResponse[]>(
    API_ENDPOINTS.TRIPS.GET_HOST_TRIPS
  );

  const trips: Trip[] = data?.map((trip) => ({
    id: trip._id,
    name: trip.title,
    batches: `${trip.batches} ${trip.batches === 1 ? 'batch' : 'batches'}`,
    slug: trip.slug,
  })) || [];

  return {
    trips,
    isLoading,
    error,
    refetch,
  };
};