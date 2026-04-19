import { useQueryClient } from '@tanstack/react-query'
import usePostData from '@/common/services/usePostData'
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints'
import { DuplicateBatchPayload } from '../[id]/batch/components/DuplicateBatchModal/types'

interface UseDuplicateBatchProps {
  tripSlug: string
  onSuccess?: (count: number) => void
}

export const useDuplicateBatch = ({ tripSlug, onSuccess }: UseDuplicateBatchProps) => {
  const queryClient = useQueryClient()

  const { mutate, isPending } = usePostData({
    url: API_ENDPOINTS.TRIPS.DUPLICATE_BATCH,
    onSuccess: (data) => {
      const count = (data as { data?: { count?: number } })?.data?.count ?? 0
      queryClient.invalidateQueries({ queryKey: ['tripBatches', tripSlug] })
      onSuccess?.(count)
    },
  })

  const duplicateBatch = (payload: DuplicateBatchPayload) => {
    mutate(payload as unknown as Record<string, unknown>)
  }

  return { duplicateBatch, isPending }
}
