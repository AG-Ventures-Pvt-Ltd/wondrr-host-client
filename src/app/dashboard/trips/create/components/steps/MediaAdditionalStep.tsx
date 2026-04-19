'use client'

import React from 'react'
import { Label } from '@/common/ui/label'
import { Button } from '@/common/ui/button'
import { Card } from '@/common/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import { Badge } from '@/common/ui/badge'
import CustomInput from '@/common/components/composites/CustomInput'
import ImageUploader from './ImageUploader'
import { useTripFormStore } from '../../store'
import { useFAQManager } from '../../hooks'
import { VALIDATION_RULES, PHOTO_TIPS } from '../../constants'
import { FAQ } from '../../types'

const MediaAdditionalStep: React.FC = () => {
  const { tripImages, additionalInfo, updateField } = useTripFormStore()
  const {
    question,
    setQuestion,
    answer,
    setAnswer,
    faqs,
    handleAddFAQ,
    handleRemoveFAQ,
    isValid,
  } = useFAQManager()

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-base! font-medium">
          Trip Images
        </Label>
        <p className="text-xs text-muted-foreground">
          Upload high-quality images that showcase your trip. First image will be used as cover.
        </p>
        
        <ImageUploader
          images={tripImages}
          onImagesChange={(images) => updateField('tripImages', images)}
          minRequired={VALIDATION_RULES.MIN_IMAGES}
          uploadKey="trips"
        />
      </div>
      <div className="space-y-3">
        <Label className="text-base! font-medium">
          Frequently Asked Questions
        </Label>
        <p className="text-xs text-muted-foreground">
          Add common questions and answers to help travelers understand your trip better.
        </p>
        <div className="flex items-center gap-2">
          <Badge variant={faqs.length >= VALIDATION_RULES.MIN_FAQS ? "default" : "secondary"} 
            className={faqs.length >= VALIDATION_RULES.MIN_FAQS ? "text-white!" : ""}>
            {faqs.length}/{VALIDATION_RULES.MIN_FAQS} required
          </Badge>
          {faqs.length < VALIDATION_RULES.MIN_FAQS && (
            <span className="text-xs text-muted-foreground">
              Add {VALIDATION_RULES.MIN_FAQS - faqs.length} more FAQ{VALIDATION_RULES.MIN_FAQS - faqs.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <Card className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="faqQuestion" className="text-sm">Question</Label>
              <CustomInput
                id="faqQuestion"
                placeholder="e.g., What is the best time to visit?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                variant="input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="faqAnswer" className="text-sm">Answer</Label>
              <CustomInput
                id="faqAnswer"
                placeholder="Provide a detailed answer to the question..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                variant="textarea"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={handleAddFAQ}
                  disabled={!isValid}
                  size="sm"
                  className='text-white'
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add FAQ
                </Button>
              </div>
            </div>
          </div>
        </Card>
        {faqs.length > 0 && (
          <div className="space-y-3">
            {faqs.map((faq: FAQ) => (
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
                      onClick={() => handleRemoveFAQ(faq.id)}
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

      {/* Additional Information Section */}
      <div className="space-y-3">
        <Label className="text-base! font-medium">
          Additional Information
        </Label>
        <p className="text-xs text-muted-foreground">
          Add any additional details or special instructions that travelers should know about this trip.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Important: Highlight these in additional info</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• <strong>Accommodation:</strong> Type (tent, hostel, homestay, hotel) and whether shared or private</li>
            <li>• <strong>Age Restrictions:</strong> Min/max age if applicable</li>
            <li>• <strong>What to Carry:</strong> Clothing, footwear, documents, cash recommendations</li>
            <li>• <strong>Connectivity:</strong> Phone signal / wifi availability at the destination</li>
            <li>• <strong>Female Trip Lead:</strong> Whether the trip has a female guide or lead (for female-only trips)</li>
          </ul>
        </div>

        <CustomInput
          id="additionalInfo"
          placeholder="e.g., Special requirements, packing tips, important notes..."
          value={additionalInfo}
          onChange={(e) => updateField('additionalInfo', e.target.value)}
          variant="textarea"
          rows={5}
        />
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Tips for Great Trip Photos</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          {PHOTO_TIPS.map((tip, index) => (
            <li key={index}>• {tip}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default MediaAdditionalStep
