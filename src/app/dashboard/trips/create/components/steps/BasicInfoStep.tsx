'use client'

import React from 'react'
import { Label } from '@/common/ui/label'
import { Badge } from '@/common/ui/badge'
import { X } from 'lucide-react'
import CustomInput from '@/common/components/composites/CustomInput'
import CustomSelect from '@/common/components/composites/CustomSelect'
import Button from '@/common/components/atoms/Button'
import { Toggle } from '@/common/ui/toggle'
import { useTripFormStore } from '../../store'
import { useTagManager, useCategoryManager } from '../../hooks'
import { TRIP_CATEGORIES, VALIDATION_RULES } from '../../constants'

interface BasicInfoStepProps {
  isEditMode?: boolean
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ isEditMode = false }) => {
  const { title, description, location, isFemaleOnly, updateField, updateLocationField } = useTripFormStore()
  const { tagInput, setTagInput, tags, handleAddTag, handleRemoveTag, handleKeyPress } = useTagManager()
  const { category, customCategory, handleCategoryChange, handleCustomCategoryChange } = useCategoryManager()

  const categoryOptions = TRIP_CATEGORIES.map(cat => ({ value: cat, label: cat }))

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
          disabled={isEditMode}
        />
        <p className="text-xs text-subtext">
          Choose a catchy and descriptive title for your trip
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm">
          Description
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

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm">
          Category
        </Label>
        <CustomSelect
          id="category"
          value={category}
          placeholder='Select Category'
          onChange={handleCategoryChange}
          options={categoryOptions}
          className="w-full"
          required
          disabled={isEditMode}
        />

        {category === 'Other' && (
          <div className="space-y-2">
            <Label htmlFor="customCategory" className="text-sm">
              Specify Category <span className="text-red-500">*</span>
            </Label>
            <CustomInput
              id="customCategory"
              placeholder="Enter your custom category"
              value={customCategory}
              onChange={(e) => handleCustomCategoryChange(e.target.value)}
              variant="input"
              required
              disabled={isEditMode}
            />
          </div>
        )}
      </div>
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
        
        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm">
            Address 
          </Label>
          <CustomInput
            id="address"
            placeholder="Enter trip address"
            value={location.address || ''}
            onChange={(e) => updateLocationField('address', e.target.value)}
            variant="input"
            required
            disabled={isEditMode}
          />
        </div>

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
              disabled={isEditMode}
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
              disabled={isEditMode}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasicInfoStep
