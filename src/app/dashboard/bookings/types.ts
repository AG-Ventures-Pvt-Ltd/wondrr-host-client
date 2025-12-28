// Booking-related types
export interface BookingResponse {
  _id: string
  fullName: string
  destination: string
  numberOfPeople: number
  status: 'confirmed' | 'pending' | 'failed' | 'cancelled'
  updatedAt: string
  tripId: string
  batchId: string
  tripTitle: string
  startDate: string
  endDate: string
}

export interface Booking {
  id: string
  guestName: string
  guestInitial: string
  destination: string
  guests: number
  status: 'confirmed' | 'pending' | 'failed' | 'cancelled'
  bookingDate: string
  tripId: string
  batchId: string
  tripTitle: string
  startDate: string
  endDate: string
}

export interface UseGetAllBookingsReturn {
  bookings: Booking[]
  total: number
  page: number
  limit: number
  isLoading: boolean
  error: unknown
}

export interface Trip {
  id: string
  name: string
}

export interface Batch {
  id: string
  name: string
}

export interface BookingFiltersProps {
  isOpen: boolean
  onClose: () => void
  trips: Trip[]
  batches: Record<string, Batch[]>
  onApplyFilters: (filters: FilterState) => void
}

export interface FilterState {
  statusFilter: 'all' | 'confirmed' | 'pending'
  guestCountFilter: number | null
  dateRangeFilter: { start: string; end: string }
  selectedTrip: string
  selectedBatch: string
}
