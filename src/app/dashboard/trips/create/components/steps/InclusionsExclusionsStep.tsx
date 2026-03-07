'use client'

import React from 'react'
import { Badge } from '@/common/ui/badge'
import { Plus, X } from 'lucide-react'
import CustomInput from '@/common/components/composites/CustomInput'
import { useInclusionManager, useExclusionManager } from '../../hooks'
import { VALIDATION_RULES } from '../../constants'

interface InclusionsExclusionsStepProps {
  isEditMode?: boolean
}

const InclusionsExclusionsStep: React.FC<InclusionsExclusionsStepProps> = ({ isEditMode = false }) => {
  const {
    inclusionInput,
    setInclusionInput,
    inclusions,
    handleAddInclusion,
    handleRemoveInclusion,
    handleKeyPress: handleInclusionKeyPress,
  } = useInclusionManager()

  const {
    exclusionInput,
    setExclusionInput,
    exclusions,
    handleAddExclusion,
    handleRemoveExclusion,
    handleKeyPress: handleExclusionKeyPress,
  } = useExclusionManager()

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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-neutral-900">Inclusions</h3>
          <Badge variant={inclusions.length >= VALIDATION_RULES.MIN_INCLUSIONS ? "default" : "secondary"} className={`${exclusions.length >= VALIDATION_RULES.MIN_EXCLUSIONS ? 'text-white!' : ''}`}>
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-neutral-900">Exclusions</h3>
          <Badge variant={exclusions.length >= VALIDATION_RULES.MIN_EXCLUSIONS ? "default" : "secondary"} className={`${exclusions.length >= VALIDATION_RULES.MIN_EXCLUSIONS ? 'text-white!' : ''}`}>
            {exclusions.length}/{VALIDATION_RULES.MIN_EXCLUSIONS} required
          </Badge>
        </div>

        <div className="space-y-3">
          {!isEditMode && (
            <div className="flex gap-2">
              <CustomInput
                id="exclusion"
                placeholder="e.g., Personal expenses"
                value={exclusionInput}
                onChange={(e) => setExclusionInput(e.target.value)}
                onKeyDown={handleExclusionKeyPress}
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
          )}

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

          {!isEditMode && (
            <button
              type="button"
              onClick={handleAddExclusion}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Exclusion
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default InclusionsExclusionsStep
