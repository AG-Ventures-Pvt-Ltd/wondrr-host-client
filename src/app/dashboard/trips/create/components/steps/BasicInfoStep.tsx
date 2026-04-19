'use client'

import React from 'react'
import { Label } from '@/common/ui/label'
import { Badge } from '@/common/ui/badge'
import { Check, X } from 'lucide-react'
import CustomInput from '@/common/components/composites/CustomInput'
import CustomSelect from '@/common/components/composites/CustomSelect'
import Button from '@/common/components/atoms/Button'
import { Toggle } from '@/common/ui/toggle'
import { useTripFormStore } from '../../store'
import { useTagManager } from '../../hooks'
import { TRIP_CATEGORIES, TRIP_DIFFICULTIES, VALIDATION_RULES } from '../../constants'
import type { TripDifficulty } from '../../types'

interface BasicInfoStepProps {
  isEditMode?: boolean
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ isEditMode = false }) => {
  const { title, description, location, isFemaleOnly, difficulty, updateField, updateLocationField, category, toggleCategory } = useTripFormStore()
  const { tagInput, setTagInput, tags, handleAddTag, handleRemoveTag, handleKeyPress } = useTagManager()

  const difficultyOptions = TRIP_DIFFICULTIES.map(d => ({ value: d.value, label: d.label }))

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm">
          Trip Title
        </Label>
        <CustomInput
          id="title"
          placeholder="e.g., Himalayan Adventure Trek"
          value={title}
          onChange={(e) => updateField('title', e.target.value)}
          variant="input"
          required
        />
        <p className="text-xs text-subtext">
          Choose a catchy and descriptive title for your trip
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm">
          Trip Vibe 
        </Label>
        <CustomInput
          id="description"
          placeholder="Describe your trip in detail. Include what makes it special, what participants can expect, and any unique experiences..."
          value={description}
          onChange={(e) => updateField('description', e.target.value)}
          variant="textarea"
          rows={6}
          required
        />
        <p className="text-xs text-muted-foreground">
          {description.length} characters
        </p>
      </div>

      {/* Category — multi-select chips */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm">
            Experience Type <span className="text-red-500">*</span>
          </Label>
          {category.length > 0 && (
            <Badge variant="secondary">{category.length} selected</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Select all that apply</p>
        <div className="flex flex-wrap gap-2">
          {TRIP_CATEGORIES.filter(c => c !== 'Other').map((cat) => {
            const isSelected = category.includes(cat)
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors
                  ${isSelected
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-neutral-600 border-neutral-300 hover:border-primary hover:text-primary'
                  }
                  cursor-pointer
                `}
              >
                {isSelected && <Check className="w-3 h-3" />}
                {cat}
              </button>
            )
          })}
        </div>
        {category.length === 0 && (
          <p className="text-xs text-amber-600">Please select at least one category</p>
        )}
      </div>

      {/* Difficulty */}
      <div className="space-y-2">
        <Label htmlFor="difficulty" className="text-sm">
          Difficulty
        </Label>
        <CustomSelect
          id="difficulty"
          value={difficulty}
          placeholder="Select Difficulty"
          onChange={(val) => updateField('difficulty', val as TripDifficulty)}
          options={difficultyOptions}
          className="w-full"
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags" className="text-sm font-medium">
          Tags
        </Label>
        <div className='flex gap-6'>
          <CustomInput
            id="tags"
            placeholder="Type a tag and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyPress}
            variant="input"
          />
          <Button className='whitespace-nowrap' onClick={handleAddTag}>Add Tag</Button>
        </div>
        <div className="flex items-center gap-2">
          {tags.length < VALIDATION_RULES.MIN_TAGS && (
            <>
              <Badge variant={"secondary"}>
                {tags.length}/{VALIDATION_RULES.MIN_TAGS} required
              </Badge>
              <span className="text-xs text-muted-foreground">
                Add {VALIDATION_RULES.MIN_TAGS - tags.length} more tag{VALIDATION_RULES.MIN_TAGS - tags.length !== 1 ? 's' : ''}
              </span>
            </>
          )}
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3 px-3">
            {tags.map((tag: string, index: number) => (
              <div
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-destructive text-primary/70 hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Female Only */}
      <div className="flex items-center justify-between py-3 px-4 rounded-lg border border-neutral-200 bg-neutral-50">
        <div>
          <Label htmlFor="isFemaleOnly" className="text-sm font-medium">
            Female Only Trip
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Restrict this trip to female participants only
          </p>
        </div>
        <Toggle
          checked={isFemaleOnly}
          onCheckedChange={(val) => updateField('isFemaleOnly', val)}
          checkedLabel="Yes"
          uncheckedLabel="No"
        />
      </div>

      {/* Location Section */}
      <div className="space-y-4 pt-4 border-t border-neutral-200">
        <h3 className="text-lg font-medium text-neutral-900">Location Details</h3>

        {/* City and State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm">
              City 
            </Label>
            <CustomInput
              id="city"
              placeholder="e.g., Mumbai"
              value={location.city || ''}
              onChange={(e) => updateLocationField('city', e.target.value)}
              variant="input"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state" className="text-sm">
              State 
            </Label>
            <CustomInput
              id="state"
              placeholder="e.g., Maharashtra"
              value={location.state || ''}
              onChange={(e) => updateLocationField('state', e.target.value)}
              variant="input"
              required
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasicInfoStep
