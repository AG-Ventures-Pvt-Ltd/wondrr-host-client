'use client'

import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import BatchForm from '../../create/components/BatchForm'
import { useBatchFormStore } from '../../create/store'
import { useBatchDetails } from '../../../../hooks/useBatchDetails'
import Loader from '../../../../../../../common/components/composites/Loader/Loader'

const EditBatchPage = () => {
    const params = useParams()
    const router = useRouter()
    const batchId = params.batchId as string
    const tripId = params.id as string

    const { rawData, isLoading, error } = useBatchDetails(batchId)

    useEffect(() => {
        if (rawData) {
            // Format date to YYYY-MM-DD for input fields
            const formatDateForInput = (dateStr: string) => {
                if (!dateStr) return ''
                const date = new Date(dateStr)
                if (isNaN(date.getTime())) return ''
                return date.toISOString().split('T')[0]
            }

            const formData = {
                startDate: formatDateForInput(rawData.startDate),
                startTime: rawData.startTime || '',
                endDate: formatDateForInput(rawData.endDate),
                meetingPoint: rawData.meetingPoint || '',
                endPoint: rawData.endPoint || '',
                pointOfContact: {
                    name: rawData.pointOfContact?.name || '',
                    phone: rawData.pointOfContact?.phone || '',
                },
                totalSeats: rawData.totalSeats || null,
                status: (rawData.status?.toLowerCase() || 'draft') as 'draft' | 'published' | 'cancelled',
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
