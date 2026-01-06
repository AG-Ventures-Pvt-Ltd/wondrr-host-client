import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Modal from '@/common/components/composites/Modal'
import { useTripFormStore } from '../store'

interface ConfirmDiscardModalProps {
  open: boolean
  onClose: () => void
}

const ConfirmDiscardModal: React.FC<ConfirmDiscardModalProps> = ({
  open,
  onClose,
}) => {
  const router = useRouter()
  const { resetForm } = useTripFormStore()

  const handleConfirm = () => {
    resetForm()
    router.push('/dashboard/trips')
  }

  return (
    <Modal
      open={open}
      onSubmit={onClose}
      title="Discard Changes?"
      onClose={handleConfirm}
      description="You have unsaved changes that will be lost if you leave this page."
      cancelText={'Discard Changes'}
      submitText={'Keep Editing'}
    >
      <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        <p className="text-sm text-amber-800">
          Your trip data will be lost if you cancel or go back without saving.
        </p>
      </div>
    </Modal>
  )
}

export default ConfirmDiscardModal