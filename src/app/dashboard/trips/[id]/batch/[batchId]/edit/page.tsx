'use client'

import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import BatchForm from '../../create/components/BatchForm'
import { useBatchFormStore } from '../../create/store'
import { useBatchDetails } from '../../../../hooks/useBatchDetails'
import Loader from '@/common/components/composites/Loader'

const EditBatchPage = () => {
    const params = useParams()
    const router = useRouter()
    const batchId = params.batchId as string
    const tripId = params.id as string

    const { rawData, isLoading, error } = useBatchDetails(batchId)

    useEffect(() => {
        if (rawData) {
            // Format datetime for datetime-local input (YYYY-MM-DDTHH:MM in local time)
            const formatDateTimeForInput = (dateStr: string) => {
                if (!dateStr) return ''
                const date = new Date(dateStr)
                if (isNaN(date.getTime())) return ''
                const year = date.getFullYear()
                const month = String(date.getMonth() + 1).padStart(2, '0')
                const day = String(date.getDate()).padStart(2, '0')
                const hours = String(date.getHours()).padStart(2, '0')
                const minutes = String(date.getMinutes()).padStart(2, '0')
                return `${year}-${month}-${day}T${hours}:${minutes}`
            }

            // Extract just the date part (YYYY-MM-DD) for the date input
            const formatDateForInput = (dateStr: string) => {
                if (!dateStr) return ''
                const date = new Date(dateStr)
                if (isNaN(date.getTime())) return ''
                return date.toISOString().split('T')[0]
            }

            // meetingPoint.location may be a populated object or a plain ID string
            const meetingPoints: { location: string; pickupPrice: number | null }[] =
                rawData.meetingPoint?.length
                    ? rawData.meetingPoint.map(point => ({
                          location: typeof point.location === 'object' && point.location !== null
                              ? point.location._id
                              : String(point.location ?? ''),
                          pickupPrice: point.pickupPrice || null
                      }))
                    : [{ location: '', pickupPrice: null }]

            // dropPoint may be populated objects or plain ID strings
            const dropPoints: string[] =
                rawData.dropPoint?.map(dp =>
                    typeof dp === 'object' && dp !== null ? dp._id : String(dp)
                ) ?? []

            const formData = {
                startDateTime: formatDateTimeForInput(rawData.startDate), // Format as datetime-local
                endDateTime: formatDateForInput(rawData.endDate),
                meetingPoint: meetingPoints,
                dropPoint: dropPoints,
                pointOfContact: {
                    name: rawData.pointOfContact?.name || '',
                    phone: rawData.pointOfContact?.phone || '',
                },
                totalSeats: rawData.totalSeats || null,
                status: (rawData.status?.toLowerCase() || 'draft') as 'draft' | 'published' | 'cancelled',
                closeBooking: rawData.closeBooking ? new Date(rawData.closeBooking).toISOString().split('T')[0] : '',
            }

            useBatchFormStore.getState().prefillFormData(formData)
        }

        // Cleanup function to reset form when component unmounts
        return () => {
            useBatchFormStore.getState().resetForm()
        }
    }, [rawData])

    const handleSuccess = () => {
        router.push(`/dashboard/trips/${tripId}/batch/${batchId}`)
    }

    const handleCancel = () => {
        router.push(`/dashboard/trips/${tripId}/batch/${batchId}`)
    }

    if (isLoading) return <Loader />
    
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error loading batch details</div>

    return (
        <div className="w-full flex flex-col items-center h-full px-20">
            <BatchForm 
                onCancel={handleCancel} 
                onSuccess={handleSuccess}
                isEditMode={true}
                batchId={batchId}
                tripId={tripId}
            />
        </div>
    )
}

export default EditBatchPage
