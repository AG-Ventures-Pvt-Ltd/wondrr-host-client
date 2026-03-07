import { Funnel } from 'lucide-react';
import Button from '@/common/components/atoms/Button';
import { BATCH_STATUS } from '../../../constants/batchStatus';

export type FilterType = 'all' | 'active' | 'draft' | 'expired' | 'cancelled';

export const BATCH_FILTERS: { label: string; value: FilterType; status: string | undefined }[] = [
    { label: 'All Batches', value: 'all', status: undefined },
    { label: 'Active', value: 'active', status: BATCH_STATUS.AVAILABLE },
    { label: 'Draft', value: 'draft', status: BATCH_STATUS.DRAFT },
    { label: 'Expired', value: 'expired', status: BATCH_STATUS.CLOSED },
    { label: 'Cancelled', value: 'cancelled', status: BATCH_STATUS.CANCELLED },
];

interface BatchFiltersProps {
    activeFilter: FilterType;
    onChange: (filter: FilterType) => void;
}

const BatchFilters = ({ activeFilter, onChange }: BatchFiltersProps) => {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 text-subtext text-sm">
                <Funnel size={16} />
                <span>Filter by:</span>
            </div>
            {BATCH_FILTERS.map(({ label, value }) => (
                <Button
                    key={value}
                    variant={activeFilter === value ? 'contained' : 'text'}
                    className={`px-4 py-2 rounded-xl text-sm ${
                        activeFilter === value ? 'bg-primary text-white' : 'bg-gray-100 text-subtext'
                    }`}
                    onClick={() => onChange(value)}
                >
                    {label}
                </Button>
            ))}
        </div>
    );
};

export default BatchFilters;
