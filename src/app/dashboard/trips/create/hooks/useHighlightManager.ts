import { useState } from 'react'
import { useTripFormStore } from '../store'
import useS3Upload from '@/common/hooks/useS3Upload'

const stripBulletPrefix = (text: string): string =>
  text.trim().replace(/^[-*•·●▪▸>]\s+/, '').replace(/^\d+[.):]\s+/, '')

export const useHighlightManager = () => {
  const [highlightInput, setHighlightInput] = useState('')
  const [highlightImageFile, setHighlightImageFile] = useState<File | null>(null)
  const [highlightImagePreview, setHighlightImagePreview] = useState<string>('')
  const { highlights, addHighlight, removeHighlight } = useTripFormStore()
  const { uploadImages, isUploading } = useS3Upload()

  const handleImageSelect = (file: File) => {
    setHighlightImageFile(file)
    setHighlightImagePreview(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    if (highlightImagePreview) {
      URL.revokeObjectURL(highlightImagePreview)
    }
    setHighlightImageFile(null)
    setHighlightImagePreview('')
  }

  const handleAddHighlight = async () => {
    if (!highlightInput.trim()) return

    let imageUrl = ''

    if (highlightImageFile) {
      try {
        const uploadedUrls = await uploadImages([{ file: highlightImageFile }])
        imageUrl = uploadedUrls[0]?.url || ''
      } catch (error) {
        console.error('Failed to upload highlight image:', error)
        // Continue without image if upload fails
      }
    }

    addHighlight(highlightInput.trim(), imageUrl || undefined)
    setHighlightInput('')
    handleRemoveImage()
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddHighlight()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text')
    const lines = pasted.split('\n').map(stripBulletPrefix).filter(Boolean)
    if (lines.length > 1) {
      e.preventDefault()
      lines.forEach((line) => addHighlight(line))
    }
  }

  return {
    highlightInput,
    setHighlightInput,
    highlightImageFile,
    highlightImagePreview,
    handleImageSelect,
    handleRemoveImage,
    highlights,
    handleAddHighlight,
    handleRemoveHighlight: removeHighlight,
    handleKeyPress,
    handlePaste,
    isUploading,
  }
}
