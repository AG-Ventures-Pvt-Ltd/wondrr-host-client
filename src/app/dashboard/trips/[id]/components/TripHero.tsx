import React from 'react';
import Image from 'next/image';
import { MapPin, Edit } from 'lucide-react';
import Button from '@/common/components/atoms/Button';

interface TripHeroProps {
    image: string;
    title: string;
    location: string;
    onEdit: () => void;
}

const TripHero: React.FC<TripHeroProps> = ({ image, title, location, onEdit }) => {
    return (
        <div className="relative h-72 rounded-2xl overflow-hidden">
            <Image
                className="w-full h-full object-cover"
                src={`${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${image}`}
                alt={title}
                width={1093}
                height={286}
            />
            <div className="absolute inset-0 bg-linear-to-l from-black/70 via-black/30 to-black/0" />
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-normal text-white tracking-tight">
                        {title}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-white/90">
                        <MapPin size={16} />
                        <span>{location}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="text" 
                        className="h-10 px-4 bg-white! rounded-2xl shadow-md flex items-center gap-2 hover:bg-gray-50" 
                        onClick={onEdit}
                    >
                        <Edit className="w-4 h-4 text-maintext" />
                        <span className="text-sm text-maintext">Edit Trip</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TripHero;
