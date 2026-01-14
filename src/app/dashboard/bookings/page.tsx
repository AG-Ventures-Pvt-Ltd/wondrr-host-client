'use client';

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Table from '@/common/components/composites/table'
import CustomSelect from '@/common/components/composites/CustomSelect'
import Button from '@/common/components/atoms/Button'
import Card from '@/common/components/composites/Card'
import { useGetAllBookings } from '@/common/hooks/useGetAllBookings'
import { useGetData } from '@/common/services/useGetData'
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints'
import { BOOKINGS_COLUMNS } from './constants/constants'
import { UsersRound } from 'lucide-react';

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
    
    if (selectedTrip !== 'all') params.set('tripId', selectedTrip)
    if (selectedBatch !== 'all') params.set('batchId', selectedBatch)

    const queryString = params.toString()
    router.replace(`/dashboard/bookings${queryString ? `?${queryString}` : ''}`, { scroll: false })
  }, [selectedTrip, selectedBatch, router])

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
    return bookingsData.filter(booking => booking.status === 'confirmed')
  }, [bookingsData])

  const handleClearFilters = () => {
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
        ) : filteredBookings.length === 0 ? (
          <div className="flex justify-center items-center h-[calc(100vh-320px)]">
            <Card className="p-0 w-[434px] h-[292px] relative">
              <div className="absolute w-20 h-20 left-44 top-12 bg-[#FAF5FF] rounded-xl flex justify-center items-center">
                <UsersRound className='text-[#9810FA]' size={36}/>
              </div>
              <div className="absolute w-[384px] h-6 left-6 top-[152px]">
                <div className="absolute left-[132.36px] -top-0.5 text-center text-maintext text-base font-normal leading-6 wrap-break-words">No Bookings Yet</div>
              </div>
              <div className="absolute w-[384px] h-[78px] left-6 top-[188px]">
                <div className="absolute w-[369px] left-[7.71px] -top-0.5 text-center text-[#525252] text-base font-normal leading-[26px] wrap-break-word">Once customers start booking your trips, you&apos;ll see all their details here. Create your first trip to get started.</div>
              </div>
            </Card>
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