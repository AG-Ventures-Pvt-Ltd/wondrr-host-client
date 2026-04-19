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
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Important: Highlight these in inclusions/exclusions</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• <strong>Meals:</strong> Specify inclusions/exclusions and veg/non-veg options</li>
          <li>• <strong>Equipment:</strong> Mention any activity equipment (biking, trekking gear, etc.)</li>
          <li>• <strong>Medical Support:</strong> Emergency medical assistance availability</li>
          <li>• <strong>Liquor:</strong> Alcohol policy and allowances</li>
        </ul>
      </div>

      {/* Highlights */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-neutral-900">Highlights</h3>
          <Badge
            variant={highlights.length >= VALIDATION_RULES.MIN_HIGHLIGHTS ? 'default' : 'secondary'}
            className={highlights.length >= VALIDATION_RULES.MIN_HIGHLIGHTS ? 'text-white!' : ''}
          >
            {highlights.length}/{VALIDATION_RULES.MIN_HIGHLIGHTS} required
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Key selling points of the trip — what makes it special.
        </p>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="highlight" className="text-xs">Highlight Title</Label>
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
              <Label className="text-xs">Highlight Image (optional)</Label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleImageSelect(file)
                    }
                  }}
                  className="hidden"
                  id="highlight-image-upload"
                />
                <label
                  htmlFor="highlight-image-upload"
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Choose Image
                </label>
                {highlightImagePreview && (
                  <div className="flex items-center gap-2">
                    <MyImage
                      src={highlightImagePreview}
                      alt="Preview"
                      width={24}
                      height={24}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddHighlight}
            disabled={!highlightInput.trim() || isUploading}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            {isUploading ? 'Uploading...' : 'Add Highlight'}
          </button>

          {highlights.length < VALIDATION_RULES.MIN_HIGHLIGHTS && (
            <p className="text-xs text-muted-foreground">
              Add {VALIDATION_RULES.MIN_HIGHLIGHTS - highlights.length} more highlight{VALIDATION_RULES.MIN_HIGHLIGHTS - highlights.length !== 1 ? 's' : ''}
            </p>
          )}
          {highlights.length > 0 && (
            <div className="space-y-2">
              {highlights.map((highlight) => (
                <div
                  key={highlight.id}
                  className="flex items-center justify-between p-3 bg-yellow-50/50 border border-yellow-200/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {highlight.image && (
                      <MyImage
                        src={highlight.image}
                        alt={highlight.title}
                        width={24}
                        height={18}
                        className="w-16 h-12 rounded object-cover"
                      />
                    )}
                    <span className="text-sm text-neutral-900">{highlight.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(highlight.id)}
                    className="text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={handleAddHighlight}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Highlight
          </button>
        </div>
      </div>

      {/* Inclusions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-neutral-900">Inclusions</h3>
          <Badge variant={inclusions.length >= VALIDATION_RULES.MIN_INCLUSIONS ? "default" : "secondary"} className={`${inclusions.length >= VALIDATION_RULES.MIN_INCLUSIONS ? 'text-white!' : ''}`}>
            {inclusions.length}/{VALIDATION_RULES.MIN_INCLUSIONS} required
          </Badge>
        </div>
        <div className="space-y-3">
          <div className="flex gap-2">
            <CustomInput
              id="inclusion"
              placeholder="e.g., Hotel accommodation"
              value={inclusionInput}
              onChange={(e) => setInclusionInput(e.target.value)}
              onKeyDown={handleInclusionKeyPress}
              onPaste={handleInclusionPaste}
              variant="input"
              className="flex-1"
            />
            <button
              type="button"
              onClick={handleAddInclusion}
              className="w-10 h-10 rounded-2xl border border-neutral-200/60 flex items-center justify-center hover:bg-neutral-50 transition-colors"
            >
              <Plus className="w-4 h-4 text-neutral-400" />
            </button>
          </div>

          {inclusions.length < VALIDATION_RULES.MIN_INCLUSIONS && (
            <p className="text-xs text-muted-foreground">
              Add {VALIDATION_RULES.MIN_INCLUSIONS - inclusions.length} more inclusion{VALIDATION_RULES.MIN_INCLUSIONS - inclusions.length !== 1 ? 's' : ''}
            </p>
          )}
          {inclusions.length > 0 && (
            <div className="space-y-2">
              {inclusions.map((inclusion) => (
                <div
                  key={inclusion.id}
                  className="flex items-center justify-between p-3 bg-green-50/50 border border-green-200/50 rounded-lg"
                >
                  <span className="text-sm text-neutral-900">{inclusion.text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInclusion(inclusion.id)}
                    className="text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={handleAddInclusion}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Inclusion
          </button>
        </div>
      </div>

      {/* Exclusions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-neutral-900">Exclusions</h3>
          <Badge variant={exclusions.length >= VALIDATION_RULES.MIN_EXCLUSIONS ? "default" : "secondary"} className={`${exclusions.length >= VALIDATION_RULES.MIN_EXCLUSIONS ? 'text-white!' : ''}`}>
            {exclusions.length}/{VALIDATION_RULES.MIN_EXCLUSIONS} required
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <CustomInput
              id="exclusion"
              placeholder="e.g., Personal expenses"
              value={exclusionInput}
              onChange={(e) => setExclusionInput(e.target.value)}
              onKeyDown={handleExclusionKeyPress}
              onPaste={handleExclusionPaste}
              variant="input"
              className="flex-1"
            />
            <button
              type="button"
              onClick={handleAddExclusion}
              className="w-10 h-10 rounded-2xl border border-neutral-200/60 flex items-center justify-center hover:bg-neutral-50 transition-colors"
            >
              <Plus className="w-4 h-4 text-neutral-400" />
            </button>
          </div>

          {exclusions.length < VALIDATION_RULES.MIN_EXCLUSIONS && (
            <p className="text-xs text-muted-foreground">
              Add {VALIDATION_RULES.MIN_EXCLUSIONS - exclusions.length} more exclusion{VALIDATION_RULES.MIN_EXCLUSIONS - exclusions.length !== 1 ? 's' : ''}
            </p>
          )}

          {exclusions.length > 0 && (
            <div className="space-y-2">
              {exclusions.map((exclusion) => (
                <div
                  key={exclusion.id}
                  className="flex items-center justify-between p-3 bg-red-50/50 border border-red-200/50 rounded-lg"
                >
                  <span className="text-sm text-neutral-900">{exclusion.text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExclusion(exclusion.id)}
                    className="text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleAddExclusion}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Exclusion
          </button>
        </div>
      </div>

      {/* Things to Carry */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-neutral-900">Things to Carry</h3>
          <Badge variant="secondary">
            {thingsToCarry.length} added
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Items travellers should bring — gear, documents, clothing, medication, etc.
        </p>
        <div className="space-y-3">
          <div className="flex gap-2">
            <CustomInput
              id="thingToCarry"
              placeholder="e.g., Valid government ID, Warm jacket"
              value={thingToCarryInput}
              onChange={(e) => setThingToCarryInput(e.target.value)}
              onKeyDown={handleThingToCarryKeyPress}
              onPaste={handleThingToCarryPaste}
              variant="input"
              className="flex-1"
            />
            <button
              type="button"
              onClick={handleAddThingToCarry}
              className="w-10 h-10 rounded-2xl border border-neutral-200/60 flex items-center justify-center hover:bg-neutral-50 transition-colors"
            >
              <Plus className="w-4 h-4 text-neutral-400" />
            </button>
          </div>

          {thingsToCarry.length > 0 && (
            <div className="space-y-2">
              {thingsToCarry.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-orange-50/50 border border-orange-200/50 rounded-lg"
                >
                  <span className="text-sm text-neutral-900">{item.text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveThingToCarry(item.id)}
                    className="text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleAddThingToCarry}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>
    </div>
  )
}

export default InclusionsExclusionsStep
