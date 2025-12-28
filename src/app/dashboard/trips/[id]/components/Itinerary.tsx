import React from 'react';
import Card from '@/common/components/composites/Card';

interface ItineraryItem {
    day: string;
    description: string;
}

interface ItineraryProps {
    items: ItineraryItem[];
}

const Itinerary: React.FC<ItineraryProps> = ({ items }) => {
    return (
        <Card className="flex flex-col gap-5">
            <h2 className="text-base text-maintext">Day-by-Day Itinerary</h2>
            <div className="flex flex-col gap-4">
                {items.map((item, index) => (
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
    );
};

export default Itinerary;
