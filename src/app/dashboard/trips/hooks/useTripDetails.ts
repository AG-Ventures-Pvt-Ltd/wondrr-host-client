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
    tripImages: data.tripImages || [],
    tags: data.tags || [],
    faqs: data.faqs || [],
    itinerary: data.itinerary || [],
    inclusions: data.inclusions || [],
    exclusions: data.exclusions || [],
    thingsToCarry: data.thingsToCarry || [],
    highlights: data.highlights || [],
    category: Array.isArray(data.category) ? data.category : (data.category ? [data.category] : []),
    isFemaleOnly: data.isFemaleOnly ?? false,
    difficulty: data.difficulty,
    rating: data.rating,
    totalReviews: data.totalReviews,
    cancellationPolicy: data.cancellationPolicy,
    pricing: data.pricing,
    additionalInfo: data?.additionalInfo,
    status: data.status,
    isAdvanceBookingAllowed: data.pricing?.isAdvanceBookingAllowed ?? false,
    advanceBookingPrice: data.pricing?.advanceBookingPrice ?? 0,
    totalViews: data.totalViews,
    totalShares: data.totalShares,
    stats: {
      batches: data.stats?.tripBatchesCount || 0,
      totalRevenue: `₹${(data.stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
    },
  } : null;

  return {
    tripDetails,
    isLoading,
    error,
    refetch,
  };
};