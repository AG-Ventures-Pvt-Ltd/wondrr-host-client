'use client'

import React, { useRef, useState } from 'react'
import { Card } from '@/common/ui/card'
import { Button } from '@/common/ui/button'
import { Badge } from '@/common/ui/badge'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import useS3Upload from '@/common/hooks/useS3Upload'
import { notify } from '@/common/utils/notify'

interface ImagePreview {
  file?: File
  url: string
  name: string
  isUploading?: boolean
}

interface ImageUploaderProps {
  images?: ImagePreview[]
  onImagesChange: (images: ImagePreview[]) => void
  minRequired?: number
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images = [],
  onImagesChange,
  minRequired = 5
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadImages, isUploading, progress, error } = useS3Upload()
  const [previewImages, setPreviewImages] = useState<ImagePreview[]>(images)

  // Update previewImages when images prop changes (for edit mode)
  React.useEffect(() => {
    setPreviewImages(images)
  }, [images])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[]
    
    if (files.length === 0) return

    const tempPreviews: ImagePreview[] = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      isUploading: true,
    }))
    
    setPreviewImages(prev => [...prev, ...tempPreviews])

    try {
      const results = await uploadImages(files)
      
      const uploadedImages = results
        .filter(result => result.success)
        .map(result => ({
          url: result.url,
          name: result.originalFile.name,
          isUploading: false,
        }))

      tempPreviews.forEach(preview => URL.revokeObjectURL(preview.url))
      
      const newImages = [...images, ...uploadedImages]
      setPreviewImages(newImages)
      onImagesChange(newImages)

      const failedUploads = results.filter(result => !result.success)
      if (failedUploads.length > 0) {
        notify.error(`${failedUploads.length} image(s) failed to upload`)
      }
    } catch {
      const revertedPreviews = previewImages.filter(
        img => !tempPreviews.some(temp => temp.name === img.name)
      )
      setPreviewImages(revertedPreviews)
      notify.error('Failed to upload images. Please try again.')
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = previewImages.filter((_, i) => i !== index)
    
    if (previewImages[index].file) {
      URL.revokeObjectURL(previewImages[index].url)
    }
    
    setPreviewImages(newImages)
    onImagesChange(newImages)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files) as File[]
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      notify.error('Please drop valid image files')
      return
    }

    const tempPreviews: ImagePreview[] = imageFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      isUploading: true,
    }))
    
    setPreviewImages(prev => [...prev, ...tempPreviews])

    try {
      const results = await uploadImages(imageFiles)
      
      const uploadedImages = results
        .filter(result => result.success)
        .map(result => ({
          url: result.url,
          name: result.originalFile.name,
          isUploading: false,
        }))

      // Clean up temp previews and add uploaded images
      tempPreviews.forEach(preview => URL.revokeObjectURL(preview.url))
      
      const newImages = [...images, ...uploadedImages]
      setPreviewImages(newImages)
      onImagesChange(newImages)

      // Handle failed uploads
      const failedUploads = results.filter(result => !result.success)
      if (failedUploads.length > 0) {
        notify.error(`${failedUploads.length} image(s) failed to upload`)
      }
    } catch {
      // Revert previews on error
      const revertedPreviews = previewImages.filter(
        img => !tempPreviews.some(temp => temp.name === img.name)
      )
      setPreviewImages(revertedPreviews)
      notify.error('Failed to upload images. Please try again.')
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge variant={previewImages.length >= minRequired ? "default" : "secondary"}>
          {previewImages.length}/{minRequired} required
        </Badge>
        {previewImages.length < minRequired && (
          <span className="text-xs text-muted-foreground">
            Add {minRequired - previewImages.length} more image{minRequired - previewImages.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">
              {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, JPEG up to 10MB each
            </p>
          </div>
          <Button type="button" size="sm" variant="outline" disabled={isUploading}>
            {isUploading ? `Uploading ${Math.round(progress)}%` : 'Select Images'}
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-800">{error}</p>
        </div>
      )}

      {/* Image Previews */}
      {previewImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {previewImages.map((preview, index) => (
            <Card key={index} className="relative group overflow-hidden p-2">
              <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Uploading Overlay */}
                {preview.isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-white text-xs">Uploading...</div>
                  </div>
                )}
              </div>
              
              {/* Cover Badge */}
              {index === 0 && (
                <Badge
                  variant="default"
                  className="absolute top-4 left-4 z-10"
                >
                  Cover Image
                </Badge>
              )}
              
              {/* Remove Button */}
              {!preview.isUploading && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-4 right-4 z-10 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              )}
              
              <p className="text-xs text-muted-foreground mt-2 truncate">
                {preview.name}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Summary */}
      {previewImages.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ImageIcon className="w-4 h-4" />
          <span>{previewImages.length} image{previewImages.length !== 1 ? 's' : ''} uploaded</span>
        </div>
      )}
    </div>
  )
}

export default ImageUploader
