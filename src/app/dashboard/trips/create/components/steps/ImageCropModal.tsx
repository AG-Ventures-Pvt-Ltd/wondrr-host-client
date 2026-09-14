'use client'

import React, { useCallback, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/common/ui/dialog'
import { Button } from '@/common/ui/button'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { getCroppedImageFile } from '@/common/utils/cropImage'

const CROP_ASPECT = 16 / 9

interface ImageCropModalProps {
  open: boolean
  imageSrc: string
  fileName: string
  fileType: string
  onCancel: () => void
  onCropDone: (file: File) => void
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  open,
  imageSrc,
  fileName,
  fileType,
  onCancel,
  onCropDone,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCropComplete = useCallback((_croppedArea: Area, croppedAreaPixelsValue: Area) => {
    setCroppedAreaPixels(croppedAreaPixelsValue)
  }, [])

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return
    setIsProcessing(true)
    try {
      const croppedFile = await getCroppedImageFile(imageSrc, croppedAreaPixels, fileName, fileType)
      onCropDone(croppedFile)
    } finally {
      setIsProcessing(false)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-96 bg-gray-900 rounded-md overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={CROP_ASPECT}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            restrictPosition
          />
        </div>

        <div className="flex items-center gap-3 px-1">
          <ZoomOut className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <ZoomIn className="w-4 h-4 text-muted-foreground shrink-0" />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isProcessing}>
            Cancel
          </Button>
          <Button type="button" className="text-white!" onClick={handleConfirm} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Crop & Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ImageCropModal
