'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '@/common/components/atoms/Button'
import Modal from '@/common/components/composites/Modal'
import { useRouter } from 'next/navigation'
import { useTrips } from './hooks/useTrips'
import { useUpdateTripStatus } from './hooks/useUpdateTripStatus'
import TripsLoadingState from './components/TripsLoadingState'
import TripsErrorState from './components/TripsErrorState'
import TripsEmptyState from './components/TripsEmptyState'
import TripCard from './components/TripCard'

const Trips = () => {
    const router = useRouter()
    const { trips, isLoading, error, refetch } = useTrips()
    const updateTripStatusMutation = useUpdateTripStatus()
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [selectedTrip, setSelectedTrip] = useState<{ id: string; name: string; status: string; targetStatus: string } | null>(null)

    const handleStatusToggle = (trip: { id: string; name: string; status: string }, targetStatus: string) => {
        setSelectedTrip({ ...trip, targetStatus })
        setShowStatusModal(true)
    }

    const handleConfirmStatusChange = () => {
        if (selectedTrip) {
            updateTripStatusMutation.mutate(
                { tripId: selectedTrip.id, status: selectedTrip.targetStatus },
                {
                    onSuccess: () => {
                        setShowStatusModal(false)
                        setSelectedTrip(null)
                        refetch()
                    },
                }
            )
        }
    }

    if (isLoading) return <TripsLoadingState />
    if (error) return <TripsErrorState />

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className='flex-col'>
                    <div className="text-maintext text-xl font-medium">My Trips</div>
                    <div className="text-subtext text-lg font-normal">{trips.length} {trips.length === 1 ? 'trip' : 'trips'}</div>
                </div>
                <Button className="bg-primary rounded-2xl" onClick={() => router.push('/dashboard/trips/create')}>
                    <Plus size={16} strokeWidth={4} />
                    <div className="text-center ml-2 justify-star text-sm font-normal">Create Trip</div>
                </Button>
            </div>

            {trips.length === 0 ? (
                <TripsEmptyState />
            ) : (
                <div className="grid grid-cols-3 gap-6">
                    {trips.map((trip) => (
                        <TripCard
                            key={trip.id}
                            trip={trip}
                            onStatusToggle={handleStatusToggle}
                            isUpdating={updateTripStatusMutation.isPending}
                        />
                    ))}
                </div>
            )}

            <Modal
                open={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                title="Change Trip Status"
                description={
                    selectedTrip?.targetStatus === 'published'
                        ? `Are you sure you want to publish "${selectedTrip?.name}"? It will be visible to travellers.`
                        : `Are you sure you want to unpublish "${selectedTrip?.name}"? It will no longer be visible to travellers.`
                }
                submitText={selectedTrip?.targetStatus === 'published' ? 'Publish Trip' : 'Unpublish Trip'}
                onSubmit={handleConfirmStatusChange}
                cancelText="Cancel"
                disabled={updateTripStatusMutation.isPending}
            />
        </div>
    )
}

export default Trips
