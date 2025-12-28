import React from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/common/components/composites/Card';
import Button from '@/common/components/atoms/Button';
import { Plus, Edit } from 'lucide-react';
import { formatDateRangeWithDuration, formatDate } from '@/common/utils/dateUtils';

interface Batch {
    _id: string;
    startDate: string;
    endDate: string;
    status: string;
    duration: string;
    totalSeats: number;
    totalBookings: number;
}

interface TripBatchesProps {
    batches: Batch[];
    tripId: string;
}

const TripBatches: React.FC<TripBatchesProps> = ({ batches, tripId }) => {
    const router = useRouter();

    const handleAddBatch = () => {
        router.push(`/dashboard/trips/${tripId}/batch/create`);
    };

    const handleBatchClick = (batchId: string) => {
        router.push(`/dashboard/trips/${tripId}/batch/${batchId}`);
    };

    const handleEditBatch = (e: React.MouseEvent, batchId: string) => {
        e.stopPropagation();
        router.push(`/dashboard/trips/${tripId}/batch/${batchId}/edit`);
    };

    return (
        <Card className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
                <h2 className="text-base text-maintext">Trip Batches</h2>
                <Button className="flex items-center gap-2" onClick={handleAddBatch}>
                    <Plus className="w-4 h-4 text-white" />
                    <span className="text-sm text-white">Add Batch</span>
                </Button>
            </div>
            <div className="flex flex-col gap-4">
                {batches.map((batch) => {
                    let statusColor = 'gray';
                    if (batch.status.toLowerCase() === 'available') statusColor = 'green';
                    else if (batch.status.toLowerCase() === 'filling-fast') statusColor = 'amber';
                    else if (batch.status.toLowerCase() === 'sold-out') statusColor = 'red';
                    else if (batch.status.toLowerCase() === 'cancelled') statusColor = 'gray';
                    
                    return (
                        <div 
                            key={batch._id} 
                            onClick={() => handleBatchClick(batch._id)} 
                            className="px-5 pt-5 bg-neutral-50/50 rounded-2xl border border-neutral-200/50 flex flex-col gap-3 cursor-pointer"
                        >
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
                                        onClick={(e) => handleEditBatch(e, batch._id)}
                                    >
                                        <Edit className="w-4 h-4 text-neutral-600" />
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
                                    <span className="text-sm text-maintext">
                                        {Math.round((batch.totalBookings / batch.totalSeats) * 100)}%
                                    </span>
                                </div>
                            </div>
                            <div className="h-2 mb-4 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-2 bg-primary rounded-full" 
                                    style={{ width: `${Math.round((batch.totalBookings / batch.totalSeats) * 100)}%` }} 
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default TripBatches;
