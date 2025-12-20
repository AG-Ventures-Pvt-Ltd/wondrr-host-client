'use client'

import React from 'react'
import Card from '../../../common/components/composites/Card'
import { Plus, ChevronRight, Folder, AlertCircle, Loader2 } from 'lucide-react'
import Button from '@/common/components/atoms/Button'
import { useRouter } from 'next/navigation'
import { useTrips } from './hooks/useTrips'

const Trips = () => {
    const router = useRouter()
    const { trips, isLoading, error } = useTrips()

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
                <div className="flex flex-col items-center justify-center py-12">
                    <Folder className="w-16 h-16 text-subtext mb-4" />
                    <h3 className="text-lg font-medium text-maintext mb-2">No trips yet</h3>
                    <p className="text-subtext text-center mb-6">Create your first trip to get started</p>
                    <Button className="bg-primary rounded-2xl" onClick={() => router.push('/dashboard/trips/create')}>
                        <Plus size={16} strokeWidth={4} />
                        <span className="ml-2">Create Trip</span>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-6">
                    {trips.map((trip) => (
                        <div key={trip.id} className="cursor-pointer" onClick={() => router.push(`/dashboard/trips/${trip.slug}`)}>
                            <Card className="flex justify-between items-center p-4!">
                                <div className='flex gap-2 items-center'>
                                    <Folder size={52} className="text-primary bg-primary-bg p-3 rounded-2xl mr-2" />
                                    <div className={`flex flex-col justify-start items-start gap-1`}>
                                        <div className={`text-maintext font-normal`}>{trip.name}</div>
                                        <div className={` text-subtext font-normal`}>{trip.batches}</div>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-subtext" />
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Trips