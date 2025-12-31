import { Batch } from './types';

export const MOCK_BATCHES: Batch[] = [
  {
    id: '1',
    title: 'Manali Winter Adventure',
    time: '06:00 AM',
    color: '#2B7FFF',
    destination: 'Manali',
    location: 'Manali, Himachal Pradesh',
    duration: '3N/4D',
    seatsBooked: 22,
    totalSeats: 25,
  },
  {
    id: '2',
    title: 'Jaipur Heritage Tour',
    time: '07:00 AM',
    color: '#F6339A',
    destination: 'Jaipur',
    location: 'Jaipur, Rajasthan',
    duration: '2N/3D',
    seatsBooked: 25,
    totalSeats: 25,
  },
  {
    id: '3',
    title: 'Shimla Snow Trek',
    time: '05:00 AM',
    color: '#00B8DB',
    destination: 'Shimla',
    location: 'Shimla, Himachal Pradesh',
    duration: '4N/5D',
    seatsBooked: 15,
    totalSeats: 20,
  },
  {
    id: '4',
    title: 'Goa Beach Getaway',
    time: '08:00 PM',
    color: '#FF6900',
    destination: 'Goa',
    location: 'Goa, India',
    duration: '2N/3D',
    seatsBooked: 18,
    totalSeats: 30,
  },
  {
    id: '5',
    title: 'Kasol Trekking',
    time: '05:30 AM',
    color: '#00C950',
    destination: 'Kasol',
    location: 'Kasol, Himachal Pradesh',
    duration: '3N/4D',
    seatsBooked: 12,
    totalSeats: 15,
  },
];

export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const FILTER_OPTIONS = [
  { label: 'All', value: 'all' as const },
  { label: 'Active', value: 'active' as const },
  { label: 'Filling', value: 'filling' as const },
];
