'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BackButton from '@/common/ui/BackButton';
import { useInfiniteTripBatches } from '../../hooks/useInfiniteTripBatches';
import Loader from '@/common/components/composites/Loader';
import { Loader2 } from 'lucide-react';
import BatchFilters, { FilterType, BATCH_FILTERS } from './components/BatchFilters';
import BatchCard from './components/BatchCard';
import { DuplicateBatchModal } from './components/DuplicateBatchModal';
import { useDuplicateBatch } from '../../hooks/useDuplicateBatch';
import SuccessModal from '@/common/components/modals/SuccessModal';

interface DuplicateTarget {
    batchId: string;
    durationDays: number;
}

const Batches = () => {
    const params = useParams();
    const tripId = params.id as string;
    const [activeFilter, setActiveFilter] = useState<FilterType>('active');
    const limit = 10;
    const sentinelRef = useRef<HTMLDivElement>(null);

    const [duplicateTarget, setDuplicateTarget] = useState<DuplicateTarget | null>(null);
    const [successCount, setSuccessCount] = useState<number | null>(null);

    const handleFilterChange = (filter: FilterType) => {
        setActiveFilter(filter);
    };

    const activeStatus = BATCH_FILTERS.find(f => f.value === activeFilter)?.status;

    const { tripBatches, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, title, location } =
        useInfiniteTripBatches(tripId, limit, activeStatus);

    const { duplicateBatch, isPending } = useDuplicateBatch({
        tripSlug: tripId,
        onSuccess: (count) => {
            setDuplicateTarget(null);
            setSuccessCount(count);
        },
    });

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) return <Loader />;

    return (
        <div>
            <BackButton label="Back to Trip Overview" to={`/dashboard/trips/${tripId}`} className='mb-5' />

            <div className="flex flex-col gap-2 mb-6">
                <h1 className="text-xl text-maintext font-medium">
                    All Batches - {title}
                </h1>
                <p className="text-base text-subtext">{location}</p>
            </div>
            <BatchFilters activeFilter={activeFilter} onChange={handleFilterChange} />
            <div className="grid grid-cols-2 gap-6">
                {tripBatches.map((batch) => (
                    <BatchCard
                        key={batch._id}
                        batch={batch}
                        tripId={tripId}
                        onDuplicate={(batchId, durationDays) => setDuplicateTarget({ batchId, durationDays })}
                    />
                ))}
            </div>
            <div ref={sentinelRef} className="h-8 mt-4 flex items-center justify-center">
                {isFetchingNextPage && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
            </div>

            {duplicateTarget && (
                <DuplicateBatchModal
                    open={!!duplicateTarget}
                    onClose={() => setDuplicateTarget(null)}
                    sourceBatchId={duplicateTarget.batchId}
                    durationDays={duplicateTarget.durationDays}
                    onDuplicate={duplicateBatch}
                    isPending={isPending}
                />
            )}

            <SuccessModal
                open={successCount !== null}
                onClose={() => setSuccessCount(null)}
                title="Batches Created!"
                description={`${successCount} new batch${successCount !== 1 ? 'es were' : ' was'} successfully created as drafts.`}
            />
        </div>
    );
};

export default Batches;


