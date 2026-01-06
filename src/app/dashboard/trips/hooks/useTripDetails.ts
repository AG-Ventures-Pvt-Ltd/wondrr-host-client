import { useGetData } from '@/common/services/useGetData';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { TripDetailsApiResponse, TripDetails } from '../types';

export const useTripDetails = (slug: string) => {
  const { data, isLoading, error, refetch } = useGetData<TripDetailsApiResponse>(
    API_ENDPOINTS.TRIPS.GET_TRIP_DETAILS(slug)
  );

  const tripDetails: TripDetails | null = data ? {
    id: data._id,
    title: data.title,
    description: data.description,
    location: data.location?.address + ', ' + data.location?.city,
    locationObj: {
      address: data.location?.address || '',
      city: data.location?.city || '',
      state: data.location?.state || '',
    },
    image : data.images?.[0],
    images: data.images || [],
    tags : data.tags || [],
    faqs : data.faqs || [],
    itinerary: data.itinerary || [],
    inclusions: data.inclusions || [],
    exclusions: data.exclusions || [],
    category : data.category,
    basePrice: data.basePrice,
    price: data.price,
    additionalInfo : data?.additionalInfo,
    sharingPrice : data.sharingPrice ,
    stats: {
        batches : data.stats?.tripBatchesCount, 
        totalRevenue : `₹${data.stats?.totalRevenue}`,
    },
    // Map other fields
  } : null;

  return {
    tripDetails,
    isLoading,
    error,
    refetch,
  };
};