'use client';

import React, { useState, useMemo } from 'react';
import ScheduleHeader from './components/ScheduleHeader';
import ScheduleFilters from './components/ScheduleFilters';
import CalendarNavigation from './components/CalendarNavigation';
import Calendar from './components/Calendar';
import DayBatchesSidebar from './components/DayBatchesSidebar';
import { FilterType } from './types';
import { useScheduleData } from './hooks/useScheduleData';
import {
  generateCalendarDays,
  getSelectedDayBatches,
  navigateToPreviousDay,
  navigateToNextDay,
  getMonthName,
} from './utils/scheduleUtils';
import { useRouter } from 'next/navigation';


const Schedule = () => {
  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const router = useRouter()

  const { batches, mapBatchItemToBatch } = useScheduleData(currentDate);

  const calendarDays = useMemo(
    () => generateCalendarDays(currentDate, today, batches, searchQuery, mapBatchItemToBatch),
    [currentDate, searchQuery, today, batches, mapBatchItemToBatch]
  );

  const selectedDayBatches = useMemo(
    () => getSelectedDayBatches(selectedDate, calendarDays, currentDate),
    [selectedDate, calendarDays, currentDate]
  );

  const monthName = getMonthName(currentDate);
  const year = currentDate.getFullYear();

  const handleToday = () => {
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handlePreviousDay = () => {
    const { newDate, newMonthDate } = navigateToPreviousDay(selectedDate, today);
    setSelectedDate(newDate);
    setCurrentDate(newMonthDate);
  };

  const handleNextDay = () => {
    const { newDate, newMonthDate } = navigateToNextDay(selectedDate, today);
    setSelectedDate(newDate);
    setCurrentDate(newMonthDate);
  };

  const handleCreateBatch = () => {
    router.push('/dashboard/trips/create')
  };

  const handleDayClick = (date: number) => {
    if (date > 0) {
      const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
      setSelectedDate(newSelectedDate);
    }
  };

  const handleBatchClick = (batchId: string) => {
    console.log('Batch clicked:', batchId);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <ScheduleHeader onCreateBatch={handleCreateBatch} />
      <div className="flex gap-6">
        <div className='w-[70%]'>
          <Calendar
            month={monthName}
            year={year}
            days={calendarDays}
            onDayClick={handleDayClick}
            onBatchClick={handleBatchClick}
            selectedDate={selectedDate}
          />
        </div>
        <div className='w-[30%] flex flex-col gap-4'>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ScheduleFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
            </div>
            <CalendarNavigation
              onPrevious={handlePreviousDay}
              onNext={handleNextDay}
              onToday={handleToday}
            />
          </div>
          <DayBatchesSidebar 
            selectedDate={selectedDate}
            batches={selectedDayBatches}
          />
        </div>
      </div>
    </div>
  );
};

export default Schedule;