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
import { useDeleteBatches } from '../../hooks/useDeleteBatches';
import SuccessModal from '@/common/components/modals/SuccessModal';
import DeleteBatchModal from './components/DeleteBatchModal';

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
    const [deleteSuccessCount, setDeleteSuccessCount] = useState<number | null>(null);

    // Multi-select state
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    // Single-delete target (from the trash icon on a card)
    const [singleDeleteId, setSingleDeleteId] = useState<string | null>(null);
    // Whether the bulk-delete confirm modal is open
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleFilterChange = (filter: FilterType) => {
        setActiveFilter(filter);
        setSelectedIds(new Set());
    };

    const activeStatus = BATCH_FILTERS.find(f => f.value === activeFilter)?.status;

    const { tripBatches, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, title, location } =
        useInfiniteTripBatches(tripId, limit, activeStatus);

    const { duplicateBatch, isPending: isDuplicating } = useDuplicateBatch({
        tripSlug: tripId,
        onSuccess: (count) => {
            setDuplicateTarget(null);
            setSuccessCount(count);
        },
    });

    const { deleteBatches, isPending: isDeleting } = useDeleteBatches({
        tripSlug: tripId,
        onSuccess: (count) => {
            setSelectedIds(new Set());
            setSingleDeleteId(null);
            setShowDeleteModal(false);
            setDeleteSuccessCount(count);
        },
    });

    const handleToggleSelect = (batchId: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(batchId)) next.delete(batchId);
            else next.add(batchId);
            return next;
        });
    };

    const handleSingleDelete = (batchId: string) => {
        setSingleDeleteId(batchId);
        setShowDeleteModal(true);
    };

    const handleBulkDelete = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        const ids = singleDeleteId ? [singleDeleteId] : Array.from(selectedIds);
        deleteBatches(ids);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSingleDeleteId(null);
    };

    // Batches with no bookings are eligible for deletion
    const deletableBatches = tripBatches.filter(b => b.totalBookings === 0);
    const allDeletableSelected = deletableBatches.length > 0 && deletableBatches.every(b => selectedIds.has(b._id));

    const handleSelectAll = () => {
        if (allDeletableSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(deletableBatches.map(b => b._id)));
        }
    };

    const deleteModalCount = singleDeleteId ? 1 : selectedIds.size;

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

            {deletableBatches.length > 0 && (
                <div className="flex items-center gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-subtext select-none">
                        <input
                            type="checkbox"
                            className="w-4 h-4 accent-primary"
                            checked={allDeletableSelected}
                            onChange={handleSelectAll}
                        />
                        Select all deletable
                    </label>
                    {selectedIds.size > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-sm hover:bg-red-100 transition-colors"
                        >
                            Delete selected ({selectedIds.size})
                        </button>
                    )}
                </div>
            )}

            <div className="grid grid-cols-2 gap-6">
                {tripBatches.map((batch) => (
                    <BatchCard
                        key={batch._id}
                        batch={batch}
                        tripId={tripId}
                        onDuplicate={(batchId, durationDays) => setDuplicateTarget({ batchId, durationDays })}
                        onDelete={handleSingleDelete}
                        isSelected={selectedIds.has(batch._id)}
                        onToggleSelect={handleToggleSelect}
                        selectionMode={selectedIds.size > 0}
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
                    isPending={isDuplicating}
                />
            )}

            <DeleteBatchModal
                open={showDeleteModal}
                onClose={handleCloseDeleteModal}
                count={deleteModalCount}
                onConfirm={handleConfirmDelete}
                isPending={isDeleting}
            />

            <SuccessModal
                open={successCount !== null}
                onClose={() => setSuccessCount(null)}
                title="Batches Created!"
                description={`${successCount} new batch${successCount !== 1 ? 'es were' : ' was'} successfully created as drafts.`}
            />

            <SuccessModal
                open={deleteSuccessCount !== null}
                onClose={() => setDeleteSuccessCount(null)}
                title="Batches Deleted!"
                description={`${deleteSuccessCount} batch${deleteSuccessCount !== 1 ? 'es were' : ' was'} successfully deleted.`}
            />
        </div>
    );
};

export default Batches;


