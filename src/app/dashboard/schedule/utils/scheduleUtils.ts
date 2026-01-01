import { CalendarDay, Batch } from '../types';
import { BatchItem } from '../hooks/useScheduleData';

export const generateCalendarDays = (
  currentDate: Date,
  today: Date,
  batches: BatchItem[],
  searchQuery: string,
  mapBatchItemToBatch: (batchItem: BatchItem) => Batch
): CalendarDay[] => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days: CalendarDay[] = [];

  // Add empty days for alignment
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push({
      date: 0,
      batches: [],
      isCurrentMonth: false,
    });
  }

  // Add actual days of the month
  for (let date = 1; date <= daysInMonth; date++) {
    const dayBatches = batches
      .filter((batchItem) => {
        const batchDate = new Date(batchItem.startDate);
        return (
          batchDate.getDate() === date &&
          batchDate.getMonth() === month &&
          batchDate.getFullYear() === year
        );
      })
      .map(mapBatchItemToBatch)
      .filter((batch) =>
        searchQuery ? batch.destination.toLowerCase().includes(searchQuery.toLowerCase()) : true
      );

    const isToday = date === today.getDate() && month === today.getMonth() && year === today.getFullYear();

    days.push({
      date,
      batches: dayBatches,
      isToday,
      isCurrentMonth: true,
    });
  }

  return days;
};

export const getSelectedDayBatches = (
  selectedDate: Date | null,
  calendarDays: CalendarDay[],
  currentDate: Date
): Batch[] => {
  if (!selectedDate) return [];
  
  const day = calendarDays.find(d => 
    d.isCurrentMonth && 
    d.date === selectedDate.getDate() &&
    currentDate.getMonth() === selectedDate.getMonth() &&
    currentDate.getFullYear() === selectedDate.getFullYear()
  );
  
  return day?.batches || [];
};

export const navigateToPreviousDay = (selectedDate: Date | null, today: Date): { newDate: Date; newMonthDate: Date } => {
  const newDate = new Date(selectedDate || today);
  newDate.setDate(newDate.getDate() - 1);
  return {
    newDate,
    newMonthDate: new Date(newDate.getFullYear(), newDate.getMonth(), 1)
  };
};

export const navigateToNextDay = (selectedDate: Date | null, today: Date): { newDate: Date; newMonthDate: Date } => {
  const newDate = new Date(selectedDate || today);
  newDate.setDate(newDate.getDate() + 1);
  return {
    newDate,
    newMonthDate: new Date(newDate.getFullYear(), newDate.getMonth(), 1)
  };
};

export const getMonthName = (date: Date): string => {
  return date.toLocaleString('default', { month: 'long' });
};
