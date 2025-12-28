import { useGetData } from '@/common/services/useGetData';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { useMemo } from 'react';
import type { UseQueryOptions } from '@tanstack/react-query';

interface HomeStatsResponse {
  totalActiveTrips: number;
  totalBatches: number;
  totalRevenue: number;
  totalBookings: number;
  hasCreatedTrips: boolean;
}

interface StatItem {
  title: string;
  stat: string;
  direction: 'up' | 'down';
}

interface BatchItem {
  _id: string;
  tripTitle: string;
  startDate: string;
  endDate: string;
  totalBookings: number;
  totalSeats: number;
  status: string;
}

interface UpcomingTrip {
  _id : string;
  title: string;
  startDate: string;
  totalBookings: number;
  totalSeats: number;
  status: string;
}

export const useHomeStats = () => {
  const { data: homeStats, isLoading: statsLoading, error: statsError } = useGetData<HomeStatsResponse>(
    API_ENDPOINTS.HOME.GET_HOST_HOME_STATS
  );

  
  const { data: batchesData, isLoading: batchesLoading, error: batchesError } = useGetData<BatchItem[]>(
      API_ENDPOINTS.HOME.GET_UPCOMING_BATCHES,
      {
          enabled: homeStats?.hasCreatedTrips ?? false,
        } as UseQueryOptions<BatchItem[], Error>
    );
    
    console.log('Fetched Home Stats:',statsLoading, batchesLoading);
  const statsData: StatItem[] = useMemo(() => {
    if (!homeStats) return [];

    return [
      {
        title: 'Total Revenue',
        stat: `₹${homeStats.totalRevenue?.toLocaleString('en-IN') || '0'}`,
        direction: 'up' as const,
      },
      {
        title: 'Active Trips',
        stat: homeStats.totalActiveTrips?.toString() || '0',
        direction: 'up' as const,
      },
      {
        title: 'Total Batches',
        stat: homeStats.totalBatches?.toString() || '0',
        direction: 'up' as const,
      },
      {
        title: 'Total Bookings',
        stat: homeStats.totalBookings?.toString() || '0',
        direction: 'up' as const,
      },
    ];
  }, [homeStats]);

  const upcomingTrips: UpcomingTrip[] = useMemo(() => {
    if (!batchesData) return [];

    return batchesData.map((batch) => ({
      _id : batch._id,
      title: batch.tripTitle,
      startDate: batch.startDate,
      totalBookings: batch.totalBookings,
      totalSeats: batch.totalSeats,
      status: batch.status,
    }));
  }, [batchesData]);

  return {
    statsData,
    upcomingTrips,
    hasCreatedTrips: homeStats?.hasCreatedTrips ?? false,
    isLoading: statsLoading || (homeStats?.hasCreatedTrips && batchesLoading),
    error: statsError || batchesError,
  };
};
