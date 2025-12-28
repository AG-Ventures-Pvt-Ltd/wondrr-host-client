import React from 'react';
import Card from '@/common/components/composites/Card';
import Button from '@/common/components/atoms/Button';
import { Users, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const QuickActions: React.FC = () => {
  const router = useRouter();

  return (
    <Card className={'flex-1'}>
      <h2 className='text-xl'>Alerts</h2>

      <div className={'my-6 border border-[#E5E5E5]'}></div>
      <div className='mt-4 flex flex-col items-start gap-4'>
        <p>Quick Actions</p>
        <Button 
          className='rounded-2xl! whitespace-nowrap w-full justify-start! pl-6!' 
          startIcon={<Sparkles size={20} />} 
          variant={'contained'}
          onClick={() => router.push('/dashboard/trips/create')}
        >
          <span className='justify-self-start'>Create new trip</span>
        </Button>
        <Button 
          className='rounded-2xl! whitespace-nowrap w-full justify-start! pl-6! text-subtext!' 
          variant={'text'}
        >
          <Users className='mr-1' size={20} /> 
          <span>View inquiries</span>
        </Button>
      </div>
    </Card>
  );
};

export default QuickActions;
