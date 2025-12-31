export interface Batch {
  id: string;
  title: string;
  time: string;
  color: string;
  destination: string;
  location: string;
  duration: string;
  seatsBooked: number;
  totalSeats: number;
}

export interface CalendarDay {
  date: number;
  batches: Batch[];
  isToday?: boolean;
  isCurrentMonth?: boolean;
}

export type FilterType = 'all' | 'active' | 'filling';
