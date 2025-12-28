'use client';

import { useState, useMemo } from 'react'
import { Search, Filter } from 'lucide-react'
import Table from '@/common/components/composites/table'
import { useGetAllBookings } from '@/common/services/useGetAllBookings'
import { BOOKINGS_COLUMNS } from './constants/constants'
import BookingFilters from './components/BookingFilters'
import { FilterState } from './types'

const Bookings = () => {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    statusFilter: 'all',
    guestCountFilter: null,
    dateRangeFilter: { start: '', end: '' },
    selectedTrip: 'all',
    selectedBatch: 'all'
  })

  const { bookings: bookingsData, total, isLoading } = useGetAllBookings(page, limit)

  const trips = useMemo(() => {
    const uniqueTrips = new Map<string, string>()
    bookingsData.forEach(booking => {
      if (!uniqueTrips.has(booking.tripId)) {
        uniqueTrips.set(booking.tripId, booking.tripTitle)
      }
    })
    return [
      { id: 'all', name: 'All Trips' },
      ...Array.from(uniqueTrips.entries()).map(([id, name]) => ({ id, name }))
    ]
  }, [bookingsData])

  const batches = useMemo(() => {
    const batchesByTrip: Record<string, Array<{ id: string; name: string }>> = {
      'all': [{ id: 'all', name: 'All Batches' }]
    }

    bookingsData.forEach(booking => {
      if (!batchesByTrip[booking.tripId]) {
        batchesByTrip[booking.tripId] = [{ id: 'all', name: 'All Batches' }]
      }

      const batchExists = batchesByTrip[booking.tripId].some(b => b.id === booking.batchId)
      if (!batchExists) {
        const startDate = new Date(booking.startDate)
        const endDate = new Date(booking.endDate)
        const batchName = `${startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
        batchesByTrip[booking.tripId].push({
          id: booking.batchId,
          name: batchName
        })
      }
    })

    return batchesByTrip
  }, [bookingsData])

  const filteredBookings = useMemo(() => {
    let filtered = bookingsData

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filters.statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === filters.statusFilter)
    }

    if (filters.guestCountFilter !== null) {
      filtered = filtered.filter(booking => booking.guests === filters.guestCountFilter)
    }

    if (filters.dateRangeFilter.start && filters.dateRangeFilter.end) {
      const startDate = new Date(filters.dateRangeFilter.start)
      const endDate = new Date(filters.dateRangeFilter.end)
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.bookingDate)
        return bookingDate >= startDate && bookingDate <= endDate
      })
    }

    if (filters.selectedTrip !== 'all') {
      filtered = filtered.filter(booking => booking.tripId === filters.selectedTrip)
    }

    if (filters.selectedBatch !== 'all') {
      filtered = filtered.filter(booking => booking.batchId === filters.selectedBatch)
    }

    return filtered
  }, [bookingsData, searchTerm, filters])

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  return (
    <div className="w-full h-full bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-maintext mb-2">Bookings</h1>
          <p className="text-sm text-subtext">Manage and track all your trip bookings</p>
        </div>
        <div className="mb-6 flex gap-4">
          <div className="relative max-w-md flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-subtext" />
            </div>
            <input
              type="text"
              placeholder="Search by guest name or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-subtext rounded-lg bg-background placeholder-subtext text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-subtext rounded-lg bg-background text-maintext hover:bg-primary-bg transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-[calc(100vh-300px)]">
            <div className="text-subtext">Loading bookings...</div>
          </div>
        ) : (
          <>
            <Table
              columns={BOOKINGS_COLUMNS}
              data={filteredBookings}
              height="h-[calc(100vh-300px)]"
              keyExtractor={(item) => item.id}
            />
            <div className="mt-4 text-sm text-subtext">
              Showing {filteredBookings.length} of {total} bookings
            </div>
          </>
        )}
      </div>
      <BookingFilters
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        trips={trips}
        batches={batches}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  )
}

export default Bookings