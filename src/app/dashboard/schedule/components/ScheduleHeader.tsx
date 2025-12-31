import React from 'react';

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
      
      <button
        onClick={onCreateBatch}
        className="flex items-center gap-2 px-4 h-10 bg-primary text-white rounded-[14px] shadow-sm hover:bg-[#0d3593] transition-colors"
      >
        <span className="text-[14px] leading-5">Create Batch</span>
      </button>
    </div>
  );
};

export default ScheduleHeader;
