import React from 'react';
import Card from '@/common/components/composites/Card';

interface TripDescriptionProps {
    description: string;
}

const TripDescription: React.FC<TripDescriptionProps> = ({ description }) => {
    return (
        <Card className="flex flex-col gap-4">
            <h2 className="text-base text-maintext">Trip Description</h2>
            <p className="text-sm text-neutral-700 leading-6">
                {description}
            </p>
        </Card>
    );
};

export default TripDescription;
