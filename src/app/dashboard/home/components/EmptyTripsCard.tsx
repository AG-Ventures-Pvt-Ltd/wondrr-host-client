import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/common/components/atoms/Button';
import { Sparkles } from 'lucide-react';
import Card from '@/common/components/composites/Card';


const EmptyTripsCard: React.FC = () => {
  const router = useRouter();

  return (
    <Card className="w-full max-w-lg flex flex-col items-center justify-center mt-8">
        <div className="w-24 h-24 bg-linear-to-br from-blue-50 to-indigo-50 rounded-3xl flex justify-center items-center">
          <Sparkles className="text-blue-600" size={48} strokeWidth={1.5} />
        </div>
        <h2 className="mt-8 text-center text-neutral-900 text-base font-normal leading-6">
          Start Your Journey with Wondrr
        </h2>
        <p className="mt-10 max-w-lg text-center text-neutral-600 text-base font-normal leading-6">
          Create unforgettable travel experiences for your customers. Set up trips, manage batches, track bookings, and grow your travel business—all in one place.
        </p>
        <div className="mt-12 flex justify-center items-center gap-4">
          <Button 
            variant="contained"
            className="px-8! rounded-2xl!"
            style={{ boxShadow: '0px 2px 4px -2px rgba(21,93,252,0.20), 0px 4px 6px -1px rgba(21,93,252,0.20)' }}
            startIcon={<Sparkles size={20} />}
            onClick={() => router.push('/dashboard/trips/create')}
          >
            Create Your First Trip
          </Button>
          
          <button 
            className="px-6 h-12 bg-white rounded-2xl border border-neutral-200 text-neutral-700 text-base font-normal leading-6 hover:bg-gray-50 transition-colors"
            onClick={() => router.push('/dashboard/trips')}
          >
            Browse Trips
          </button>
        </div>
    </Card>
  );
};

export default EmptyTripsCard;
