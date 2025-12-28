'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTripDetails } from '../hooks/useTripDetails';
import { useTripBatchDetails } from '../hooks/useTripBatchDetails';
import Loader from '@/common/components/composites/Loader/Loader';
import { QUICK_ACTIONS } from '@/common/constants/tripDetails';
import BackButton from './components/BackButton';
import TripHero from './components/TripHero';
import StatsCards from './components/StatsCards';
import TripBatches from './components/TripBatches';
import Itinerary from './components/Itinerary';
import TripDescription from './components/TripDescription';
import FAQ from './components/FAQ';
import TripSidebar from './components/TripSidebar';
import ShareTripModal from './components/ShareTripModal';

const TripDetailsPage = () => {
    const router = useRouter();
    const params = useParams();
    const tripId = params.id;
    const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

    const { tripDetails, isLoading, error } = useTripDetails(tripId);
    const { tripBatches } = useTripBatchDetails(tripId);

    const handleEditTrip = () => {
        router.push(`/dashboard/trips/${tripId}/edit`);
    };

    const handleQuickAction = (action) => {
        if (action.label === 'Share Trip') {
            setIsShareModalOpen(true);
        }
    };

    if (isLoading) return <Loader />;

    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error loading trip details</div>;

    return (
        <div className="min-h-screen">
            <BackButton />
            <div className="pt-10">
                <TripHero
                    image={tripDetails.image}
                    title={tripDetails?.title}
                    location={tripDetails?.location}
                    onEdit={handleEditTrip}
                />
            </div>
            <div className="pt-8">
                <StatsCards
                    totalRevenue={tripDetails.stats.totalRevenue}
                    batches={tripDetails.stats.batches}
                    category={tripDetails.category}
                />
            </div>
            <div className="pt-6">
                <div className="grid grid-cols-[1fr_349px] gap-6">
                    <div className="flex flex-col gap-6">
                        <TripBatches batches={tripBatches} tripId={tripId} />
                        <Itinerary items={tripDetails.itinerary} />
                        <TripDescription description={tripDetails?.description} />
                        <FAQ faqs={tripDetails.faqs} />
                    </div>
                    <TripSidebar
                        tags={tripDetails.tags}
                        quickActions={QUICK_ACTIONS}
                        inclusions={tripDetails.inclusions}
                        exclusions={tripDetails.exclusions}
                        onQuickAction={handleQuickAction}
                    />
                </div>
            </div>
            <ShareTripModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                tripTitle={tripDetails?.title || ''}
                tripSlug={tripId}
            />
        </div>
    );
};

export default TripDetailsPage;