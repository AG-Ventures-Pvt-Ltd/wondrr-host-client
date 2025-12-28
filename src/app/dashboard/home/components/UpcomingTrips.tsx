import React from 'react';
import Card from '@/common/components/composites/Card';
import { Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '@/common/utils/dateUtils';
import { useRouter } from 'next/navigation';

interface UpcomingTrip {
  _id: string;
  title: string;
  startDate: string;
  totalBookings: number;
  totalSeats: number;
  status: string;
}

interface UpcomingTripsProps {
  trips: UpcomingTrip[];
}

const UpcomingTrips: React.FC<UpcomingTripsProps> = ({ trips }) => {
  const router = useRouter();

  return (
    <Card className={'flex-2'}>
      <div className='flex justify-between mb-6'>
        <h2 className='text-xl'>Upcoming Trips</h2>
        <span 
          className='flex items-center gap-2 text-primary cursor-pointer'
          onClick={() => router.push('/dashboard/trips')}
        >
          View All
          <ArrowRight size={20} />
        </span>
      </div>
      {trips.map((item) => (
        <Card key={item._id} className={'mt-4 p-4! '}>
          <div className='flex justify-between'>
            <div className='flex gap-4'>
              <Calendar className='text-primary bg-primary-bg p-3 rounded-2xl' size={48} />
              <div>
                <h2>{item.title}</h2>
                <p className='mt-1 text-sm text-subtext'>{formatDate(item.startDate)}</p>
              </div>
            </div>
            <div className='flex gap-6 items-center'>
              <p className='text-center'>
                {item.totalBookings} / {item.totalSeats}<br />
                <span className='text-subtext text-sm'>seats</span>
              </p>
              <p>
                {item.status === "fast-filling" ? (
                  <span className='text-warning text-sm bg-warning-bg p-2 rounded-lg'>Fast Filling</span>
                ) : (
                  <span className='text-success text-sm bg-success-bg p-2 rounded-lg'>Available</span>
                )}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </Card>
  );
};

export default UpcomingTrips;
