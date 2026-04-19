import React, { useState } from 'react';
import { MapPin, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/common/components/atoms/Button';
import MyImage from '@/common/components/atoms/Image'

interface TripHeroProps {
    images: string[];
    title: string;
    location: string;
    onEdit: () => void;
}

const TripHero: React.FC<TripHeroProps> = ({ images, title, location, onEdit }) => {
    const [current, setCurrent] = useState(0);
    const total = images.length;

    const prev = () => setCurrent((c) => (c - 1 + total) % total);
    const next = () => setCurrent((c) => (c + 1) % total);

    return (
        <div className="relative h-72 rounded-2xl overflow-hidden">
            <MyImage
                className="w-full h-full object-cover transition-all duration-300"
                src={images[current] || ''}
                alt={`${title} - image ${current + 1}`}
                width={1093}
                height={286}
            />
            <div className="absolute inset-0 bg-linear-to-l from-black/70 via-black/30 to-black/0" />

            {total > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white w-3' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                </>
            )}

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
