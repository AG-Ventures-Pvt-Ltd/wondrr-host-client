'use client'

import React, { useState } from 'react'
import { Input } from '@/common/ui/input'
import { Label } from '@/common/ui/label'
import { Button } from '@/common/ui/button'
import { X, Plus } from 'lucide-react'
import { Badge } from '@/common/ui/badge'

const PricingDetailsStep = ({ formData, updateFormData }) => {
  const [inclusionInput, setInclusionInput] = useState('')
  const [exclusionInput, setExclusionInput] = useState('')

  const handleAddInclusion = () => {
    if (inclusionInput.trim()) {
      updateFormData('inclusions', [...formData.inclusions, inclusionInput.trim()])
      setInclusionInput('')
    }
  }

  const handleRemoveInclusion = (index) => {
    updateFormData('inclusions', formData.inclusions.filter((_, i) => i !== index))
  }

  const handleAddExclusion = () => {
    if (exclusionInput.trim()) {
      updateFormData('exclusions', [...formData.exclusions, exclusionInput.trim()])
      setExclusionInput('')
    }
  }

  const handleRemoveExclusion = (index) => {
    updateFormData('exclusions', formData.exclusions.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Pricing */}
      <div className="space-y-2">
        <Label htmlFor="basePrice" className="text-sm font-medium">
          Base Price <span className="text-red-500">*</span>
        </Label>
        <Input
          id="basePrice"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={formData.basePrice}
          onChange={(e) => updateFormData('basePrice', e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">
          Price per person in INR
        </p>
      </div>

      {/* Price Preview */}
      {formData.basePrice && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-muted-foreground">Price Preview</p>
          <p className="text-2xl font-bold text-primary mt-1">
            ₹{parseFloat(formData.basePrice).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">per person</p>
        </div>
      )}

      {/* Inclusions */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Inclusions <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-muted-foreground">
          What&apos;s included in the trip price?
        </p>
        <div className="flex items-center gap-2">
          <Badge variant={formData.inclusions.length >= 5 ? "default" : "secondary"}>
            {formData.inclusions.length}/5 required
          </Badge>
          {formData.inclusions.length < 5 && (
            <span className="text-xs text-muted-foreground">
              Add {5 - formData.inclusions.length} more inclusion{5 - formData.inclusions.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="e.g., Accommodation, Meals, Transport..."
            value={inclusionInput}
            onChange={(e) => setInclusionInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInclusion())}
            className="flex-1"
          />
          <Button type="button" onClick={handleAddInclusion} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {formData.inclusions.length > 0 && (
          <div className="space-y-2 mt-3">
            {formData.inclusions.map((inclusion, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm">{inclusion}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveInclusion(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exclusions */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Exclusions
        </Label>
        <p className="text-xs text-muted-foreground">
          What&apos;s NOT included in the trip price?
        </p>
        <div className="flex items-center gap-2">
          <Badge variant={formData.exclusions.length >= 5 ? "default" : "secondary"}>
            {formData.exclusions.length}/5 required
          </Badge>
          {formData.exclusions.length < 5 && (
            <span className="text-xs text-muted-foreground">
              Add {5 - formData.exclusions.length} more exclusion{5 - formData.exclusions.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="e.g., Personal expenses, Travel insurance..."
            value={exclusionInput}
            onChange={(e) => setExclusionInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExclusion())}
            className="flex-1"
          />
          <Button type="button" onClick={handleAddExclusion} size="sm" variant="outline">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {formData.exclusions.length > 0 && (
          <div className="space-y-2 mt-3">
            {formData.exclusions.map((exclusion, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <span className="text-red-600">✗</span>
                  <span className="text-sm">{exclusion}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveExclusion(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PricingDetailsStep
