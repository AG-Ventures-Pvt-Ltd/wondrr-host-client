import { useRouter } from 'next/navigation';
import { Calendar, Copy, Star, Trash2, Users } from 'lucide-react';
import Card from '@/common/components/composites/Card';
import { formatDate, formatDateRangeWithDuration } from '@/common/utils/dateUtils';
import { BATCH_STATUS } from '../../../constants/batchStatus';
import { TripBatchDetails } from '../../../types';

interface BatchCardProps {
    batch: TripBatchDetails;
    tripId: string;
    onDuplicate?: (batchId: string, durationDays: number) => void;
    onDelete?: (batchId: string) => void;
    isSelected?: boolean;
    onToggleSelect?: (batchId: string) => void;
    selectionMode?: boolean;
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

const BatchCard = ({ batch, tripId, onDuplicate, onDelete, isSelected, onToggleSelect, selectionMode }: BatchCardProps) => {
    const router = useRouter();
    const color = getStatusColor(batch.status);
    // A batch is deletable only if it has no bookings
    const isDeletable = batch.totalBookings === 0;

    const handleDuplicateClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Compute IST calendar day gap client-side (avoids relying on server's raw-ms durationDays)
        const istDay = (d: string) => new Date(d).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }).split('-').map(Number) as [number, number, number];
        const [sy, sm, sd] = istDay(batch.startDate);
        const [ey, em, ed] = istDay(batch.endDate);
        const durationDays = Math.round((new Date(ey, em - 1, ed).getTime() - new Date(sy, sm - 1, sd).getTime()) / 86400000);
        onDuplicate?.(batch._id, durationDays);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete?.(batch._id);
    };

    const handleCardClick = () => {
        if (selectionMode && isDeletable) {
            onToggleSelect?.(batch._id);
        } else if (!selectionMode) {
            router.push(`/dashboard/trips/${tripId}/batch/${batch._id}`);
        }
    };

    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleSelect?.(batch._id);
    };

    return (
        <Card
            key={batch._id}
            className={`cursor-pointer hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-primary' : ''}`}
            onClick={handleCardClick}
        >
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2">
                        {isDeletable && (
                            <div onClick={handleCheckboxClick} className="mt-0.5">
                                <input
                                    type="checkbox"
                                    checked={!!isSelected}
                                    onChange={() => onToggleSelect?.(batch._id)}
                                    className="w-4 h-4 accent-primary cursor-pointer"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        )}
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
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-xl text-xs ${STATUS_BG[color]} ${STATUS_TEXT[color]}`}>
                            {batch.status}
                        </span>
                        <button
                            title="Duplicate batch"
                            onClick={handleDuplicateClick}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-subtext hover:text-primary transition-colors"
                        >
                            <Copy size={14} />
                        </button>
                        {isDeletable && (
                            <button
                                title="Delete batch"
                                onClick={handleDeleteClick}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-subtext hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
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
                        <span className="text-sm text-maintext">{batch.occupancyPercent}%</span>
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
                        style={{ width: `${batch.occupancyPercent}%` }}
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
