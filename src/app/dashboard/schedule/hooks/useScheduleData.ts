import { useMemo } from 'react';
import { useGetData } from '@/common/services/useGetData';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { Batch } from '../types';

export interface BatchItem {
  _id: string;
  tripTitle: string;
  startDate: string;
  endDate: string;
  startTime: string;
  totalBookings: number;
  totalSeats: number;
  status: string;
}

export const useScheduleData = (currentDate: Date) => {
  const monthParam = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }, [currentDate]);

  const { data: batches = [], isLoading, error } = useGetData<BatchItem[]>(
    API_ENDPOINTS.SCHEDULE.GET_MONTH_SCHEDULE(monthParam)
  );

  const mapBatchItemToBatch = (batchItem: BatchItem): Batch => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    // Calculate duration in days and nights
    const start = new Date(batchItem.startDate);
    const end = new Date(batchItem.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
    const nights = days - 1;

    return {
      id: batchItem._id,
      title: batchItem.tripTitle,
      time: batchItem.startTime,
      color: randomColor,
      destination: batchItem.tripTitle,
      location: 'Location',
      duration: `${days}D/${nights}N`,
      seatsBooked: batchItem.totalBookings,
      totalSeats: batchItem.totalSeats,
    };
  };

  return {
    batches,
    isLoading,
    error,
    mapBatchItemToBatch,
  };
};
