'use client'

import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import TripForm from '../../create/components/TripForm'
import { useTripFormStore } from '../../create/store'
import { useTripDetails } from '../../hooks/useTripDetails'
import Loader from '@/common/components/composites/Loader'
import { AddOnCategory, TripDifficulty } from '../../create/types'
import { TRIP_CATEGORIES } from '../../create/constants'

const EditTripPage = () => {
    const params = useParams()
    const tripId = params.id as string

    const { tripDetails, isLoading, error } = useTripDetails(tripId)

    useEffect(() => {
        if (tripDetails) {
            
            // Transform API data to match the form store structure
            const formData = {
                title: tripDetails.title || '',
                description: tripDetails.description || '',
                difficulty: (tripDetails.difficulty as TripDifficulty) || '',
                category: (tripDetails.category || []).map(cat => 
                  cat.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
                ).filter(cat => TRIP_CATEGORIES.includes(cat as any)),
                tags: tripDetails.tags || [],
                location: {
                    address: tripDetails.locationObj?.address || '',
                    city: tripDetails.locationObj?.city || '',
                    state: tripDetails.locationObj?.state || '',
                    latitude: null,
                    longitude: null,
                },
                tripImages: Array.isArray(tripDetails.tripImages) && tripDetails.tripImages.length > 0
                    ? tripDetails.tripImages.map((url: string, index: number) => ({ url, name: `image-${index}` }))
                    : [],
                faqs: (tripDetails.faqs || [])
                    .filter((faq) => faq && faq.question && faq.answer)
                    .map((faq: { question: string; answer: string }, index: number) => ({
                        id: Date.now() + index * 1000,
                        question: faq.question,
                        answer: faq.answer,
                    })),
                pricings: (tripDetails.pricing?.pricings || [])
                    .filter((pricing) => pricing && pricing.label)
                    .map((pricing: { label: string; description: string; pricePerPerson: number }, index: number) => ({
                        id: Date.now() + 5000 + index * 100,
                        label: pricing.label,
                        description: pricing.description,
                        pricePerPerson: pricing.pricePerPerson,
                    })),
                addOns: (tripDetails.pricing?.addOns || [])
                    .filter((addOn) => addOn && addOn.label)
                    .map((addOn: { label: string; description: string; category: string; pricePerPerson: number }, index: number) => ({
                        id: Date.now() + 6000 + index * 100,
                        label: addOn.label,
                        description: addOn.description,
                        category: addOn.category as AddOnCategory,
                        pricePerPerson: addOn.pricePerPerson,
                    })),
                cancellationPolicy: (tripDetails.cancellationPolicy?.refundTiers || [])
                    .filter((tier) => tier && typeof tier.daysBeforeCancellation === 'number' && typeof tier.refundPercentage === 'number')
                    .filter((tier, index, arr) => 
                        arr.findIndex(t => t.daysBeforeCancellation === tier.daysBeforeCancellation) === index
                    )
                    .map((tier: { daysBeforeCancellation: number; refundPercentage: number }, index: number) => ({
                        id: Date.now() + 7000 + index * 100,
                        daysBeforeCancellation: tier.daysBeforeCancellation,
                        refundPercentage: tier.refundPercentage,
                    })),
                itinerary: (tripDetails.itinerary || [])
                    .filter((item) => item && (item.title || item.day || item.description))
                    .map((item: { day: string; title?: string; description: string; activities?: string[] }, index: number) => {
                        const description = typeof item.description === 'string' ? item.description : String(item.description || '');
                        return {
                            id: Date.now() + 20000 + index * 100,
                            dayNumber: index + 1,
                            title: item.title || item.day || '',
                            description: description,
                            activities: item.activities || [],
                            wordCount: description.trim().split(/\s+/).filter((word: string) => word.length > 0).length || 0,
                        };
                    }),
                highlights: (tripDetails.highlights || [])
                    .filter((highlight: any) => {
                        if (typeof highlight === 'string') {
                            return highlight && highlight.trim().length > 0;
                        }
                        return highlight && highlight.title && highlight.title.trim().length > 0;
                    })
                    .map((highlight: any, index: number) => {
                        if (typeof highlight === 'string') {
                            // Convert string to object with blank image
                            return {
                                id: Date.now() + 8000 + index * 100,
                                title: highlight.trim(),
                                image: '',
                            };
                        }
                        // Already an object
                        return {
                            id: Date.now() + 8000 + index * 100,
                            title: highlight.title.trim(),
                            image: highlight.image || '',
                        };
                    }),
                inclusions: (tripDetails.inclusions || [])
                    .filter((text) => text && text.trim())
                    .map((text: string, index: number) => ({
                        id: Date.now() + 30000 + index * 100,
                        text,
                    })),
                exclusions: (tripDetails.exclusions || [])
                    .filter((text) => text && text.trim())
                    .map((text: string, index: number) => ({
                        id: Date.now() + 40000 + index * 100,
                        text,
                    })),
                thingsToCarry: (tripDetails.thingsToCarry || [])
                    .filter((text: string) => text && text.trim())
                    .map((text: string, index: number) => ({
                        id: Date.now() + 50000 + index * 100,
                        text,
                    })),
                additionalInfo: tripDetails.additionalInfo || '',
                isAdvanceBookingAllowed: tripDetails.isAdvanceBookingAllowed ?? false,
                advanceBookingPrice: tripDetails.advanceBookingPrice ?? 0,
                closeAdvanceBookingDays: tripDetails.closeAdvanceBookingDays ?? 0,
                bestTimeToVisit: tripDetails.bestTimeToVisit || '',
                status: (tripDetails.status || 'draft') as 'draft' | 'published',
            }
            useTripFormStore.getState().prefillFormData(formData)
        }

        return () => {
            useTripFormStore.getState().resetForm()
        }
    }, [tripDetails])

    if (isLoading) return <Loader />
    
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error loading trip details</div>

    return (
        <div className="w-full flex flex-col items-center h-full px-20">
            <TripForm 
                isEditMode={true}
                tripId={tripId}
            />
        </div>
    )
}

export default EditTripPage
