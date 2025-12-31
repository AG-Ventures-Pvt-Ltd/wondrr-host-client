import React from 'react';
import { CalendarDay as CalendarDayType } from '../types';
import BatchCard from './BatchCard';

interface CalendarDayProps {
  day: CalendarDayType;
  onDayClick?: (date: number) => void;
  onBatchClick?: (batchId: string) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  onDayClick,
  onBatchClick,
}) => {
  const { date, batches, isToday, isCurrentMonth } = day;
  const hasNoBatches = batches.length === 0;

  return (
    <div
      className={`rounded-[14px] p-2 min-h-[128px] transition-all ${
        !isCurrentMonth
          ? 'border border-transparent'
          : isToday
          ? 'bg-[rgba(239,246,255,0.5)] border border-[#2B7FFF] shadow-sm'
          : 'border border-[rgba(229,229,229,0.6)]'
      } ${hasNoBatches ? 'pb-1' : ''}`}
    >
      {/* Day Header */}
      <div className="flex justify-between items-center h-7 mb-2">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer ${
            isToday ? 'bg-[#155DFC] text-white' : 'text-[#171717]'
          }`}
          onClick={() => onDayClick?.(date)}
        >
          <span className="text-[14px] leading-5">{date}</span>
        </div>
        
        {batches.length > 0 && (
          <div className="bg-[#F5F5F5] rounded h-[19px] min-w-[18px] px-1.5 flex items-center justify-center">
            <span className="text-[10px] text-[#525252] leading-[15px] tracking-[0.12px]">
              {batches.length}
            </span>
          </div>
        )}
      </div>

      {/* Batches */}
      {batches.length > 0 && (
        <div className="flex flex-col gap-1">
          {batches.map((batch) => (
            <BatchCard
              key={batch.id}
              batch={batch}
              onClick={() => onBatchClick?.(batch.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarDay;
