'use client'

import React, { useState } from 'react'
import { Label } from '@/common/ui/label'
import { Input } from '@/common/ui/input'
import { Textarea } from '@/common/ui/textarea'
import { Button } from '@/common/ui/button'
import { Card } from '@/common/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import { Badge } from '@/common/ui/badge'
import ImageUploader from './ImageUploader'

const MediaAdditionalStep = ({ formData, updateFormData }) => {
  const [faqQuestion, setFaqQuestion] = useState('')
  const [faqAnswer, setFaqAnswer] = useState('')

  const handleAddFaq = () => {
    if (faqQuestion.trim() && faqAnswer.trim()) {
      const newFaq = {
        id: Date.now(),
        question: faqQuestion.trim(),
        answer: faqAnswer.trim(),
      }
      updateFormData('faqs', [...formData.faqs, newFaq])
      setFaqQuestion('')
      setFaqAnswer('')
    }
  }

  const handleRemoveFaq = (faqId) => {
    updateFormData('faqs', formData.faqs.filter(faq => faq.id !== faqId))
  }

  const handleImagesChange = (images) => {
    updateFormData('tripImages', images)
  }

  return (
    <div className="space-y-6">
      {/* Trip Images */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Trip Images <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-muted-foreground">
          Upload high-quality images that showcase your trip. First image will be used as cover.
        </p>
        
        <ImageUploader
          images={formData.tripImages}
          onImagesChange={handleImagesChange}
          minRequired={5}
        />
      </div>

      {/* FAQ Section */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Frequently Asked Questions
        </Label>
        <p className="text-xs text-muted-foreground">
          Add common questions and answers to help travelers understand your trip better.
        </p>
        <div className="flex items-center gap-2">
          <Badge variant={formData.faqs.length >= 4 ? "default" : "secondary"}>
            {formData.faqs.length}/4 required
          </Badge>
          {formData.faqs.length < 4 && (
            <span className="text-xs text-muted-foreground">
              Add {4 - formData.faqs.length} more FAQ{4 - formData.faqs.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Add FAQ Form */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="faqQuestion" className="text-sm">Question</Label>
              <Input
                id="faqQuestion"
                placeholder="e.g., What is the best time to visit?"
                value={faqQuestion}
                onChange={(e) => setFaqQuestion(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="faqAnswer" className="text-sm">Answer</Label>
              <Textarea
                id="faqAnswer"
                placeholder="Provide a detailed answer to the question..."
                value={faqAnswer}
                onChange={(e) => setFaqAnswer(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={handleAddFaq}
                  disabled={!faqQuestion.trim() || !faqAnswer.trim()}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add FAQ
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* FAQ List */}
        {formData.faqs.length > 0 && (
          <div className="space-y-3">
            {formData.faqs.map((faq) => (
                <Card key={faq.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-sm">{faq.question}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFaq(faq.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Tips for Great Trip Photos</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Use high-resolution images (at least 1920x1080px)</li>
          <li>• Show diverse aspects: landscapes, activities, accommodations</li>
          <li>• Include photos of previous trips if available</li>
          <li>• Avoid heavily edited or filtered images</li>
          <li>• Ensure you have rights to use the images</li>
        </ul>
      </div>

      {/* Status Info */}
      <div className="p-4 bg-gray-50 border rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Trip Status</p>
            <p className="text-xs text-muted-foreground mt-1">
              This trip will be saved as a draft. You can publish it later.
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0">
            Draft
          </Badge>
        </div>
      </div>

      {/* Summary */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <h4 className="text-sm font-medium mb-3">Trip Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Title:</span>
            <span className="font-medium">{formData.title || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Category:</span>
            <span className="font-medium">{formData.category || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Location:</span>
            <span className="font-medium">
              {formData.location.city && formData.location.state
                ? `${formData.location.city}, ${formData.location.state}`
                : 'Not set'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Duration:</span>
            <span className="font-medium">{formData.duration || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price:</span>
            <span className="font-medium">
              {formData.basePrice
                ? `₹${formData.basePrice}`
                : 'Not set'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Images:</span>
            <span className="font-medium">{formData.tripImages?.length || 0} uploaded</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default MediaAdditionalStep
