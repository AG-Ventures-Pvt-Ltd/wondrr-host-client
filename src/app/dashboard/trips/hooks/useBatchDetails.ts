import { useGetData } from '@/common/services/useGetData';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { formatDateRangeWithDuration } from '@/common/utils/dateUtils';

export interface BatchDetailsApiResponse {
  _id: string;
  /** Trip title (returned as `title` by the server) */
  title: string;
  /** ISO date string — aliased from model's startDateTime */
  startDate: string;
  /** ISO date string — aliased from model's endDateTime */
  endDate: string;
  status: string;
  totalSeats: number;
  totalBookings: number;
  revenue: number;
  meetingPoint: Array<{
    _id?: string;
    location: {
      _id: string;
      name: string;
      geo?: { address?: string; city?: string };
    } | string;
    pickupPrice: number;
  }>;
  dropPoint: Array<{
    _id: string;
    name: string;
    geo?: { address?: string; city?: string };
  } | string>;
  pointOfContact: {
    name: string;
    phone: string;
  };
  closeBooking?: string;
  tripTitle?: string;
  tripLocation?: string;
  availableSeats?: number;
}

interface BatchDetails {
  id: string;
  title: string;
  dateRange: string;
  status: string;
  stats: {
    revenue: string;
    seatsFilledValue: string;
  };
  batchInfo: {
    meetingPoint: BatchDetailsApiResponse['meetingPoint'];
    dropPoint: BatchDetailsApiResponse['dropPoint'];
    pointOfContact: string;
    contactPhone: string;
  };
}

export const useBatchDetails = (batchId: string) => {
  const { data, isLoading, error, refetch } = useGetData<BatchDetailsApiResponse>(
    API_ENDPOINTS.TRIPS.GET_BATCH_DETAILS(batchId)
  );

  const batchDetails: BatchDetails | null = data ? {
    id: data._id,
    title: data.title || data.tripTitle || '',
    dateRange: formatDateRangeWithDuration(data.startDate, data.endDate),
    status: data.status,
    stats: {
      revenue: `${data.revenue ?? 0}`,
      seatsFilledValue: `${data.totalBookings ?? 0}/${data.totalSeats ?? 0}`,
    },
    batchInfo: {
      meetingPoint: data.meetingPoint ?? [],
      dropPoint: data.dropPoint ?? [],
      pointOfContact: data.pointOfContact?.name ?? '',
      contactPhone: data.pointOfContact?.phone ?? '',
    },
  } : null;

  return {
    batchDetails,
    rawData: data,
    isLoading,
    error,
    refetch,
  };
};