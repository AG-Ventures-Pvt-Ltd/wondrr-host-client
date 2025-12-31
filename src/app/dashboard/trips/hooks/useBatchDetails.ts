import { useGetData } from '@/common/services/useGetData';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { formatDateRangeWithDuration } from '@/common/utils/dateUtils';


export interface BatchDetailsApiResponse {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: string;
  totalSeats: number;
  totalBookings: number;
  revenue: number;
  meetingPoint: string;
  endPoint: string;
  startTime: string;
  isCompleted: boolean;
  pointOfContact: {
    name: string;
    phone: string;
  };
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
    meetingPoint: string;
    endPoint: string;
    startTime: string;
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
    title: data.title,
    dateRange: formatDateRangeWithDuration(data.startDate,data.endDate),
    status: data.status,
    stats: {
      revenue: `${data.revenue}`,
      seatsFilledValue: `${data.totalBookings}/${data.totalSeats}`,
    },
    batchInfo: {
      meetingPoint: data.meetingPoint,
      endPoint : data.endPoint,
      startTime: data.startTime,
      pointOfContact: data.pointOfContact.name,
      contactPhone: data.pointOfContact.phone,
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