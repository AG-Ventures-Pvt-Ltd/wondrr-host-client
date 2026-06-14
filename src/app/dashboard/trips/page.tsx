'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '@/common/components/atoms/Button'
import Modal from '@/common/components/composites/Modal'
import { useRouter } from 'next/navigation'
import { useTrips } from './hooks/useTrips'
import { useUpdateTripStatus } from './hooks/useUpdateTripStatus'
import { useDeleteTrip } from './hooks/useDeleteTrip'
import TripsLoadingState from './components/TripsLoadingState'
import TripsErrorState from './components/TripsErrorState'
import TripsEmptyState from './components/TripsEmptyState'
import TripCard from './components/TripCard'
import DeleteTripModal from './[id]/components/DeleteTripModal'

const Trips = () => {
    const router = useRouter()
    const { trips, isLoading, error, refetch } = useTrips()
    const updateTripStatusMutation = useUpdateTripStatus()
    const deleteTripMutation = useDeleteTrip()

    const [showStatusModal, setShowStatusModal] = useState(false)
    const [selectedTrip, setSelectedTrip] = useState<{ id: string; name: string; status: string; targetStatus: string } | null>(null)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [tripToDelete, setTripToDelete] = useState<{ slug: string; name: string } | null>(null)

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

    const handleDeleteClick = (trip: { slug: string; name: string }) => {
        setTripToDelete(trip)
        setShowDeleteModal(true)
    }

    const handleConfirmDelete = () => {
        if (tripToDelete) {
            deleteTripMutation.mutate(tripToDelete.slug, {
                onSuccess: () => {
                    setShowDeleteModal(false)
                    setTripToDelete(null)
                    refetch()
                },
            })
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
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>
            )}

            <Modal
                open={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                title="Change Trip Status"
                description={
                    selectedTrip?.targetStatus === 'in_review'
                        ? `Are you sure you want to submit "${selectedTrip?.name}" for review? It will be reviewed by our team before publishing.`
                        : selectedTrip?.targetStatus === 'published'
                        ? `Are you sure you want to publish "${selectedTrip?.name}"? It will be visible to travellers.`
                        : selectedTrip?.targetStatus === 'archived'
                        ? `Are you sure you want to archive "${selectedTrip?.name}"? It will no longer be visible to travellers.`
                        : `Are you sure you want to move "${selectedTrip?.name}" back to draft status?`
                }
                submitText={
                    selectedTrip?.targetStatus === 'in_review'
                        ? 'Submit for Review'
                        : selectedTrip?.targetStatus === 'published'
                        ? 'Publish Trip'
                        : selectedTrip?.targetStatus === 'archived'
                        ? 'Archive Trip'
                        : 'Move to Draft'
                }
                onSubmit={handleConfirmStatusChange}
                cancelText="Cancel"
                disabled={updateTripStatusMutation.isPending}
            />

            <DeleteTripModal
                open={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false)
                    setTripToDelete(null)
                }}
                tripName={tripToDelete?.name ?? ''}
                isPending={deleteTripMutation.isPending}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}

export default Trips
