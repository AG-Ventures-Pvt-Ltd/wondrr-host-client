import React from 'react'
import Modal from '@/common/components/composites/Modal'
import { Trash2 } from 'lucide-react'

interface DeleteBatchModalProps {
    open: boolean
    onClose: () => void
    count: number
    onConfirm: () => void
    isPending: boolean
}

const DeleteBatchModal: React.FC<DeleteBatchModalProps> = ({
    open,
    onClose,
    count,
    onConfirm,
    isPending,
}) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Delete Batch(es)"
            submitText={isPending ? 'Deleting...' : 'Delete'}
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
                    <span className="font-semibold">{count} batch{count !== 1 ? 'es' : ''}</span>?
                </p>
                <ul className="text-xs text-subtext text-left list-disc list-inside space-y-1">
                    <li>Draft batches will be permanently removed.</li>
                    <li>Published batches will be hidden from the partner dashboard.</li>
                </ul>
                <p className="text-xs text-red-400">Batches with existing bookings cannot be deleted.</p>
            </div>
        </Modal>
    )
}

export default DeleteBatchModal
