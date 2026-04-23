'use client'

import React from 'react'
import { Label } from '@/common/ui/label'
import { Badge } from '@/common/ui/badge'
import { Plus, Trash2 } from 'lucide-react'
import CustomInput from '@/common/components/composites/CustomInput'
import ImageUploader from './ImageUploader'
import { useTripFormStore } from '../../store'
import { useFAQManager } from '../../hooks'
import { VALIDATION_RULES } from '../../constants'
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
    <div className="space-y-10 max-w-3xl">

      {/* Trip Images */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Trip Images <span className="text-red-500">*</span></h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upload high-quality images. The first image will be used as the cover.
          </p>
        </div>
        <ImageUploader
          images={tripImages}
          onImagesChange={(images) => updateField('tripImages', images)}
          minRequired={VALIDATION_RULES.MIN_IMAGES}
          uploadKey="trips"
        />
      </section>

      {/* FAQs */}
      <section className="space-y-4 pt-8 border-t border-neutral-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Frequently Asked Questions <span className="text-red-500">*</span></h3>
            <p className="text-xs text-muted-foreground mt-0.5">Help travellers understand your trip better</p>
          </div>
          {faqs.length > 0 && (
            <Badge variant={faqs.length >= VALIDATION_RULES.MIN_FAQS ? 'default' : 'secondary'}
              className={faqs.length >= VALIDATION_RULES.MIN_FAQS ? 'text-white! shrink-0' : 'shrink-0'}>
              {faqs.length}/{VALIDATION_RULES.MIN_FAQS}
            </Badge>
          )}
        </div>

        <div className="rounded-xl border border-neutral-200 bg-neutral-50/40 p-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="faqQuestion" className="text-sm">Question</Label>
            <CustomInput id="faqQuestion" placeholder="e.g., What is the best time to visit?"
              value={question} onChange={(e) => setQuestion(e.target.value)} variant="input" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="faqAnswer" className="text-sm">Answer</Label>
            <CustomInput id="faqAnswer" placeholder="Provide a detailed answer..."
              value={answer} onChange={(e) => setAnswer(e.target.value)} variant="textarea" rows={3} />
          </div>
          <button type="button" onClick={handleAddFAQ} disabled={!isValid}
            className="flex items-center gap-1.5 text-xs text-primary border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary/5 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed">
            <Plus className="w-3.5 h-3.5" />
            Add FAQ
          </button>
        </div>

        {faqs.length > 0 && (
          <div className="space-y-2">
            {faqs.map((faq: FAQ) => (
              <div key={faq.id} className="flex items-start justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900">{faq.question}</p>
                  <p className="text-xs text-muted-foreground mt-1">{faq.answer}</p>
                </div>
                <button type="button" onClick={() => handleRemoveFAQ(faq.id)}
                  className="text-neutral-400 hover:text-red-500 transition-colors shrink-0 p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        {faqs.length < VALIDATION_RULES.MIN_FAQS && (
          <p className="text-xs text-muted-foreground">{VALIDATION_RULES.MIN_FAQS - faqs.length} more FAQ{VALIDATION_RULES.MIN_FAQS - faqs.length !== 1 ? 's' : ''} needed</p>
        )}
      </section>

      {/* Additional Information */}
      <section className="space-y-3 pt-8 border-t border-neutral-100">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Additional Information</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Accommodation type, age restrictions, connectivity, packing tips, and any other details travellers should know.
          </p>
        </div>
        <CustomInput id="additionalInfo"
          placeholder="e.g., Accommodation is in tents (2 per tent). Mobile connectivity available only at base camp. Minimum age 12..."
          value={additionalInfo}
          onChange={(e) => updateField('additionalInfo', e.target.value)}
          variant="textarea" rows={5} />
      </section>
    </div>
  )
}

export default MediaAdditionalStep
