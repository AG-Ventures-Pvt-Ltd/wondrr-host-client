import { useState } from 'react'
import Modal from '@/common/components/composites/Modal'
import { Trip, Batch, BookingFiltersProps, FilterState } from '../types'

const getDefaultDateRange = () => ({
  start: '',
  end: ''
})

const BookingFilters = ({ isOpen, onClose, trips, batches, onApplyFilters }: BookingFiltersProps) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending'>('all')
  const [guestCountFilter, setGuestCountFilter] = useState<number | null>(null)
  const [dateRangeFilter, setDateRangeFilter] = useState<{ start: string; end: string }>(getDefaultDateRange())
  const [selectedTrip, setSelectedTrip] = useState<string>('all')
  const [selectedBatch, setSelectedBatch] = useState<string>('all')

  const handleApplyFilters = () => {
    onApplyFilters({
      statusFilter,
      guestCountFilter,
      dateRangeFilter,
      selectedTrip,
      selectedBatch
    })
    onClose()
  }

  const handleClearFilters = () => {
    setStatusFilter('all')
    setGuestCountFilter(null)
    setDateRangeFilter(getDefaultDateRange())
    setSelectedTrip('all')
    setSelectedBatch('all')
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Filter Bookings"
      description="Apply filters to narrow down your booking results"
      showButtons={false}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-maintext mb-3">
            Booking Status
          </label>
          <div className="space-y-2">
            {[
              { value: 'all', label: 'All Status' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'pending', label: 'Pending' }
            ].map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value={option.value}
                  checked={statusFilter === option.value}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'confirmed' | 'pending')}
                  className="w-4 h-4 text-primary border-subtext focus:ring-primary"
                />
                <span className="ml-2 text-sm text-maintext">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-maintext mb-3">
            Number of Guests
          </label>
          <input
            type="number"
            min="1"
            placeholder="Enter number of guests"
            value={guestCountFilter || ''}
            onChange={(e) => {
              const value = e.target.value ? parseInt(e.target.value) : null
              setGuestCountFilter(value)
            }}
            className="block w-full px-3 py-2 border border-subtext rounded-lg bg-background placeholder-subtext text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-maintext mb-3">
            Date Range
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-subtext mb-1">From</label>
              <input
                type="date"
                value={dateRangeFilter.start}
                onChange={(e) => setDateRangeFilter(prev => ({ ...prev, start: e.target.value }))}
                className="block w-full px-3 py-2 border border-subtext rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-subtext mb-1">To</label>
              <input
                type="date"
                value={dateRangeFilter.end}
                onChange={(e) => setDateRangeFilter(prev => ({ ...prev, end: e.target.value }))}
                className="block w-full px-3 py-2 border border-subtext rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-maintext mb-3">
            Trip
          </label>
          <select
            value={selectedTrip}
            onChange={(e) => {
              setSelectedTrip(e.target.value)
              setSelectedBatch('all')
            }}
            className="block w-full px-3 py-2 border border-subtext rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-maintext mb-3">
            Batch
          </label>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            disabled={selectedTrip === 'all'}
            className="block w-full px-3 py-2 border border-subtext rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {batches[selectedTrip as keyof typeof batches]?.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              handleClearFilters()
              onClose()
            }}
            className="px-4 py-2 text-sm font-medium text-subtext hover:text-maintext transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 text-sm font-medium text-background bg-primary hover:bg-primary/90 rounded-lg transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default BookingFilters
