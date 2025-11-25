'use client'

import React, { useState } from 'react'
import { Input } from '@/common/ui/input'
import { Label } from '@/common/ui/label'
import { Textarea } from '@/common/ui/textarea'
import { SelectTrigger, SelectContent, SelectItem } from '@/common/ui/select'
import { Badge } from '@/common/ui/badge'
import { X } from 'lucide-react'

const CATEGORIES = [
  'Adventure',
  'Cultural',
  'Relaxation',
  'Wildlife',
  'Beach',
  'Mountain',
  'City',
  'Road Trip',
  'Cruise',
  'Spiritual',
  'Trek',
  'Desert',
  'Historical',
  'Food & Culinary',
  'Photography',
  'Camping',
  'Other',
]

const BasicInfoStep = ({ formData, updateFormData }) => {
  const [tagInput, setTagInput] = useState('')
  const [customCategory, setCustomCategory] = useState(() => {
    // Initialize custom category if formData.category is not in predefined list
    if (formData.category && formData.category !== 'Other' && !CATEGORIES.includes(formData.category)) {
      return formData.category
    }
    return ''
  })

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(tagInput.trim())) {
        updateFormData('tags', [...formData.tags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    updateFormData('tags', formData.tags.filter(tag => tag !== tagToRemove))
  }

  const handleCategoryChange = (value) => {
    updateFormData('category', value)
    if (value !== 'Other') {
      setCustomCategory('')
    }
  }

  const handleCustomCategoryChange = (value) => {
    setCustomCategory(value)
    // Update the form data with the custom category if it's not empty, otherwise keep it as 'Other'
    updateFormData('category', value.trim() || 'Other')
  }

  return (
    <div className="space-y-6">
      {/* Trip Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Trip Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder="e.g., Himalayan Adventure Trek"
          value={formData.title}
          onChange={(e) => updateFormData('title', e.target.value)}
          className="w-full"
          required
        />
        <p className="text-xs text-muted-foreground">
          Choose a catchy and descriptive title for your trip
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe your trip in detail. Include what makes it special, what participants can expect, and any unique experiences..."
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          rows={6}
          className="w-full resize-none"
          required
        />
        <p className="text-xs text-muted-foreground">
          {formData.description.length} characters
        </p>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm font-medium">
          Category <span className="text-red-500">*</span>
        </Label>
        <SelectTrigger
          id="category"
          value={formData.category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          placeholder="Select category"
          className="w-full"
        >
          <SelectContent>
            <SelectItem value="">Select category</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectTrigger>
        
        {/* Custom category input when "Other" is selected */}
        {formData.category === 'Other' && (
          <div className="space-y-2">
            <Label htmlFor="customCategory" className="text-sm font-medium">
              Specify Category <span className="text-red-500">*</span>
            </Label>
            <Input
              id="customCategory"
              placeholder="Enter your custom category"
              value={customCategory}
              onChange={(e) => handleCustomCategoryChange(e.target.value)}
              className="w-full"
              required
            />
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags" className="text-sm font-medium">
          Tags
        </Label>
        <Input
          id="tags"
          placeholder="Type a tag and press Enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          className="w-full"
        />
        <div className="flex items-center gap-2">
          <Badge variant={formData.tags.length >= 7 ? "default" : "secondary"}>
            {formData.tags.length}/7 required
          </Badge>
          {formData.tags.length < 7 && (
            <span className="text-xs text-muted-foreground">
              Add {7 - formData.tags.length} more tag{7 - formData.tags.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        {/* Display Tags */}
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.tags.map((tag, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
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
    </div>
  )
}

export default BasicInfoStep
