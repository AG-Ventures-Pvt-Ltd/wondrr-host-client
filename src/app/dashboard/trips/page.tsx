'use client'

import React, { useState } from 'react'
import Card from '../../../common/components/composites/Card'
import { Plus, Dot, Folder, AlertCircle, Loader2, MapPin, Rocket } from 'lucide-react'
import Button from '@/common/components/atoms/Button'
import Modal from '@/common/components/composites/Modal'
import { useRouter } from 'next/navigation'
import { useTrips } from './hooks/useTrips'
import { useUpdateTripStatus } from './hooks/useUpdateTripStatus'
import MyImage from '@/common/components/atoms/Image'


const Trips = () => {
    const router = useRouter()
    const { trips, isLoading, error, refetch } = useTrips()
    const updateTripStatusMutation = useUpdateTripStatus()
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [selectedTrip, setSelectedTrip] = useState<{ id: string; name: string; status: string } | null>(null)

    const handleStatusToggle = (trip: { id: string; name: string; status: string; }) => {
        setSelectedTrip(trip)
        setShowStatusModal(true)
    }

    const handleConfirmStatusChange = () => {
        if (selectedTrip) {
            updateTripStatusMutation.mutate(
                { tripId: selectedTrip.id, status: 'published' },
                {
                    onSuccess: () => {
                        setShowStatusModal(false)
                        setSelectedTrip(null)
                        refetch() // Refetch trips to update the status
                    },
                }
            )
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-subtext">Loading trips...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                    <p className="text-subtext">Failed to load trips. Please try again.</p>
                    <Button onClick={() => window.location.reload()} variant="outlined">
                        Retry
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className='flex-col'>
                    <div className="text-maintext text-xl font-medium ">My Trips</div>
                    <div className="text-subtext text-lg font-normal ">{trips.length} {trips.length === 1 ? 'trip' : 'trips'}</div>
                </div>
                <Button className="bg-primary rounded-2xl" onClick={() => router.push('/dashboard/trips/create')}>
                    <Plus size={16} strokeWidth={4} />
                    <div className="text-center ml-2 justify-star text-sm font-normal">Create Trip</div>
                </Button>
            </div>
            {trips.length === 0 ? (
                <Card className="max-w-lg mx-auto flex flex-col items-center py-6 my-[10%] gap-6">
                    <div className="flex items-center justify-center w-20 h-20 bg-blue-50 rounded-2xl">
                        <Folder className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-base text-neutral-900 font-normal text-center">
                        Create Your First Trip
                    </h3>
                    <p className="text-base text-neutral-600 font-normal text-center px-3">
                        Start organizing amazing travel experiences.
                        <br />
                        Add your first destination, set up batches, and watch bookings roll in.
                    </p>
                    <Button
                        className="bg-blue-600 rounded-2xl text-white shadow-sm"
                        onClick={() => router.push('/dashboard/trips/create')}
                    >
                        <Plus size={16} strokeWidth={2} />
                        <span className="ml-2 text-sm">Create Your First Trip</span>
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-3 gap-6">
                    {trips.map((trip) => (
                        <Card key={trip.id} className="cursor-pointer overflow-hidden p-0!" onClick={() => router.push(`/dashboard/trips/${trip.slug}`)}>
                            <div className="relative w-full h-52 bg-gray-100">
                                {trip.image ? (
                                    <MyImage
                                        src={trip.image}
                                        alt={trip.slug}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Folder className="w-16 h-16 text-gray-300" />
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex flex-col gap-2 mb-2">
                                <h3 className="text-maintext font-medium text-lg">{trip.name}</h3>
                                {trip.location && (
                                    <div className="flex items-center gap-1 text-subtext text-sm">
                                        <MapPin size={14} />
                                        <span>{trip.location}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-8 text-sm">
                                        <div className="flex items-center">
                                            <Dot size={16} strokeWidth={9} className="text-success p-0! m-0!" />
                                            <span className="text-subtext">
                                                {trip.upcomingBatches} upcoming
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Dot size={16} strokeWidth={9} className="text-subtext" />
                                            <span className="text-subtext">
                                                {trip.completedBatches} completed
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${trip.status === 'published'
                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                {trip.status === 'published' ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {trip.status !== 'published' && (
                                    <Button
                                        className="flex items-center gap-1.5 mt-3!"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleStatusToggle({
                                                id: trip.id,
                                                name: trip.name,
                                                status: trip.status || 'draft',
                                            })
                                        }}
                                    >
                                        <Rocket className="w-3.5 h-3.5" />
                                        <span className="font-medium">Publish</span>
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Status Change Confirmation Modal */}
            <Modal
                open={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                title="Change Trip Status"
                description={`Are you sure you want to change trip status to published? This action cannot be undone.`}
                submitText="Publish Trip"
                onSubmit={handleConfirmStatusChange}
                cancelText="Cancel"
                disabled={updateTripStatusMutation.isPending}
            />
        </div>
    )
}

export default Trips