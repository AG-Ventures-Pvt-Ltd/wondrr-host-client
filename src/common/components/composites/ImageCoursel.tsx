'use client'

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/common/components/atoms/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


export default function ThreeImageCarousel(
    { images, title, description }: { 
        images: {   src?: string, 
                    alt?: string, 
                    title?: string, 
                    location?: string, 
                    price?: string,
                    card? : React.ReactNode,
                    route?: string
                }[], 
        title?: string, 
        description?: string
    }) 
    {
    const [currentIndex, setCurrentIndex] = useState(0);

    const itemsPerView = 3;
    const maxIndex = Math.max(0, images.length - itemsPerView);

    const goToPrevious = () => {
        setCurrentIndex(Math.max(0, currentIndex - 1));
    };

    const goToNext = () => {
        setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
    };

    const router = useRouter()

    return (
        <div className="mx-4 bg-white rounded-lg p-6">
            <div className=' flex justify-center flex-col items-center mb-10'>
                <h2 className="text-4xl font-bold text-gray-900 mb-6 w-[50%] text-center">
                    {title}
                </h2>
                <h2 className='text-lg w-[34%] text-center'>
                    {description}
                </h2>
            </div>
            <div className="relative">
                {images.length > 3 && <Button
                    onClick={goToPrevious}
                    disabled={currentIndex === 0}
                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 rounded-full p-3 shadow-lg transition-all duration-200 cursor-pointer ${currentIndex === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white hover:bg-gray-50 text-gray-800 hover:shadow-xl'
                        }`}
                    aria-label="Previous products"
                >
                    <ChevronLeft className="w-6 h-6" />
                </Button>
                }
                {images.length > 3 && <Button
                    onClick={goToNext}
                    disabled={currentIndex === maxIndex}
                    className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 rounded-full p-3 shadow-lg transition-all duration-200 cursor-pointer ${currentIndex === maxIndex
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white hover:bg-gray-50 text-gray-800 hover:shadow-xl'
                        }`}
                    aria-label="Next products"
                >
                    <ChevronRight className="w-6 h-6" />
                </Button>
                }

                <div className="overflow-hidden ">
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                    >
                        {images.map((item, index) => (
                            <div key={index} className="w-1/3 flex-shrink-0 px-2 relative hover:scale-105 transition-transform  duration-300 my-4" onClick={() => item?.route ? router.push(item?.route) : {}}>
                                {item?.src && <div className="bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer group ">
                                    <div className=" overflow-hidden rounded-2xl">
                                        <Image
                                            height={0}
                                            width={0}
                                            unoptimized
                                            src={item.src}
                                            alt={item.alt || 'Some Wondrr Image'}
                                            className="w-full h-full object-cover  rounded-2xl"
                                        />
                                    </div>
                                </div>}
                                {item.title && item.src && (
                                    <div className='absolute bottom-4 left-1/2 -translate-x-1/2 rounded-2xl p-4 bg-white w-[90%] max-w-full cursor-pointer'>
                                        <div className='text-lg'>{item?.title}</div>
                                        <div className='text-sm'>{item?.location}</div>
                                        <div className='text-xl mt-3'>Rs. {item?.price}/person</div>
                                    </div>
                                )}
                                {
                                    item.card && (
                                        <div className='bg-white rounded-2xl border border-[#E5E5E5] p-6 cursor-pointer'>
                                            <div>{item?.card}</div>
                                        </div>
                                    )   
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Progress indicator */}
            {/* <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: maxIndex + 1 }, (_, index) => (
          <Button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex
                ? 'bg-blue-600'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div> */}


        </div>
    );
}