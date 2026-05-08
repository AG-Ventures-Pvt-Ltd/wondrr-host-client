import React from 'react';
import Card from '@/common/components/composites/Card';
import MyImage from '@/common/components/atoms/Image';
import { Star, Users, Zap, Backpack, ShieldAlert } from 'lucide-react';

interface TripSidebarProps {
    tags: string[];
    inclusions: string[];
    exclusions: string[];
    thingsToCarry?: string[];
    highlights?: Array<{
        title: string;
        image?: string;
    }>;
    pricing?: {
        currency: string;
        pricings: Array<{
            label: string;
            description?: string;
            pricePerPerson: number;
        }>;
        addOns: Array<{
            label: string;
            description?: string;
            category?: string;
            pricePerPerson: number;
        }>;
    };
    cancellationPolicy?: {
        refundTiers: Array<{
            daysBeforeCancellation: number;
            refundPercentage: number;
        }>;
    };
    isFemaleOnly?: boolean;
    difficulty?: string;
    rating?: number;
    totalReviews?: number;
}

const TripSidebar: React.FC<TripSidebarProps> = ({
    tags,
    inclusions,
    exclusions,
    thingsToCarry = [],
    highlights = [],
    pricing,
    cancellationPolicy,
    isFemaleOnly,
    difficulty,
    rating,
    totalReviews,
}) => {

    return (
        <div className="flex flex-col gap-6">
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
                    {pricing?.pricings && pricing.pricings.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-neutral-900 mb-2">Base Pricing</h4>
                            <div className="space-y-2">
                                {pricing.pricings.map((pricingOption, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-neutral-600">{pricingOption.label}</span>
                                            {pricingOption.description && (
                                                <span className="text-xs text-neutral-500">{pricingOption.description}</span>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-neutral-900">
                                            ₹{pricingOption.pricePerPerson.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {pricing?.addOns && pricing.addOns.length > 0 && (
                        <div className="border-t pt-3">
                            <h4 className="text-sm font-medium text-neutral-900 mb-2">Add-ons</h4>
                            <div className="space-y-2">
                                {pricing.addOns.map((addOn, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-neutral-600">{addOn.label}</span>
                                            {addOn.description && (
                                                <span className="text-xs text-neutral-500">{addOn.description}</span>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-neutral-900">
                                            ₹{addOn.pricePerPerson.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {!pricing?.pricings?.length && !pricing?.addOns?.length && (
                        <div className="text-sm text-neutral-500">No pricing information available</div>
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

            {thingsToCarry.length > 0 && (
                <Card className="flex flex-col gap-3">
                    <h3 className="text-sm text-maintext">Things to Carry</h3>
                    <div className="flex flex-col gap-2">
                        {thingsToCarry.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Backpack className="w-4 h-4 text-blue-500 shrink-0" />
                                <span className="text-sm text-neutral-700">{item}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {highlights && highlights.length > 0 && (
                <Card className="flex flex-col gap-3">
                    <h3 className="text-sm text-maintext">Highlights</h3>
                    <div className="flex flex-col gap-2">
                        {highlights.map((item, index) => (
                            <div key={index} className="flex items-start gap-2">
                                {item?.image ? (
                                    <MyImage
                                        src={item?.image}
                                        alt={item?.title}
                                        width={64}
                                        height={64}
                                        className="w-24 h-14 rounded object-cover shrink-0 mt-0.5"
                                    />
                                ) : (
                                    <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                )}
                                <span className="text-sm text-neutral-700">{item?.title}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {(rating !== undefined || difficulty || isFemaleOnly !== undefined) && (
                <Card className="flex flex-col gap-3">
                    <h3 className="text-sm text-maintext">Trip Info</h3>
                    <div className="flex flex-col gap-2">
                        {rating !== undefined && (
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5 text-sm text-neutral-600">
                                    <Star className="w-4 h-4 text-amber-500" />
                                    <span>Rating</span>
                                </div>
                                <span className="text-sm font-medium text-neutral-900">
                                    {rating.toFixed(1)}{totalReviews !== undefined && <span className="text-neutral-400 font-normal"> ({totalReviews} reviews)</span>}
                                </span>
                            </div>
                        )}
                        {difficulty && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-neutral-600">Difficulty</span>
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-lg capitalize ${
                                    difficulty === 'easy' ? 'bg-green-50 text-green-700' :
                                    difficulty === 'moderate' ? 'bg-amber-50 text-amber-700' :
                                    difficulty === 'hard' ? 'bg-orange-50 text-orange-700' :
                                    'bg-red-50 text-red-700'
                                }`}>
                                    {difficulty}
                                </span>
                            </div>
                        )}
                        {isFemaleOnly && (
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5 text-sm text-neutral-600">
                                    <Users className="w-4 h-4 text-pink-500" />
                                    <span>Female Only</span>
                                </div>
                                <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-pink-50 text-pink-700">Yes</span>
                            </div>
                        )}
                    </div>
                </Card>
            )}

            {cancellationPolicy && cancellationPolicy.refundTiers && cancellationPolicy.refundTiers.length > 0 && (
                <Card className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-orange-500" />
                        <h3 className="text-sm text-maintext">Cancellation Policy</h3>
                    </div>
                    <div className="flex flex-col gap-2">
                        {cancellationPolicy.refundTiers.map((tier, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                                <span className="text-neutral-600">
                                    {tier.daysBeforeCancellation === 0
                                        ? 'On day of trip'
                                        : `${tier.daysBeforeCancellation} day${tier.daysBeforeCancellation !== 1 ? 's' : ''} before`}
                                </span>
                                <span className={`font-medium ${tier.refundPercentage === 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {tier.refundPercentage}% refund
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default TripSidebar;
