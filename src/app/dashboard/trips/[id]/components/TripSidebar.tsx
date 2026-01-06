'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/common/components/composites/Card';
import Button from '@/common/components/atoms/Button';
import { Eye, BarChart3, Share2 } from 'lucide-react';

interface TripSidebarProps {
    tags: string[];
    inclusions: string[];
    exclusions: string[];
    tripSlug: string;
    tripId: string;
    onShareClick: () => void;
    basePrice?: number;
    price?: number;
    sharingPrice?: Array<{
        people: number;
        additionalPricePerPerson: number;
    }>;
}

const TripSidebar: React.FC<TripSidebarProps> = ({ 
    tags, 
    inclusions, 
    exclusions, 
    tripSlug,
    tripId,
    onShareClick,
    basePrice,
    price,
    sharingPrice = []
}) => {
    const router = useRouter();

    return (
        <div className="flex flex-col gap-6">
            <Card className="flex flex-col gap-4">
                <h2 className="text-base text-maintext">Quick Actions</h2>
                <div className="flex flex-col gap-2">
                    <Button 
                        variant="text" 
                        className="h-10 px-4 rounded-2xl flex items-center gap-2 hover:bg-gray-50 text-left justify-start"
                        onClick={() => {
                            const tripLink = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/trip/${tripSlug}`;
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
                        onClick={onShareClick}
                    >
                        <Share2 className="w-4 h-4 text-neutral-600" />
                        <span className="text-sm text-neutral-600">Share Trip</span>
                    </Button>
                </div>
            </Card>
            <Card className="flex flex-col gap-4">
                <h2 className="text-base text-maintext">Tags</h2>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <span 
                            key={index} 
                            className="px-3 py-2 bg-primary-bg rounded-[10px] text-sm text-primary"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </Card>
            <Card className="flex flex-col gap-4">
                <h2 className="text-base text-maintext">Pricing Details</h2>
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600">Base Price</span>
                        <span className="text-sm font-medium text-neutral-900">
                            ₹{basePrice?.toLocaleString() || 'N/A'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-neutral-600">Price per Person</span>
                        <span className="text-sm font-medium text-neutral-900">
                            ₹{price?.toLocaleString() || 'N/A'}
                        </span>
                    </div>
                    {sharingPrice && sharingPrice.length > 0 && (
                        <div className="border-t pt-3">
                            <h4 className="text-sm font-medium text-neutral-900 mb-2">Hotel Sharing Options</h4>
                            <div className="space-y-2">
                                {sharingPrice.map((option, index) => (
                                    <div key={index} className="flex justify-between items-center text-xs">
                                        <span className="text-neutral-600">
                                            {option.people} person{option.people !== 1 ? 's' : ''} per room
                                        </span>
                                        <span className="font-medium text-neutral-900">
                                            +₹{option.additionalPricePerPerson.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Card>
            <Card className="flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                    <h3 className="text-sm text-maintext">Inclusions</h3>
                    <div className="flex flex-col gap-2">
                        {inclusions.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <svg 
                                    className="w-4 h-4 text-green-600 shrink-0" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 16 16"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={1.33} 
                                        d="M13.333 4L6 11.333 2.667 8" 
                                    />
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
                        {exclusions.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <svg 
                                    className="w-4 h-4 text-red-600 shrink-0" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 16 16"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={1.33} 
                                        d="M12 4L4 12M4 4l8 8" 
                                    />
                                </svg>
                                <span className="text-sm text-neutral-700">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default TripSidebar;
