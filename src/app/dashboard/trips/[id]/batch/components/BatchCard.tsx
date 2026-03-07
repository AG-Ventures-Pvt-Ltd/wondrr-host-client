import { useRouter } from 'next/navigation';
import { Calendar, Star, Users } from 'lucide-react';
import Card from '@/common/components/composites/Card';
import { formatDate, formatDateRangeWithDuration } from '@/common/utils/dateUtils';
import { BATCH_STATUS } from '../../../constants/batchStatus';
import { TripBatchDetails } from '../../../types';

interface BatchCardProps {
    batch: TripBatchDetails;
    tripId: string;
}

const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === BATCH_STATUS.AVAILABLE) return 'green';
    if (s === BATCH_STATUS.FILLING_FAST) return 'amber';
    if (s === BATCH_STATUS.SOLD_OUT) return 'red';
    if (s === BATCH_STATUS.CLOSED || s === BATCH_STATUS.CANCELLED || s === BATCH_STATUS.DRAFT) return 'gray';
    return 'gray';
};

const STATUS_BG: Record<string, string> = {
    green: 'bg-green-50',
    amber: 'bg-amber-50',
    red: 'bg-red-50',
    gray: 'bg-gray-200',
};

const STATUS_TEXT: Record<string, string> = {
    green: 'text-green-700',
    amber: 'text-amber-700',
    red: 'text-red-700',
    gray: 'text-gray-600',
};

const BatchCard = ({ batch, tripId }: BatchCardProps) => {
    const router = useRouter();
    const occupancyPercent = Math.round((batch.totalBookings / batch.totalSeats) * 100);
    const color = getStatusColor(batch.status);

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
                    <span className={`px-3 py-1 rounded-xl text-xs ${STATUS_BG[color]} ${STATUS_TEXT[color]}`}>
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
};

export default BatchCard;
