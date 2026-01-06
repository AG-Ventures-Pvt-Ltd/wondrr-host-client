import { useGetData } from '@/common/services/useGetData';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { TripListApiResponse, TripList } from '../types';

export const useTrips = () => {
  const { data, isLoading, error, refetch } = useGetData<TripListApiResponse[]>(
    API_ENDPOINTS.TRIPS.GET_HOST_TRIPS
  );

  const trips: TripList[] = data?.map((trip) => ({
    id: trip._id,
    name: trip.title,
    batches: `${trip.batches} ${trip.batches === 1 ? 'batch' : 'batches'}`,
    slug: trip.slug,
    image: trip.image,
    location: trip.location,
    upcomingBatches: trip.upcomingBatches || 0,
    completedBatches: trip.completedBatches || 0,
    status: trip.status || 'draft',
  })) || [];

  return {
    trips,
    isLoading,
    error,
    refetch,
  };
};