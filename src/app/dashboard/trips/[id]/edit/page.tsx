'use client'

import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import TripForm from '../../create/components/TripForm'
import { useTripFormStore } from '../../create/store'
import { useTripDetails } from '../../hooks/useTripDetails'
import Loader from '@/common/components/composites/Loader'
import { TRIP_CATEGORIES } from '../../create/constants'

const EditTripPage = () => {
    const params = useParams()
    const router = useRouter()
    const tripId = params.id as string

    const { tripDetails, isLoading, error } = useTripDetails(tripId)

    useEffect(() => {
        if (tripDetails) {
            // Check if category is in predefined list (case-insensitive), otherwise treat as custom
            const normalizedCategory = tripDetails.category?.toLowerCase()
            const isPredefinedCategory = TRIP_CATEGORIES.some(cat => cat.toLowerCase() === normalizedCategory)
            const categoryValue = isPredefinedCategory ? TRIP_CATEGORIES.find(cat => cat.toLowerCase() === normalizedCategory) || tripDetails.category : 'Other'

            // Transform API data to match the form store structure
            const formData = {
                title: tripDetails.title || '',
                description: tripDetails.description || '',
                category: categoryValue,
                tags: tripDetails.tags || [],
                location: {
                    address: tripDetails.locationObj?.address || '',
                    city: tripDetails.locationObj?.city || '',
                    state: tripDetails.locationObj?.state || '',
                    latitude: null,
                    longitude: null,
                },
                tripImages: Array.isArray(tripDetails.images) && tripDetails.images.length > 0
                    ? tripDetails.images.map((url: string, index: number) => ({ url, name: `image-${index}` }))
                    : (tripDetails.image ? [{ url: tripDetails.image, name: 'image' }] : []),
                faqs: (tripDetails.faqs || []).map((faq: { question: string; answer: string }, index: number) => ({
                    id: Date.now() + index,
                    question: faq.question,
                    answer: faq.answer,
                })),
                basePrice: tripDetails.basePrice || null,
                price: tripDetails.price || null,
                itinerary: (tripDetails.itinerary || []).map((item: { day: string; title?: string; description: string; activities?: string[] }, index: number) => ({
                    id: Date.now() + index,
                    dayNumber: index + 1,
                    title: item.title || item.day || '',
                    description: item.description || '',
                    activities: item.activities || [],
                    wordCount: item.description?.trim().split(/\s+/).filter((word: string) => word.length > 0).length || 0,
                })),
                inclusions: (tripDetails.inclusions || []).map((text: string, index: number) => ({
                    id: Date.now() + index,
                    text,
                })),
                exclusions: (tripDetails.exclusions || []).map((text: string, index: number) => ({
                    id: Date.now() + index,
                    text,
                })),
                status: 'published' as const,
            }

            useTripFormStore.getState().prefillFormData(formData)
        }

        // Cleanup function to reset form when component unmounts
        return () => {
            useTripFormStore.getState().resetForm()
        }
    }, [tripDetails])

    const handleSuccess = () => {
        router.push(`/dashboard/trips/${tripId}`)
    }

    const handleCancel = () => {
        router.push(`/dashboard/trips/${tripId}`)
    }

    if (isLoading) return <Loader />
    
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error loading trip details</div>

    return (
        <div className="w-full flex flex-col items-center h-full px-20">
            <TripForm 
                onCancel={handleCancel} 
                onSuccess={handleSuccess}
                isEditMode={true}
                tripId={tripId}
            />
        </div>
    )
}

export default EditTripPage
