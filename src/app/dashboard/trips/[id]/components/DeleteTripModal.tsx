import React from 'react'
import Modal from '@/common/components/composites/Modal'
import { Trash2 } from 'lucide-react'

interface DeleteTripModalProps {
    open: boolean
    onClose: () => void
    tripName: string
    onConfirm: () => void
    isPending: boolean
}

const DeleteTripModal: React.FC<DeleteTripModalProps> = ({
    open,
    onClose,
    tripName,
    onConfirm,
    isPending,
}) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Delete Trip"
            submitText={isPending ? 'Deleting...' : 'Delete Trip'}
            cancelText="Cancel"
            onSubmit={onConfirm}
            disabled={isPending}
        >
            <div className="flex flex-col items-center text-center gap-4 py-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50">
                    <Trash2 size={28} className="text-red-500" />
                </div>
                <p className="text-sm text-maintext">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold">&quot;{tripName}&quot;</span>?
                </p>
                <ul className="text-xs text-subtext text-left list-disc list-inside space-y-1">
                    <li>The trip will be hidden from all public listings.</li>
                    <li>This action cannot be undone.</li>
                </ul>
                <p className="text-xs text-red-400">
                    Trips with active bookings cannot be deleted. Cancel those batches first.
                </p>
            </div>
        </Modal>
    )
}

export default DeleteTripModal
