import React from 'react';
import Card from '@/common/components/composites/Card';
import { Calendar, ArrowRight } from 'lucide-react';

interface Booking {
  title: string;
  location: string;
  paidAmount: number;
}

interface RecentBookingsProps {
  bookings: Booking[];
}

const RecentBookings: React.FC<RecentBookingsProps> = ({ bookings }) => {
  return (
    <Card className={'mt-8'}>
      <div className='flex justify-between mb-6'>
        <h2 className='text-xl'>Recent Bookings</h2>
        <span className='flex items-center gap-2 text-primary'>
          View All
          <ArrowRight size={20} />
        </span>
      </div>
      {bookings.map((item) => (
        <Card key={item.title} className={'mt-4 p-4! '}>
          <div className='flex justify-between items-center'>
            <div className='flex gap-4'>
              <Calendar className='text-primary bg-primary-bg p-3 rounded-2xl' size={48} />
              <div>
                <h2>{item.title}</h2>
                <p className='mt-1 text-sm text-subtext'>{item.location}</p>
              </div>
            </div>
            <p className='text-center mr-4'>
              ₹ {item.paidAmount}
            </p>
          </div>
        </Card>
      ))}
    </Card>
  );
};

export default RecentBookings;
