import { useGetData } from '@/common/services/useGetData';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';

interface TripDetailsApiResponse {
  _id: string;
  title: string;
  location: {
    address: string;
    city: string;
    state: string;
  };
  description: string;
  images: string[];
  tags: string[];
  category: string;
  faqs: [{ question: string; answer: string }];
  itinerary: Array<{
    day: string;
    title?: string;
    description: string;
    activities?: string[];
  }>;
  inclusions: string[];
  exclusions: string[];
  basePrice?: number;
  price?: number;
  stats: {
    tripBatchesCount: number;
    totalRevenue: number;
    category: string;
  };
}

interface TripDetails {
  id: string;
  title: string;
  location: string;
  locationObj: {
    address: string;
    city: string;
    state: string;
  };
  description: string;
  image: string;
  images: string[];
  tags: string[];
  faqs: [{ question: string; answer: string }];
  itinerary: Array<{
    day: string;
    title?: string;
    description: string;
    activities?: string[];
  }>;
  inclusions: string[];
  exclusions: string[];
  category: string;
  basePrice?: number;
  price?: number;
  stats: {
    batches: number;
    totalRevenue: string;
  };
  // Map other fields
}

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