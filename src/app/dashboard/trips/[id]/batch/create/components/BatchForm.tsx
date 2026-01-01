'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import BatchBasicInfoStep from '../steps/BatchBasicInfoStep'
import Button from '@/common/components/atoms/Button'
import BackButton from '@/common/ui/BackButton'
import { useBatchFormStore } from '../store'
import { useFormSubmission } from '../hooks'
import { notify } from '@/common/utils/notify'

interface BatchFormProps {
  onCancel?: () => void
  onSuccess?: () => void
  isEditMode?: boolean
  batchId?: string
  tripId?: string
}

const BatchForm: React.FC<BatchFormProps> = ({ onCancel, isEditMode = false, batchId, tripId: propTripId }) => {
  const router = useRouter()
  const params = useParams()
  const tripId = propTripId || (params?.id as string)

  const { validationErrors } = useBatchFormStore()

  const { handleSubmit, isSubmitting } = useFormSubmission({
    tripId : tripId,
    isEditMode,
    batchId,
    onSuccess: () => {

      if (isEditMode && batchId) {
        router.push(`/dashboard/trips/${tripId}/batch/${batchId}`)
      } else {
        router.push(`/dashboard/trips/${tripId}`)
      }
      notify.success(isEditMode ? 'Batch updated successfully' : 'Batch added successfully')
    },
  })

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      if (isEditMode && batchId) {
        router.push(`/dashboard/trips/${tripId}/batch/${batchId}`)
      } else {
        router.push(`/dashboard/trips/${tripId}`)
      }
    }
  }

  const handleBack = () => {
    if (isEditMode && batchId) {
      router.push(`/dashboard/trips/${tripId}/batch/${batchId}`)
    } else {
      router.push(`/dashboard/trips/${tripId}`)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-6">
          <BackButton onClick={handleBack} iconSize={32} className='mr-4' label="" />
          <h1 className="text-xl font-normal text-neutral-900">
            {isEditMode ? 'Edit Batch' : 'Create New Batch'}
          </h1>
        </div>

        {validationErrors.length > 0 && (
          <div className="mx-8 mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm text-red-700">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="px-12 pr-12">
          <BatchBasicInfoStep />
        </div>
      </div>
      <div className="py-6 px-4 pr-24">
        <div className="flex w-full justify-end gap-4">
          <Button variant="text" onClick={handleCancel}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <Check className="w-4 h-4 mr-2" />
            {isSubmitting 
              ? (isEditMode ? 'Updating Batch...' : 'Creating Batch...') 
              : (isEditMode ? 'Update Batch' : 'Create Batch')
            }
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BatchForm
