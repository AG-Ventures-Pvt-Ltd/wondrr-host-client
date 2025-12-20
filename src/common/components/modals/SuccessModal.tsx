import React from 'react'
import Modal from '@/common/components/composites/Modal'
import { CheckCircle } from 'lucide-react'

interface SuccessModalProps {
    open: boolean
    onClose: () => void
    title: string
    description: string
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open, onClose, title, description }) => {
    return (
        <Modal 
            open={open}
            onClose={onClose}
            title=""
            description=""
            submitText="Close"
            onSubmit={onClose}
        >
            <div className="flex flex-col items-center justify-center text-center py-8">
                <CheckCircle size={64} className="text-green-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">{title}</h2>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </Modal>
    )
}

export default SuccessModal