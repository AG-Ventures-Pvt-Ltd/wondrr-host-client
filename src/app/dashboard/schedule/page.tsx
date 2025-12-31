'use client';

import React, { useState, useMemo } from 'react';
import ScheduleHeader from './components/ScheduleHeader';
import ScheduleFilters from './components/ScheduleFilters';
import CalendarNavigation from './components/CalendarNavigation';
import Calendar from './components/Calendar';
import DayBatchesSidebar from './components/DayBatchesSidebar';
import { CalendarDay, FilterType } from './types';
import { MOCK_BATCHES } from './constants';

const Schedule = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({
        date: 0,
        batches: [],
        isCurrentMonth: false,
      });
    }

    for (let date = 1; date <= daysInMonth; date++) {
      const batches = [];

      if (date === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
        batches.push(MOCK_BATCHES[0], MOCK_BATCHES[1]);
      } else if (date === today.getDate() + 1 && month === today.getMonth() && year === today.getFullYear()) {
        batches.push(MOCK_BATCHES[2]);
      } else if (date === today.getDate() + 2 && month === today.getMonth() && year === today.getFullYear()) {
        batches.push(MOCK_BATCHES[3], MOCK_BATCHES[4]);
      }

      const isToday = date === today.getDate() && month === today.getMonth() && year === today.getFullYear();

      days.push({
        date,
        batches: batches.filter((batch) =>
          searchQuery ? batch.destination.toLowerCase().includes(searchQuery.toLowerCase()) : true
        ),
        isToday,
        isCurrentMonth: true,
      });
    }

    return days;
  }, [currentDate, searchQuery, today]);

  const selectedDayBatches = useMemo(() => {
    if (!selectedDate) return [];
    
    const day = calendarDays.find(d => 
      d.isCurrentMonth && 
      d.date === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
    
    return day?.batches || [];
  }, [selectedDate, calendarDays, currentDate]);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleCreateBatch = () => {
    console.log('Create batch clicked');
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
    <div className="w-full flex flex-col gap-6">
      <ScheduleHeader onCreateBatch={handleCreateBatch} />
      <div className="flex gap-3">
        <div className='flex-3'>
          <Calendar
            month={monthName}
            year={year}
            days={calendarDays}
            onDayClick={handleDayClick}
            onBatchClick={handleBatchClick}
          />
        </div>
        <div className='flex-1 flex flex-col gap-3'>
          <div className="flex items-center justify-between gap-2">
            <ScheduleFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
            <CalendarNavigation
              onPrevious={handlePreviousMonth}
              onNext={handleNextMonth}
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