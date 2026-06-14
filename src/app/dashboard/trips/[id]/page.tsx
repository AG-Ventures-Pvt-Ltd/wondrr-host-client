'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTripDetails } from '../hooks/useTripDetails';
import { useTripBatchDetails } from '../hooks/useTripBatchDetails';
import BackButton from './components/BackButton';
import TripHero from './components/TripHero';
import StatsCards from './components/StatsCards';
import TripBatches from './components/TripBatches';
import Itinerary from './components/Itinerary';
import TripDescription from './components/TripDescription';
import FAQ from './components/FAQ';
import TripSidebar from './components/TripSidebar';
import ShareTripModal from './components/ShareTripModal';
import DeleteTripModal from './components/DeleteTripModal';
import { useDeleteTrip } from '../hooks/useDeleteTrip';
import Loader from '@/common/components/composites/Loader';
import Button from '@/common/components/atoms/Button';
import { Share2, BarChart3, Eye, Trash2 } from 'lucide-react';
import Card from '@/common/components/composites/Card';


const TripDetailsPage = () => {

    const router = useRouter();
    const params = useParams();
    const tripId = params.id as string;
    const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const deleteTripMutation = useDeleteTrip();

    const { tripDetails, isLoading, error } = useTripDetails(tripId);
    const { tripBatches } = useTripBatchDetails(tripId, 1, 2);

    const handleEditTrip = () => {
        router.push(`/dashboard/trips/${tripId}/edit`);
    };

    if (isLoading) return <Loader />;

    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error loading trip details</div>;

    if (!tripDetails) return <div className="flex justify-center items-center h-screen text-neutral-500">Trip not found</div>;

    return (
        <div className="min-h-screen">
            <BackButton />
            <div className="flex pt-6 gap-8">
                <div className='flex-3'>
                    <TripHero
                        images={tripDetails.tripImages}
                        title={tripDetails.title}
                        location={tripDetails.location}
                        onEdit={handleEditTrip}
                    />
                </div>
                <Card className="flex-1 flex flex-col gap-4">
                    <h2 className="text-base text-maintext">Quick Actions</h2>
                    <div className="flex flex-col gap-2">
                        <Button
                            variant="text"
                            className="h-10 px-4 rounded-2xl flex items-center gap-2 hover:bg-gray-50 text-left justify-start"
                            onClick={() => {
                                const tripLink = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/trip/${tripId}`;
                                window.open(tripLink, '_blank');
                            }}
                        >
                            <Eye className="w-4 h-4 text-neutral-600" />
                            <span className="text-sm text-neutral-600">View Public Page</span>
                        </Button>
                        <Button
                            variant="text"
                            className="h-10 px-4 rounded-2xl flex items-center gap-2 hover:bg-gray-50 text-left justify-start"
                            onClick={() => router.push(`/dashboard/bookings?tripId=${tripId}`)}
                        >
                            <BarChart3 className="w-4 h-4 text-neutral-600" />
                            <span className="text-sm text-neutral-600">View All Bookings</span>
                        </Button>
                        <Button
                            variant="text"
                            className="h-10 px-4 rounded-2xl flex items-center gap-2 hover:bg-gray-50 text-left justify-start"
                            onClick={() => setIsShareModalOpen(true)}
                        >
                            <Share2 className="w-4 h-4 text-neutral-600" />
                            <span className="text-sm text-neutral-600">Share Trip</span>
                        </Button>
                        <Button
                            variant="text"
                            className="h-10 px-4 rounded-2xl flex items-center gap-2 hover:bg-red-50 text-left justify-start"
                            onClick={() => setIsDeleteModalOpen(true)}
                        >
                            <Trash2 className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-red-500">Delete Trip</span>
                        </Button>
                    </div>
                </Card>
            </div>
            <div className="pt-8">
                <StatsCards
                    totalRevenue={tripDetails.stats.totalRevenue}
                    batches={tripDetails.stats.batches}
                    category={tripDetails.category}
                    difficulty={tripDetails.difficulty}
                    totalViews={tripDetails.totalViews}
                    totalShares={tripDetails.totalShares}
                />
            </div>
            <div className="pt-6">
                <div className="grid grid-cols-[1fr_349px] gap-6">
                    <div className="flex flex-col gap-6">
                        <TripBatches batches={tripBatches} tripId={tripId} />
                        <Itinerary items={tripDetails.itinerary} />
                        <TripDescription description={tripDetails.description} />
                        <FAQ faqs={tripDetails.faqs} />
                    </div>
                    <TripSidebar
                        tags={tripDetails.tags}
                        inclusions={tripDetails.inclusions}
                        exclusions={tripDetails.exclusions}
                        thingsToCarry={tripDetails.thingsToCarry}
                        highlights={tripDetails.highlights}
                        pricing={tripDetails.pricing}
                        cancellationPolicy={tripDetails.cancellationPolicy}
                        isFemaleOnly={tripDetails.isFemaleOnly}
                        difficulty={tripDetails.difficulty}
                        rating={tripDetails.rating}
                        totalReviews={tripDetails.totalReviews}
                    />
                </div>
            </div>
            <ShareTripModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                tripTitle={tripDetails.title}
                tripSlug={tripId}
            />
            <DeleteTripModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                tripName={tripDetails.title}
                isPending={deleteTripMutation.isPending}
                onConfirm={() => {
                    deleteTripMutation.mutate(tripId, {
                        onSuccess: () => {
                            setIsDeleteModalOpen(false);
                            router.push('/dashboard/trips');
                        },
                    });
                }}
            />
        </div>
    );
};

export default TripDetailsPage;
