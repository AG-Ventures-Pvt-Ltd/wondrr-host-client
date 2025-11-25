'use client';

import { useState, useMemo } from 'react'
import { Check, Clock, Search, Filter } from 'lucide-react'
import Modal from '@/common/components/composites/Modal'
import Table, { TableColumn } from '@/common/components/composites/table'

interface Booking {
  id: string
  guestName: string
  guestInitial: string
  destination: string
  guests: number
  amount: string
  status: 'confirmed' | 'pending'
  bookingDate: string
  tripId: string
  batchId: string
}

const bookingsData: Booking[] = [
  {
    id: 'BK001',
    guestName: 'Priya Sharma',
    guestInitial: 'P',
    destination: 'Goa - 15 December',
    guests: 2,
    amount: '₹25,000',
    status: 'confirmed',
    bookingDate: '18 Nov 2025',
    tripId: 'goa-15-dec',
    batchId: 'batch-1'
  },
  {
    id: 'BK002',
    guestName: 'Rahul Verma',
    guestInitial: 'R',
    destination: 'Manali - 20 December',
    guests: 4,
    amount: '₹42,000',
    status: 'confirmed',
    bookingDate: '19 Nov 2025',
    tripId: 'manali-20-dec',
    batchId: 'batch-1'
  },
  {
    id: 'BK003',
    guestName: 'Anjali Patel',
    guestInitial: 'A',
    destination: 'Jaipur - 25 December',
    guests: 3,
    amount: '₹18,500',
    status: 'pending',
    bookingDate: '20 Nov 2025',
    tripId: 'jaipur-25-dec',
    batchId: 'batch-1'
  },
  {
    id: 'BK004',
    guestName: 'Sneha Reddy',
    guestInitial: 'S',
    destination: 'Rishikesh - 5 January',
    guests: 3,
    amount: '₹19,500',
    status: 'confirmed',
    bookingDate: '22 Nov 2025',
    tripId: 'rishikesh-5-jan',
    batchId: 'batch-1'
  },
  {
    id: 'BK005',
    guestName: 'Vikram Singh',
    guestInitial: 'V',
    destination: 'Ladakh - 2 January',
    guests: 2,
    amount: '₹30,000',
    status: 'pending',
    bookingDate: '23 Nov 2025',
    tripId: 'ladakh-2-jan',
    batchId: 'batch-1'
  },
  {
    id: 'BK006',
    guestName: 'Karan Gupta',
    guestInitial: 'K',
    destination: 'Kerala - 10 January',
    guests: 5,
    amount: '₹55,000',
    status: 'confirmed',
    bookingDate: '24 Nov 2025',
    tripId: 'goa-15-dec',
    batchId: 'batch-2'
  },
  {
    id: 'BK007',
    guestName: 'Meera Joshi',
    guestInitial: 'M',
    destination: 'Udaipur - 15 January',
    guests: 2,
    amount: '₹22,000',
    status: 'pending',
    bookingDate: '25 Nov 2025',
    tripId: 'manali-20-dec',
    batchId: 'batch-2'
  },
  {
    id: 'BK008',
    guestName: 'Arjun Kumar',
    guestInitial: 'A',
    destination: 'Shimla - 20 January',
    guests: 3,
    amount: '₹28,000',
    status: 'confirmed',
    bookingDate: '26 Nov 2025',
    tripId: 'ladakh-2-jan',
    batchId: 'batch-2'
  },
  {
    id: 'BK009',
    guestName: 'Pooja Singh',
    guestInitial: 'P',
    destination: 'Agra - 25 January',
    guests: 4,
    amount: '₹35,000',
    status: 'confirmed',
    bookingDate: '27 Nov 2025',
    tripId: 'jaipur-25-dec',
    batchId: 'batch-1'
  },
  {
    id: 'BK010',
    guestName: 'Rohit Mehta',
    guestInitial: 'R',
    destination: 'Darjeeling - 1 February',
    guests: 2,
    amount: '₹24,000',
    status: 'pending',
    bookingDate: '28 Nov 2025',
    tripId: 'rishikesh-5-jan',
    batchId: 'batch-1'
  },
  {
    id: 'BK011',
    guestName: 'Neha Agarwal',
    guestInitial: 'N',
    destination: 'Mumbai - 5 February',
    guests: 6,
    amount: '₹48,000',
    status: 'confirmed',
    bookingDate: '29 Nov 2025',
    tripId: 'goa-15-dec',
    batchId: 'batch-1'
  },
  {
    id: 'BK012',
    guestName: 'Sandeep Rao',
    guestInitial: 'S',
    destination: 'Chennai - 10 February',
    guests: 3,
    amount: '₹32,000',
    status: 'pending',
    bookingDate: '30 Nov 2025',
    tripId: 'manali-20-dec',
    batchId: 'batch-1'
  },
  {
    id: 'BK013',
    guestName: 'Divya Nair',
    guestInitial: 'D',
    destination: 'Bangalore - 15 February',
    guests: 4,
    amount: '₹38,000',
    status: 'confirmed',
    bookingDate: '1 Dec 2025',
    tripId: 'ladakh-2-jan',
    batchId: 'batch-1'
  },
  {
    id: 'BK014',
    guestName: 'Amit Shah',
    guestInitial: 'A',
    destination: 'Hyderabad - 20 February',
    guests: 2,
    amount: '₹26,000',
    status: 'confirmed',
    bookingDate: '2 Dec 2025',
    tripId: 'rishikesh-5-jan',
    batchId: 'batch-1'
  },
  {
    id: 'BK015',
    guestName: 'Kavita Jain',
    guestInitial: 'K',
    destination: 'Pune - 25 February',
    guests: 3,
    amount: '₹29,000',
    status: 'pending',
    bookingDate: '3 Dec 2025',
    tripId: 'jaipur-25-dec',
    batchId: 'batch-1'
  }
]

