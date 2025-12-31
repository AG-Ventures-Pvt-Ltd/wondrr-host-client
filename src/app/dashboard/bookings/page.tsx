'use client';

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Table from '@/common/components/composites/table'
import CustomSelect from '@/common/components/composites/CustomSelect'
import Button from '@/common/components/atoms/Button'
import { useGetAllBookings } from '@/common/services/useGetAllBookings'
import { useGetData } from '@/common/services/useGetData'
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints'
import { BOOKINGS_COLUMNS } from './constants/constants'

interface TripBatchMap {
  tripId: string
  tripName: string
  batches: {
    _id: string
    title: string
  }[]
}

const BookingsContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending'>(
    (searchParams.get('status') as 'all' | 'confirmed' | 'pending') || 'all'
  )
  const [selectedTrip, setSelectedTrip] = useState<string>(searchParams.get('tripId') || 'all')
  const [selectedBatch, setSelectedBatch] = useState<string>(searchParams.get('batchId') || 'all')

  const { bookings: bookingsData, total, isLoading } = useGetAllBookings(
    page, 
    limit, 
    selectedTrip, 
    selectedBatch
  )
  const { data: tripBatchMaps, isLoading: isLoadingMaps } = useGetData<TripBatchMap[]>(
    API_ENDPOINTS.BOOKINGS.GET_TRIP_BATCH_MAPS
  )

  useEffect(() => {
    const params = new URLSearchParams()
    
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (selectedTrip !== 'all') params.set('tripId', selectedTrip)
    if (selectedBatch !== 'all') params.set('batchId', selectedBatch)

    const queryString = params.toString()
    router.replace(`/dashboard/bookings${queryString ? `?${queryString}` : ''}`, { scroll: false })
  }, [statusFilter, selectedTrip, selectedBatch, router])

  const trips = useMemo(() => {
    if (!tripBatchMaps) return [{ id: 'all', name: 'All Trips' }]
    
    return [
      { id: 'all', name: 'All Trips' },
      ...tripBatchMaps.map(trip => ({ id: trip.tripId, name: trip.tripName }))
    ]
  }, [tripBatchMaps])

  const batches = useMemo(() => {
    if (!tripBatchMaps) {
      return { 'all': [{ id: 'all', name: 'All Batches' }] }
    }

    const batchesByTrip: Record<string, Array<{ id: string; name: string }>> = {
      'all': [{ id: 'all', name: 'All Batches' }]
    }

    tripBatchMaps.forEach(trip => {
      batchesByTrip[trip.tripId] = [
        { id: 'all', name: 'All Batches' },
        ...trip.batches.map(batch => ({
          id: batch._id,
          name: batch.title
        }))
      ]
    })

    return batchesByTrip
  }, [tripBatchMaps])

  const filteredBookings = useMemo(() => {
    let filtered = bookingsData

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    return filtered
  }, [bookingsData, statusFilter])

  const handleClearFilters = () => {
    setStatusFilter('all')
    setSelectedTrip('all')
    setSelectedBatch('all')
  }

  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-2">
          <h1 className="text-2xl font-semibold text-maintext mb-2">Bookings</h1>
          <p className="text-sm text-subtext">Manage and track all your trip bookings</p>
        </div>
        <div className="mb-4">
            <div className="flex items-end gap-6">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-maintext mb-2">
                  Status
                </label>
                <CustomSelect
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value as 'all' | 'confirmed' | 'pending')}
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'confirmed', label: 'Confirmed' },
                    { value: 'pending', label: 'Pending' }
                  ]}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-maintext mb-2">
                  Trip
                </label>
                <CustomSelect
                  value={selectedTrip}
                  onChange={(value) => {
                    setSelectedTrip(value)
                    setSelectedBatch('all')
                  }}
                  options={trips.map((trip) => ({
                    value: trip.id,
                    label: trip.name
                  }))}
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-maintext mb-2">
                  Batch
                </label>
                <CustomSelect
                  value={selectedBatch}
                  onChange={(value) => setSelectedBatch(value)}
                  disabled={selectedTrip === 'all'}
                  options={batches[selectedTrip as keyof typeof batches]?.map((batch) => ({
                    value: batch.id,
                    label: batch.name
                  })) || []}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleClearFilters}
                  variant="outlined"
                  color="primary"
                  className="normal-case!"
                  startIcon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  }
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        {isLoading || isLoadingMaps ? (
          <div className="flex items-center justify-center h-[calc(100vh-300px)]">
            <div className="text-subtext">Loading bookings...</div>
          </div>
        ) : (
          <>
            <Table
              columns={BOOKINGS_COLUMNS}
              data={filteredBookings}
              height="h-[calc(100vh-320px)]"
              keyExtractor={(item) => item.id}
            />
            <div className="mt-2 text-sm text-subtext">
              Showing {filteredBookings.length} of {total} bookings
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const Bookings = () => {
  return (
    <Suspense fallback={
      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-2">
            <h1 className="text-2xl font-semibold text-maintext mb-2">Bookings</h1>
            <p className="text-sm text-subtext">Manage and track all your trip bookings</p>
          </div>
          <div className="flex items-center justify-center h-[calc(100vh-300px)]">
            <div className="text-subtext">Loading bookings...</div>
          </div>
        </div>
      </div>
    }>
      <BookingsContent />
    </Suspense>
  )
}

export default Bookings