import React from 'react';
import Button from '@/common/components/atoms/Button';
interface ScheduleHeaderProps {
  onCreateBatch: () => void;
}

const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({ onCreateBatch }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-[20px] font-medium text-maintext leading-[30px]">
          Schedule Calendar
        </h1>
        <p className="text-[16px] text-subtext leading-6">
          Manage all batch departures and schedules
        </p>
      </div>
      
      <Button
        onClick={onCreateBatch}
        variant='contained'
>
        <span className="text-[14px] leading-5">Create a Trip</span>
      </Button>
    </div>
  );
};

export default ScheduleHeader;