const getDefaultDateRange = () => {
  return {
    start: '',
    end: ''
  }
}

const Bookings = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending'>('all')
  const [guestCountFilter, setGuestCountFilter] = useState<number | null>(null)
  const [dateRangeFilter, setDateRangeFilter] = useState<{ start: string; end: string }>(getDefaultDateRange())
  const [selectedTrip, setSelectedTrip] = useState<string>('all')
  const [selectedBatch, setSelectedBatch] = useState<string>('all')

  const trips = [
    { id: 'all', name: 'All Trips' },
    { id: 'goa-15-dec', name: 'Goa - 15 December' },
    { id: 'manali-20-dec', name: 'Manali - 20 December' },
    { id: 'jaipur-25-dec', name: 'Jaipur - 25 December' },
    { id: 'rishikesh-5-jan', name: 'Rishikesh - 5 January' },
    { id: 'ladakh-2-jan', name: 'Ladakh - 2 January' }
  ]

  const batches = {
    'all': [{ id: 'all', name: 'All Batches' }],
    'goa-15-dec': [
      { id: 'all', name: 'All Batches' },
      { id: 'batch-1', name: '15 Dec - 22 Dec' },
      { id: 'batch-2', name: '22 Dec - 29 Dec' }
    ],
    'manali-20-dec': [
      { id: 'all', name: 'All Batches' },
      { id: 'batch-1', name: '20 Dec - 27 Dec' },
      { id: 'batch-2', name: '27 Dec - 3 Jan' }
    ],
    'jaipur-25-dec': [
      { id: 'all', name: 'All Batches' },
      { id: 'batch-1', name: '25 Dec - 1 Jan' }
    ],
    'rishikesh-5-jan': [
      { id: 'all', name: 'All Batches' },
      { id: 'batch-1', name: '5 Jan - 12 Jan' }
    ],
    'ladakh-2-jan': [
      { id: 'all', name: 'All Batches' },
      { id: 'batch-1', name: '2 Jan - 9 Jan' },
      { id: 'batch-2', name: '9 Jan - 16 Jan' }
    ]
  }

  const filteredBookings = useMemo(() => {
    let filtered = bookingsData

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    if (guestCountFilter !== null) {
      filtered = filtered.filter(booking => booking.guests === guestCountFilter)
    }

    if (dateRangeFilter.start && dateRangeFilter.end) {
      const startDate = new Date(dateRangeFilter.start)
      const endDate = new Date(dateRangeFilter.end)
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.bookingDate)
        return bookingDate >= startDate && bookingDate <= endDate
      })
    }

    if (selectedTrip !== 'all') {
      filtered = filtered.filter(booking => booking.tripId === selectedTrip)
    }

    if (selectedBatch !== 'all') {
      filtered = filtered.filter(booking => booking.batchId === selectedBatch)
    }

    return filtered
  }, [searchTerm, statusFilter, guestCountFilter, dateRangeFilter, selectedTrip, selectedBatch])

  const handleApplyFilters = () => {
    setIsFilterModalOpen(false)
  }

  const handleClearFilters = () => {
    setStatusFilter('all')
    setGuestCountFilter(null)
    setDateRangeFilter({
      start: '',
      end: ''
    })
    setSelectedTrip('all')
    setSelectedBatch('all')
  }

  const columns: TableColumn<Booking>[] = [
    {
      key: 'id',
      header: 'Booking ID',
      width: '128px',
      align: 'left'
    },
    {
      key: 'guestName',
      header: 'Guest Name',
      width: '208px',
      align: 'left',
      render: (_, booking) => (
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
            booking.guestInitial === 'P' ? 'bg-linear-to-br from-purple-100 to-purple-50' :
            booking.guestInitial === 'R' ? 'bg-linear-to-br from-red-100 to-red-50' :
            booking.guestInitial === 'A' ? 'bg-linear-to-br from-amber-100 to-amber-50' :
            booking.guestInitial === 'S' ? 'bg-linear-to-br from-pink-100 to-pink-50' :
            booking.guestInitial === 'K' ? 'bg-linear-to-br from-green-100 to-green-50' :
            booking.guestInitial === 'M' ? 'bg-linear-to-br from-indigo-100 to-indigo-50' :
            booking.guestInitial === 'N' ? 'bg-linear-to-br from-cyan-100 to-cyan-50' :
            booking.guestInitial === 'D' ? 'bg-linear-to-br from-orange-100 to-orange-50' :
            'bg-linear-to-br from-blue-100 to-blue-50'
          }`}>
            <span className={`text-sm font-normal ${
              booking.guestInitial === 'P' ? 'text-purple-700' :
              booking.guestInitial === 'R' ? 'text-red-700' :
              booking.guestInitial === 'A' ? 'text-amber-700' :
              booking.guestInitial === 'S' ? 'text-pink-700' :
              booking.guestInitial === 'K' ? 'text-green-700' :
              booking.guestInitial === 'M' ? 'text-indigo-700' :
              booking.guestInitial === 'N' ? 'text-cyan-700' :
              booking.guestInitial === 'D' ? 'text-orange-700' :
              'text-blue-700'
            }`}>
              {booking.guestInitial}
            </span>
          </div>
          <span className="text-sm text-maintext">{booking.guestName}</span>
        </div>
      )
    },
    {
      key: 'destination',
      header: 'Destination & Date',
      width: '240px',
      align: 'left'
    },
    {
      key: 'guests',
      header: 'Guests',
      width: '96px',
      align: 'center'
    },
    {
      key: 'amount',
      header: 'Amount',
      width: '112px',
      align: 'center',
      render: (value) => (
        <span className="text-sm text-maintext font-medium">{String(value)}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      width: '160px',
      align: 'center',
      render: (value) => (
        value === 'confirmed' ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-success-bg rounded-lg">
            <Check className="w-3 h-3 text-success" strokeWidth={2.5} />
            <span className="text-xs text-success">Confirmed</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-warning-bg rounded-lg">
            <Clock className="w-3 h-3 text-warning" strokeWidth={2.5} />
            <span className="text-xs text-warning">Pending</span>
          </div>
        )
      )
    },
    {
      key: 'bookingDate',
      header: 'Booking Date',
      width: '144px',
      align: 'center'
    }
  ]

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
        <Table
          columns={columns}
          data={filteredBookings}
          height="h-[calc(100vh-300px)]"
          keyExtractor={(item) => item.id}
        />
        <div className="mt-4 text-sm text-subtext">
          Showing {filteredBookings.length} of {bookingsData.length} bookings
        </div>
      </div>
      <Modal
        open={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
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
                setSelectedBatch('all') // Reset batch when trip changes
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
                setIsFilterModalOpen(false)
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
    </div>
  )
}

export default Bookings