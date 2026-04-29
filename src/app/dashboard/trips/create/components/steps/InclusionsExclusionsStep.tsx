'use client'

import React from 'react'
import { Badge } from '@/common/ui/badge'
import { Label } from '@/common/ui/label'
import { Plus, X } from 'lucide-react'
import CustomInput from '@/common/components/composites/CustomInput'
import MyImage from '@/common/components/atoms/Image'
import { useInclusionManager, useExclusionManager, useHighlightManager, useThingsToCarryManager } from '../../hooks'
import { VALIDATION_RULES } from '../../constants'

interface InclusionsExclusionsStepProps {
  isEditMode?: boolean
}

const InclusionsExclusionsStep: React.FC<InclusionsExclusionsStepProps> = () => {
  const {
    inclusionInput,
    setInclusionInput,
    inclusions,
    handleAddInclusion,
    handleRemoveInclusion,
    handleKeyPress: handleInclusionKeyPress,
    handlePaste: handleInclusionPaste,
  } = useInclusionManager()

  const {
    exclusionInput,
    setExclusionInput,
    exclusions,
    handleAddExclusion,
    handleRemoveExclusion,
    handleKeyPress: handleExclusionKeyPress,
    handlePaste: handleExclusionPaste,
  } = useExclusionManager()

  const {
    thingToCarryInput,
    setThingToCarryInput,
    thingsToCarry,
    handleAddThingToCarry,
    handleRemoveThingToCarry,
    handleKeyPress: handleThingToCarryKeyPress,
    handlePaste: handleThingToCarryPaste,
  } = useThingsToCarryManager()

  const {
    highlightInput,
    setHighlightInput,
    highlightImageFile,
    highlightImagePreview,
    handleImageSelect,
    handleRemoveImage,
    highlights,
    handleAddHighlight,
    handleRemoveHighlight,
    handleKeyPress: handleHighlightKeyPress,
    handlePaste: handleHighlightPaste,
    isUploading,
  } = useHighlightManager()

  return (
    <div className="space-y-10 max-w-3xl">

      {/* Highlights */}
      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Highlights <span className="text-red-500">*</span></h3>
            <p className="text-xs text-muted-foreground mt-0.5">Key selling points that make this trip special</p>
          </div>
          {highlights.length > 0 && (
            <Badge variant={highlights.length >= VALIDATION_RULES.MIN_HIGHLIGHTS ? 'default' : 'secondary'}
              className={highlights.length >= VALIDATION_RULES.MIN_HIGHLIGHTS ? 'text-white!' : ''}>
              {highlights.length}/{VALIDATION_RULES.MIN_HIGHLIGHTS}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Title</Label>
            <CustomInput
              id="highlight"
              placeholder="e.g., Scenic Himalayan sunrise views"
              value={highlightInput}
              onChange={(e) => setHighlightInput(e.target.value)}
              onKeyDown={handleHighlightKeyPress}
              onPaste={handleHighlightPaste}
              variant="input"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Image (optional)</Label>
            <div className="flex items-center gap-2">
              <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageSelect(f) }}
                className="hidden" id="highlight-image-upload" />
              <label htmlFor="highlight-image-upload"
                className="flex items-center gap-2 px-3 py-2 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors">
                <Plus className="w-4 h-4" /> Choose Image
              </label>
              {highlightImagePreview && (
                <div className="flex items-center gap-2">
                  <MyImage src={highlightImagePreview} alt="Preview" width={32} height={32} className="w-8 h-8 rounded object-cover" />
                  <button type="button" onClick={handleRemoveImage} className="text-neutral-400 hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <button type="button" onClick={handleAddHighlight}
          disabled={!highlightInput.trim() || isUploading}
          className="flex items-center gap-2 text-xs text-primary border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary/5 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed">
          <Plus className="w-3.5 h-3.5" />
          {isUploading ? 'Uploading...' : 'Add Highlight'}
        </button>

        {highlights.length > 0 && (
          <div className="space-y-2">
            {highlights.map((highlight) => (
              <div key={highlight.id}
                className="flex items-center justify-between px-3 py-2.5 bg-yellow-50/60 border border-yellow-200/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {highlight.image && (
                    <MyImage src={highlight.image} alt={highlight.title} width={40} height={32} className="w-12 h-10 rounded object-cover shrink-0" />
                  )}
                  <span className="text-sm text-neutral-900">{highlight.title}</span>
                </div>
                <button type="button" onClick={() => handleRemoveHighlight(highlight.id)}
                  className="text-neutral-400 hover:text-red-500 transition-colors ml-3 shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        {highlights.length < VALIDATION_RULES.MIN_HIGHLIGHTS && (
          <p className="text-xs text-muted-foreground">
            {VALIDATION_RULES.MIN_HIGHLIGHTS - highlights.length} more highlight{VALIDATION_RULES.MIN_HIGHLIGHTS - highlights.length !== 1 ? 's' : ''} needed
          </p>
        )}
      </section>

      {/* Inclusions */}
      <section className="space-y-4 pt-8 border-t border-neutral-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Inclusions <span className="text-red-500">*</span></h3>
            <p className="text-xs text-muted-foreground mt-0.5">What&apos;s included in the trip price</p>
          </div>
          {inclusions.length > 0 && (
            <Badge variant={inclusions.length >= VALIDATION_RULES.MIN_INCLUSIONS ? 'default' : 'secondary'}
              className={inclusions.length >= VALIDATION_RULES.MIN_INCLUSIONS ? 'text-white!' : ''}>
              {inclusions.length}/{VALIDATION_RULES.MIN_INCLUSIONS}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <CustomInput id="inclusion" placeholder="e.g., Hotel accommodation, All meals"
            value={inclusionInput} onChange={(e) => setInclusionInput(e.target.value)}
            onKeyDown={handleInclusionKeyPress} onPaste={handleInclusionPaste}
            variant="input" className="flex-1" />
          <button type="button" onClick={handleAddInclusion}
            className="w-10 h-10 rounded-2xl border border-neutral-200/60 flex items-center justify-center hover:bg-neutral-50 transition-colors shrink-0">
            <Plus className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
        {inclusions.length > 0 && (
          <div className="space-y-2">
            {inclusions.map((inclusion) => (
              <div key={inclusion.id} className="flex items-center justify-between px-3 py-2.5 bg-green-50/50 border border-green-200/50 rounded-lg">
                <span className="text-sm text-neutral-900">{inclusion.text}</span>
                <button type="button" onClick={() => handleRemoveInclusion(inclusion.id)}
                  className="text-neutral-400 hover:text-red-500 transition-colors ml-3 shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        {inclusions.length < VALIDATION_RULES.MIN_INCLUSIONS && (
          <p className="text-xs text-muted-foreground">
            {VALIDATION_RULES.MIN_INCLUSIONS - inclusions.length} more needed
          </p>
        )}
      </section>

      {/* Exclusions */}
      <section className="space-y-4 pt-8 border-t border-neutral-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Exclusions <span className="text-red-500">*</span></h3>
            <p className="text-xs text-muted-foreground mt-0.5">What&apos;s not included and travellers should arrange separately</p>
          </div>
          {exclusions.length > 0 && (
            <Badge variant={exclusions.length >= VALIDATION_RULES.MIN_EXCLUSIONS ? 'default' : 'secondary'}
              className={exclusions.length >= VALIDATION_RULES.MIN_EXCLUSIONS ? 'text-white!' : ''}>
              {exclusions.length}/{VALIDATION_RULES.MIN_EXCLUSIONS}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <CustomInput id="exclusion" placeholder="e.g., Personal expenses, Travel insurance"
            value={exclusionInput} onChange={(e) => setExclusionInput(e.target.value)}
            onKeyDown={handleExclusionKeyPress} onPaste={handleExclusionPaste}
            variant="input" className="flex-1" />
          <button type="button" onClick={handleAddExclusion}
            className="w-10 h-10 rounded-2xl border border-neutral-200/60 flex items-center justify-center hover:bg-neutral-50 transition-colors shrink-0">
            <Plus className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
        {exclusions.length > 0 && (
          <div className="space-y-2">
            {exclusions.map((exclusion) => (
              <div key={exclusion.id} className="flex items-center justify-between px-3 py-2.5 bg-red-50/50 border border-red-200/50 rounded-lg">
                <span className="text-sm text-neutral-900">{exclusion.text}</span>
                <button type="button" onClick={() => handleRemoveExclusion(exclusion.id)}
                  className="text-neutral-400 hover:text-red-500 transition-colors ml-3 shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        {exclusions.length < VALIDATION_RULES.MIN_EXCLUSIONS && (
          <p className="text-xs text-muted-foreground">
            {VALIDATION_RULES.MIN_EXCLUSIONS - exclusions.length} more needed
          </p>
        )}
      </section>

      {/* Things to Carry */}
      <section className="space-y-4 pt-8 border-t border-neutral-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Things to Carry</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Gear, documents, clothing, medication, etc. travellers should bring</p>
          </div>
          {thingsToCarry.length > 0 && (
            <Badge variant="secondary">{thingsToCarry.length} added</Badge>
          )}
        </div>
        <div className="flex gap-2">
          <CustomInput id="thingToCarry" placeholder="e.g., Valid government ID, Warm jacket"
            value={thingToCarryInput} onChange={(e) => setThingToCarryInput(e.target.value)}
            onKeyDown={handleThingToCarryKeyPress} onPaste={handleThingToCarryPaste}
            variant="input" className="flex-1" />
          <button type="button" onClick={handleAddThingToCarry}
            className="w-10 h-10 rounded-2xl border border-neutral-200/60 flex items-center justify-center hover:bg-neutral-50 transition-colors shrink-0">
            <Plus className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
        {thingsToCarry.length > 0 && (
          <div className="space-y-2">
            {thingsToCarry.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-3 py-2.5 bg-orange-50/50 border border-orange-200/50 rounded-lg">
                <span className="text-sm text-neutral-900">{item.text}</span>
                <button type="button" onClick={() => handleRemoveThingToCarry(item.id)}
                  className="text-neutral-400 hover:text-red-500 transition-colors ml-3 shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default InclusionsExclusionsStep
