import { useGetData } from '@/common/services/useGetData';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { useMemo } from 'react';
import { useGetBatches } from '@/common/hooks/useGetBatches';

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

  const { batches, isLoading: batchesLoading, error: batchesError } = useGetBatches({
    enabled: homeStats?.hasCreatedTrips ?? false,
  });
    

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
    if (!batches) return [];

    return batches.map((batch) => ({
      _id : batch._id,
      title: batch.tripTitle,
      startDate: batch.startDate,
      totalBookings: batch.totalBookings,
      totalSeats: batch.totalSeats,
      status: batch.status,
    }));
  }, [batches]);

  return {
    statsData,
    upcomingTrips,
    hasCreatedTrips: homeStats?.hasCreatedTrips ?? false,
    isLoading: statsLoading || (homeStats?.hasCreatedTrips && batchesLoading),
    error: statsError || batchesError,
  };
};
