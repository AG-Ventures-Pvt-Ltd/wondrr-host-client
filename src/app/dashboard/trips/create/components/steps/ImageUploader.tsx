'use client'

import React, { useRef, useState } from 'react'
import { Card } from '@/common/ui/card'
import { Button } from '@/common/ui/button'
import { Badge } from '@/common/ui/badge'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import useS3Upload from '@/common/hooks/useS3Upload'
import { notify } from '@/common/utils/notify'
import MyImage from '@/common/components/atoms/Image'
import { useSession } from 'next-auth/react'

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
  uploadKey?: string
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images = [],
  onImagesChange,
  minRequired = 5,
  uploadKey,
}) => {
  const { data: session } = useSession()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadImages, isUploading, progress, error } = useS3Upload()
  const [previewImages, setPreviewImages] = useState<ImagePreview[]>(images)
  const [stagedImages, setStagedImages] = useState<ImagePreview[]>([])

  // Update previewImages when images prop changes (for edit mode)
  React.useEffect(() => {
    setPreviewImages(images)
  }, [images])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[]
    
    if (files.length === 0) return

    const newStagedImages: ImagePreview[] = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      isUploading: false,
    }))
    
    setStagedImages(prev => [...prev, ...newStagedImages])
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = (index: number, isStaged: boolean) => {    if (isStaged) {
      const imageToRemove = stagedImages[index]
      const newStagedImages = stagedImages.filter((_, i) => i !== index)
      
      if (imageToRemove.file) {
        URL.revokeObjectURL(imageToRemove.url)
      }
      
      setStagedImages(newStagedImages)
    } else {
      const newImages = previewImages.filter((_, i) => i !== index)
      
      if (previewImages[index].file) {
        URL.revokeObjectURL(previewImages[index].url)
      }
      
      setPreviewImages(newImages)
      onImagesChange(newImages)
    }
  }

  const handleSetCover = (index: number) => {
    if (index === 0) return
    const newImages = [...previewImages]
    const [cover] = newImages.splice(index, 1)
    newImages.unshift(cover)
    setPreviewImages(newImages)
    onImagesChange(newImages)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files) as File[]
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      notify.error('Please drop valid image files')
      return
    }

    const newStagedImages: ImagePreview[] = imageFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      isUploading: false,
    }))
    
    setStagedImages(prev => [...prev, ...newStagedImages])
  }

  const handleUploadImages = async () => {
    if (stagedImages.length === 0) return

    if (totalImages < minRequired) {
      notify.error(`Please select at least ${minRequired} images before uploading`)
      return
    }

    const filesToUpload = stagedImages.map(img => img.file!).filter(Boolean)
    
    if (filesToUpload.length === 0) return

    // Mark all staged images as uploading
    setStagedImages(prev => prev.map(img => ({ ...img, isUploading: true })))

    try {
      const userId = session?.user?.id;
      const key = userId ? (uploadKey ? `${userId}/${uploadKey}` : userId) : uploadKey;
      const results = await uploadImages(filesToUpload.map(file => ({ file, key })))
      
      const uploadedImages = results
        .filter(result => result.success)
        .map(result => ({
          url: result.url,
          name: result.originalFile.name,
          isUploading: false,
        }))

      // Clean up staged image URLs
      stagedImages.forEach(preview => {
        if (preview.file) {
          URL.revokeObjectURL(preview.url)
        }
      })
      
      const newImages = [...previewImages, ...uploadedImages]
      setPreviewImages(newImages)
      onImagesChange(newImages)
      setStagedImages([])

      const failedUploads = results.filter(result => !result.success)
      if (failedUploads.length > 0) {
        notify.error(`${failedUploads.length} image(s) failed to upload`)
      } else {
        notify.success(`${uploadedImages.length} image(s) uploaded successfully`)
      }
    } catch {
      setStagedImages(prev => prev.map(img => ({ ...img, isUploading: false })))
      notify.error('Failed to upload images. Please try again.')
    }
  }

  const totalImages = previewImages.length + stagedImages.length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={totalImages >= minRequired ? "default" : "secondary"} className={`${totalImages >= minRequired ? 'text-white!' : ''}`}>
            {totalImages >= minRequired ? `${totalImages}/${minRequired} ` : `${totalImages}/${minRequired}`}
            required
          </Badge>
          {totalImages < minRequired && (
            <span className="text-xs text-muted-foreground">
              Add {minRequired - totalImages} more image{minRequired - totalImages !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {stagedImages.length > 0 && (
          <Button
            type="button"
            onClick={handleUploadImages}
            disabled={isUploading || totalImages < minRequired}
            size="sm"
            className='text-white!'
            variant='default'
          >
            {isUploading ? `Uploading ${Math.round(progress)}%` : `Upload ${stagedImages.length} Image${stagedImages.length !== 1 ? 's' : ''}`}
          </Button>
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
      {(previewImages.length > 0 || stagedImages.length > 0) && (
        <div className="space-y-3">
          {/* Uploaded Images */}
          {previewImages.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Images</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previewImages.map((preview, index) => (
                  <Card 
                    key={`uploaded-${index}`} 
                    className={`relative group overflow-hidden p-2 cursor-pointer transition-all ${
                      index === 0 ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                    onClick={() => handleSetCover(index)}
                  >
                    <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                      <MyImage
                        src={preview.url}
                        alt={preview.name}
                        width={0}
                        height={0}
                        className="w-full h-full object-cover"
                      />
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
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveImage(index, false)
                      }}
                      className="absolute top-4 right-4 z-10 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                    
                    <p className="text-xs text-muted-foreground mt-2 truncate">
                      {preview.name}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Staged Images */}
          {stagedImages.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Selected Images (Not Uploaded Yet)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {stagedImages.map((preview, index) => (
                  <Card key={`staged-${index}`} className="relative group overflow-hidden p-2 border-2 border-dashed border-amber-300">
                    <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                      <MyImage
                        src={preview.url}
                        alt={preview.name}
                        width={0}
                        height={0}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Uploading Overlay */}
                      {preview.isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-white text-xs">Uploading...</div>
                        </div>
                      )}
                    </div>
                    
                    {/* Staged Badge */}
                    <Badge
                      variant="secondary"
                      className="absolute top-4 left-4 z-10 bg-amber-100 text-amber-800"
                    >
                      Pending
                    </Badge>
                    
                    {/* Remove Button */}
                    {!preview.isUploading && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index, true)}
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
            </div>
          )}
        </div>
      )}

      {/* Upload Summary */}
      {(previewImages.length > 0 || stagedImages.length > 0) && (
        <div className="flex items-center gap-4 text-sm">
          {previewImages.length > 0 && (
            <div className="flex items-center gap-2 text-green-600">
              <ImageIcon className="w-4 h-4" />
              <span>{previewImages.length} uploaded</span>
            </div>
          )}
          {stagedImages.length > 0 && (
            <div className="flex items-center gap-2 text-amber-600">
              <ImageIcon className="w-4 h-4" />
              <span>{stagedImages.length} pending</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ImageUploader
