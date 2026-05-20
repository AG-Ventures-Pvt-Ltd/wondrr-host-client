import { useQueryClient } from '@tanstack/react-query'
import usePostData from '@/common/services/usePostData'
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints'

interface UseDeleteBatchesProps {
  tripSlug: string
  onSuccess?: (count: number) => void
}

export const useDeleteBatches = ({ tripSlug, onSuccess }: UseDeleteBatchesProps) => {
  const queryClient = useQueryClient()

  const { mutate, isPending } = usePostData({
    url: API_ENDPOINTS.TRIPS.DELETE_BATCHES,
    onSuccess: (data) => {
      const count = (data as { data?: { count?: number } })?.data?.count ?? 0
      queryClient.invalidateQueries({ queryKey: ['tripBatches', tripSlug] })
      onSuccess?.(count)
    },
  })

  const deleteBatches = (batchIds: string[]) => {
    mutate({ batchIds } as unknown as Record<string, unknown>)
  }

  return { deleteBatches, isPending }
}
