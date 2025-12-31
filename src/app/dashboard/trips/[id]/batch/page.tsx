'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Calendar, Star, Funnel, Users } from 'lucide-react';
import Card from '@/common/components/composites/Card';
import Button from '@/common/components/atoms/Button';
import BackButton from '@/common/ui/BackButton';
import { useTripBatchDetails } from '../../hooks/useTripBatchDetails';
import { formatDate, formatDateRangeWithDuration } from '@/common/utils/dateUtils';
import Loader from '@/common/components/composites/Loader';

type FilterType = 'all' | 'active' | 'filling' | 'expired';

const Batches = () => {
    const router = useRouter();
    const params = useParams();
    const tripId = params.id as string;
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { tripBatches, isLoading, title, location, hasNextPage, hasPrevPage, totalPages } = useTripBatchDetails(tripId, page, limit);

    const getStatusColor = (status: string) => {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus === 'active' || lowerStatus === 'available') return 'green';
        if (lowerStatus === 'filling-fast' || lowerStatus === 'filling') return 'amber';
        if (lowerStatus === 'sold-out') return 'red';
        if (lowerStatus === 'expired' || lowerStatus === 'cancelled') return 'gray';
        return 'gray';
    };

    const getStatusBg = (status: string) => {
        const color = getStatusColor(status);
        const bgMap: Record<string, string> = {
            green: 'bg-green-50',
            amber: 'bg-amber-50',
            red: 'bg-red-50',
            gray: 'bg-gray-200',
        };
        return bgMap[color] || 'bg-gray-200';
    };

    const getStatusText = (status: string) => {
        const color = getStatusColor(status);
        const textMap: Record<string, string> = {
            green: 'text-green-700',
            amber: 'text-amber-700',
            red: 'text-red-700',
            gray: 'text-gray-600',
        };
        return textMap[color] || 'text-gray-600';
    };

    const filteredBatches = tripBatches.filter(batch => {
        if (activeFilter === 'all') return true;
        const status = batch.status.toLowerCase();
        if (activeFilter === 'active') return status === 'active' || status === 'available';
        if (activeFilter === 'filling') return status === 'filling-fast' || status === 'filling';
        if (activeFilter === 'expired') return status === 'expired' || status === 'cancelled';
        return true;
    });

    if (isLoading) return <Loader />;

    return (
        <div>
            <BackButton label="Back to Trip Overview" to={`/dashboard/trips/${tripId}`} className='mb-5'/>
            
            <div className="flex flex-col gap-2 mb-6">
                <h1 className="text-xl text-maintext font-medium">
                    All Batches - {title}
                </h1>
                <p className="text-base text-subtext">{location}</p>
            </div>
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 text-subtext text-sm">
                    <Funnel size={16} />
                    <span>Filter by:</span>
                </div>
                <Button
                    variant={activeFilter === 'all' ? 'contained' : 'text'}
                    className={`px-4 py-2 rounded-xl text-sm ${
                        activeFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-subtext'
                    }`}
                    onClick={() => setActiveFilter('all')}
                >
                    All Batches
                </Button>
                <Button
                    variant={activeFilter === 'active' ? 'contained' : 'text'}
                    className={`px-4 py-2 rounded-xl text-sm ${
                        activeFilter === 'active' ? 'bg-primary text-white' : 'bg-gray-100 text-subtext'
                    }`}
                    onClick={() => setActiveFilter('active')}
                >
                    Active
                </Button>
                <Button
                    variant={activeFilter === 'filling' ? 'contained' : 'text'}
                    className={`px-4 py-2 rounded-xl text-sm ${
                        activeFilter === 'filling' ? 'bg-primary text-white' : 'bg-gray-100 text-subtext'
                    }`}
                    onClick={() => setActiveFilter('filling')}
                >
                    Filling
                </Button>
                <Button
                    variant={activeFilter === 'expired' ? 'contained' : 'text'}
                    className={`px-4 py-2 rounded-xl text-sm ${
                        activeFilter === 'expired' ? 'bg-primary text-white' : 'bg-gray-100 text-subtext'
                    }`}
                    onClick={() => setActiveFilter('expired')}
                >
                    Expired
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-6 overflow-y-scroll">
                {filteredBatches.map((batch) => {
                    const occupancyPercent = Math.round((batch.totalBookings / batch.totalSeats) * 100);
                    return (
                        <Card 
                            key={batch._id} 
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => router.push(`/dashboard/trips/${tripId}/batch/${batch._id}`)}
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-subtext" />
                                            <span className="text-base text-maintext">
                                                {formatDate(batch.startDate)}
                                            </span>
                                        </div>
                                        <span className="text-sm text-subtext">
                                            {formatDateRangeWithDuration(batch.startDate, batch.endDate)}
                                        </span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-xl text-xs ${getStatusBg(batch.status)} ${getStatusText(batch.status)}`}>
                                        {batch.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-subtext">Price</span>
                                        <span className="text-sm text-maintext">{batch.priceRange || '₹0'}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-subtext">Seats</span>
                                        <span className="text-sm text-maintext">
                                            {batch.totalBookings}/{batch.totalSeats}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-subtext">Revenue</span>
                                        <span className="text-sm text-maintext">{batch.revenue || '₹0'}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs text-subtext">Occupancy</span>
                                        <span className="text-sm text-maintext">{occupancyPercent}%</span>
                                    </div>
                                </div>
                                {batch.rating && (
                                    <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                                        <Star size={16} className="text-amber-500 fill-amber-500" />
                                        <span className="text-sm text-maintext">{batch.rating}</span>
                                        {batch.reviewCount && (
                                            <span className="text-xs text-subtext">({batch.reviewCount} reviews)</span>
                                        )}
                                    </div>
                                )}
                                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                        className="h-1.5 bg-primary rounded-full" 
                                        style={{ width: `${occupancyPercent}%` }} 
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={14} className="text-subtext" />
                                    <span className="text-xs text-subtext">
                                        {batch.totalBookings} booking{batch.totalBookings !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
            {totalPages && totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    <Button
                        variant="outlined"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={!hasPrevPage}
                        className="px-4 py-2 rounded-xl"
                    >
                        Previous
                    </Button>
                    <span className="px-4 py-2 text-sm text-subtext">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outlined"
                        onClick={() => setPage(p => p + 1)}
                        disabled={!hasNextPage}
                        className="px-4 py-2 rounded-xl"
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Batches;
