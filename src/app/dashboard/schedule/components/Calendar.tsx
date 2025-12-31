import React from 'react';
import { CalendarDay as CalendarDayType } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import CalendarDay from './CalendarDay';

interface CalendarProps {
  month: string;
  year: number;
  days: CalendarDayType[];
  onDayClick?: (date: number) => void;
  onBatchClick?: (batchId: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  month,
  year,
  days,
  onDayClick,
  onBatchClick,
}) => {
  return (
    <div className="bg-white rounded-[14px] border border-[rgba(229,229,229,0.6)] shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-[18px] font-medium text-maintext leading-[27px]">
          {month} {year}
        </h2>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-0 mb-6">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="text-center">
            <span className="text-[12px] text-subtext leading-4">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-3">
        {days.map((day, index) => (
          <CalendarDay
            key={`${day.date}-${index}`}
            day={day}
            onDayClick={onDayClick}
            onBatchClick={onBatchClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Calendar;
