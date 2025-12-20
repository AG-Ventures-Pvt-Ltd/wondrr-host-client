'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/common/components/composites/Card';
import { ArrowLeft, TrendingUp, Calendar, Tag, HelpCircle, Eye, BarChart3, Share2, Edit, Plus, MoreVertical, MapPin } from 'lucide-react';
import {
    QUICK_ACTIONS
} from '@/common/constants/tripDetails';
import Button from '@/common/components/atoms/Button';
import { useTripDetails } from '../hooks/useTripDetails';
import { useTripBatchDetails } from '../hooks/useTripBatchDetails';
import Loader from '@/common/components/composites/Loader/Loader';
import { formatDateRangeWithDuration, formatDate } from '@/common/utils/dateUtils';

const TripDetailsPage = () => {
    const router = useRouter();
    const params = useParams();
    const tripId = params.id;

    const { tripDetails, isLoading, error } = useTripDetails(tripId);
    const { tripBatches, isLoading: batchesLoading, error: batchesError } = useTripBatchDetails(tripId);

    const getActionIcon = (iconName) => {
        const icons = {
            Eye,
            BarChart3,
            Share2
        };
        return icons[iconName] || Eye;
    };

    const handleAddBatch = () => {
        router.push(`/dashboard/trips/${tripId}/batch/create`);
    };

    const handleEditTrip = () => {
        router.push(`/dashboard/trips/${tripId}/edit`);
    };

    const handleBatchClick = (batchId) => {
        router.push(`/dashboard/trips/${tripId}/batch/${batchId}`);
    };

    if (isLoading) return <Loader />;

    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error loading trip details</div>;

    return (
        <div className="min-h-screen">
            <div className="flex items-center gap-2 text-maintext rounded-lg cursor-pointer w-fit" onClick={() => router.push('/dashboard/trips')}>
                <ArrowLeft size={20} />
                <span>Back to All Destinations</span>
            </div>
            <div className="pt-10">
                <div className="relative h-72 rounded-2xl overflow-hidden">
                    <Image
                        className="w-full h-full object-cover"
                        src={`${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${tripDetails.image}`}
                        alt={tripDetails?.title}
                        width={1093}
                        height={286}
                    />
                    <div className="absolute inset-0 bg-linear-to-l from-black/70 via-black/30 to-black/0" />
                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-normal text-white tracking-tight">
                                {tripDetails?.title}
                            </h1>
                            <div className="flex items-center gap-2 text-sm text-white/90">
                                <MapPin size={16} />
                                <span>{tripDetails?.location}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="text" className="h-10 px-4 bg-white! rounded-2xl shadow-md flex items-center gap-2 hover:bg-gray-50" onClick={handleEditTrip}>
                                <Edit className="w-4 h-4 text-maintext" />
                                <span className="text-sm text-maintext">Edit Trip</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pt-8">
                <div className="grid grid-cols-3 gap-4">
                    <Card className="flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                            <span className="text-neutral-500 capitalize">
                                Total Revenue
                            </span>
                            <div className="w-7 h-7 bg-green-50 rounded-[10px] flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-3xl text-maintext tracking-tight">{tripDetails.stats.totalRevenue}</div>
                            <div className=" text-neutral-500 mt-2">revenue</div>
                        </div>
                    </Card>
                    <Card className="flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                            <span className="text-neutral-500 capitalize">
                                Trip Batches Count
                            </span>
                            <div className="w-7 h-7 bg-purple-50 rounded-[10px] flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-purple-600" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-3xl text-maintext tracking-tight">{tripDetails.stats.batches}</div>
                            <div className=" text-neutral-500 mt-2">batches</div>
                        </div>
                    </Card>
                    <Card className="flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                            <span className="text-neutral-500 capitalize">
                                Category
                            </span>
                            <div className="w-7 h-7 bg-amber-50 rounded-[10px] flex items-center justify-center">
                                <Tag className="w-4 h-4 text-amber-600" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-3xl text-maintext tracking-tight">{tripDetails.category}</div>
                            <div className=" text-neutral-500 mt-2">type</div>
                        </div>
                    </Card>
                </div>
            </div>
            <div className="pt-6">
                <div className="grid grid-cols-[1fr_349px] gap-6">
                    <div className="flex flex-col gap-6">
                        <Card className="flex flex-col gap-5">
                            <div className="flex justify-between items-center">
                                <h2 className="text-base text-maintext">Trip Batches</h2>
                                <Button className="flex items-center gap-2" onClick={handleAddBatch}>
                                    <Plus className="w-4 h-4 text-white" />
                                    <span className="text-sm text-white">Add Batch</span>
                                </Button>
                            </div>
                            <div className="flex flex-col gap-4">
                                {tripBatches.map((batch) => {
                                    let statusColor = 'gray';
                                    if (batch.status.toLowerCase() === 'available') statusColor = 'green';
                                    else if (batch.status.toLowerCase() === 'filling-fast') statusColor = 'amber';
                                    else if (batch.status.toLowerCase() === 'sold-out') statusColor = 'red';
                                    else if (batch.status.toLowerCase() === 'cancelled') statusColor = 'gray';
                                    return (
                                        <div key={batch._id} onClick={() => handleBatchClick(batch._id)} className="px-5 pt-5 bg-neutral-50/50 rounded-2xl border border-neutral-200/50 flex flex-col gap-3">
                                            <div className="flex justify-between items-start">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-base text-maintext">
                                                            {formatDate(batch.startDate)}
                                                        </h3>
                                                        <span className={`px-3 py-1 bg-${statusColor}-50 rounded-[10px] text-sm text-${statusColor}-700`}>
                                                            {batch.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-neutral-500">{batch.duration}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="text"
                                                        className="w-8 h-8 bg-white rounded-[10px] flex items-center justify-center hover:bg-gray-50"

                                                    >
                                                        <Edit className="w-4 h-4 text-neutral-600" />
                                                    </Button>
                                                    <Button
                                                        variant="text"
                                                        className="w-8 h-8 rounded-[10px] flex items-center justify-center hover:bg-gray-50"

                                                    >
                                                        <MoreVertical className="w-4 h-4 text-neutral-400" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className='text-subtext font-light text-sm -mt-2'>
                                                {formatDateRangeWithDuration(batch.startDate, batch.endDate)} ·
                                            </div>
                                            <div className="grid grid-cols-4 gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm text-neutral-500">Seats</span>
                                                    <span className="text-sm text-maintext">{batch.totalSeats}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm text-neutral-500">Revenue</span>
                                                    <span className="text-sm text-maintext">{batch.totalBookings}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm text-neutral-500">Occupancy</span>
                                                    <span className="text-sm text-maintext">{Math.round((batch.totalBookings / batch.totalSeats) * 100)}%</span>
                                                </div>
                                            </div>
                                            <div className="h-2 mb-4 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-2 bg-primary rounded-full" style={{ width: `${Math.round((batch.totalBookings / batch.totalSeats) * 100)}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                        <Card className="flex flex-col gap-5">
                            <h2 className="text-base text-maintext">Day-by-Day Itinerary</h2>
                            <div className="flex flex-col gap-4">
                                {tripDetails.itinerary.map((item, index) => (
                                    <div
                                        key={index}
                                        className="px-5 pt-5 pb-1 bg-neutral-50/50 rounded-2xl border border-neutral-200/50 flex flex-col gap-2"
                                    >
                                        <h3 className="text-base text-maintext">{item.day}</h3>
                                        <p className="text-sm text-neutral-700 leading-6 pb-4">
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                        <Card className="flex flex-col gap-4">
                            <h2 className="text-base text-maintext">Trip Description</h2>
                            <p className="text-sm text-neutral-700 leading-6">
                                {tripDetails?.description}
                            </p>
                        </Card>
                        <Card className="flex flex-col gap-5">
                            <div className="flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-neutral-400" />
                                <h2 className="text-base text-maintext">Frequently Asked Questions</h2>
                            </div>
                            <div className="flex flex-col gap-4">
                                {tripDetails.faqs.map((faq, index) => (
                                    <div key={index} className="px-4 py-3 bg-neutral-50/50 rounded-2xl border border-neutral-200/50 flex flex-col gap-2">
                                        <h3 className="text-sm text-maintext">{faq.question}</h3>
                                        <p className="text-sm text-neutral-600 leading-6">
                                            {faq.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                    <div className="flex flex-col gap-6">
                        <Card className="flex flex-col gap-4">
                            <h2 className="text-base text-maintext">Tags</h2>
                            <div className="flex flex-wrap gap-2">
                                {tripDetails.tags.map((tag, index) => (
                                    <span key={index} className="px-3 py-2 bg-primary-bg rounded-[10px] text-sm text-primary">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </Card>
                        <Card className="flex flex-col gap-4">
                            <h2 className="text-base text-maintext">Quick Actions</h2>
                            <div className="flex flex-col gap-2">
                                {QUICK_ACTIONS.map((action, index) => {
                                    const ActionIcon = getActionIcon(action.icon);
                                    return (
                                        <Button key={index} variant="text" className="h-10 px-4 rounded-2xl flex items-center gap-2 hover:bg-gray-50 text-left justify-start">
                                            <ActionIcon className="w-4 h-4 text-neutral-600" />
                                            <span className="text-sm text-neutral-600">{action.label}</span>
                                        </Button>
                                    );
                                })}
                            </div>
                        </Card>
                        <Card className="flex flex-col gap-5">
                            <div className="flex flex-col gap-3">
                                <h3 className="text-sm text-maintext">Inclusions</h3>
                                <div className="flex flex-col gap-2">
                                    {tripDetails.inclusions.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 16 16">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.33} d="M13.333 4L6 11.333 2.667 8" />
                                            </svg>
                                            <span className="text-sm text-neutral-700">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex flex-col gap-3">
                                <h3 className="text-sm text-maintext">Exclusions</h3>
                                <div className="flex flex-col gap-2">
                                    {tripDetails.exclusions.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 16 16">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.33} d="M12 4L4 12M4 4l8 8" />
                                            </svg>
                                            <span className="text-sm text-neutral-700">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripDetailsPage;