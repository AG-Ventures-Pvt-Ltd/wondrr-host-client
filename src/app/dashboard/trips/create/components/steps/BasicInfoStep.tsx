'use client'

import React, { useState } from 'react'
import { Label } from '@/common/ui/label'
import { X } from 'lucide-react'
import CustomInput from '@/common/components/composites/CustomInput'
import CustomSelect from '@/common/components/composites/CustomSelect'
import Button from '@/common/components/atoms/Button'
import { Toggle } from '@/common/ui/toggle'
import Modal from '@/common/components/composites/Modal'
import { Select as MuiSelect, MenuItem, FormControl, SelectChangeEvent, Checkbox, ListItemText } from '@mui/material'
import { useTripFormStore } from '../../store'
import { useTagManager } from '../../hooks'
import { TRIP_CATEGORIES, TRIP_DIFFICULTIES, VALIDATION_RULES, INDIAN_STATES } from '../../constants'
import type { TripDifficulty } from '../../types'

interface BasicInfoStepProps {
  isEditMode?: boolean
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = () => {
  const { title, description, location, isFemaleOnly, difficulty, updateField, updateLocationField, category, setCategory, customCategories, addCustomCategory, removeCustomCategory } = useTripFormStore()
  const { tagInput, setTagInput, tags, handleAddTag, handleRemoveTag, handleKeyPress } = useTagManager()

  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false)
  const [customCategoryInput, setCustomCategoryInput] = useState('')

  const difficultyOptions = TRIP_DIFFICULTIES.map(d => ({ value: d.value, label: d.label }))

  const stateOptions = INDIAN_STATES.map(state => ({ value: state, label: state }))

  const handleAddCustomCategory = () => {
    if (customCategoryInput.trim() && !customCategories.includes(customCategoryInput.trim())) {
      addCustomCategory(customCategoryInput.trim())
      setCustomCategoryInput('')
      setIsSuggestModalOpen(false)
    }
  }

  const allCategories = [...TRIP_CATEGORIES.filter(c => c !== 'Other'), ...customCategories]

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title" className="text-sm font-medium">
          Trip Title <span className="text-red-500">*</span>
        </Label>
        <CustomInput
          id="title"
          placeholder="e.g., Himalayan Adventure Trek"
          value={title}
          onChange={(e) => updateField('title', e.target.value)}
          variant="input"
          required
        />
        <p className="text-xs text-muted-foreground">Choose a catchy and descriptive title for your trip</p>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-sm font-medium">
          Trip Vibe <span className="text-red-500">*</span>
        </Label>
        <CustomInput
          id="description"
          placeholder="Describe what makes this trip special — the experience, vibe, and what travellers can expect..."
          value={description}
          onChange={(e) => updateField('description', e.target.value)}
          variant="input"
          rows={5}
          required
        />
        <p className="text-xs text-muted-foreground">{description.length} characters</p>
      </div>

      {/* Category + Difficulty in one row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              Experience Type <span className="text-red-500">*</span>
            </Label>
            <button
              type="button"
              onClick={() => setIsSuggestModalOpen(true)}
              className="text-xs text-primary hover:text-primary/80 underline underline-offset-2"
            >
              + Suggest
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Select all that apply</p>
          <FormControl fullWidth>
            <MuiSelect<string[]>
              multiple
              value={category}
              onChange={(event: SelectChangeEvent<string[]>) => {
                const value = event.target.value as string[]
                setCategory(value)
              }}
              renderValue={(selected) =>
                (selected as string[]).length === 0
                  ? <span className="text-neutral-400 text-sm">Select types...</span>
                  : <span className="text-sm">{(selected as string[]).length} selected</span>
              }
              displayEmpty
              size="small"
              className="w-full px-4 rounded-2xl border border-neutral-200 text-sm text-maintext bg-white"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
              }}
            >
              {allCategories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  <Checkbox checked={category.includes(cat)} />
                  <ListItemText primary={cat} />
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
          {category.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {category.slice(0, 4).map((cat) => (
                <span key={cat} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-md text-xs">
                  {cat}
                  <button type="button" onClick={() => setCategory(category.filter((c) => c !== cat))}>
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              {category.length > 4 && (
                <span className="text-xs text-muted-foreground px-1">+{category.length - 4} more</span>
              )}
            </div>
          )}
        </div>

        {/* Difficulty */}
        <div className="space-y-1.5">
          <Label htmlFor="difficulty" className="text-sm font-medium">Difficulty</Label>
          <p className="text-xs text-muted-foreground">Physical demand of the trip</p>
          <CustomSelect
            id="difficulty"
            value={difficulty}
            placeholder="Select Difficulty"
            onChange={(val) => updateField('difficulty', val as TripDifficulty)}
            options={difficultyOptions}
            className="w-full"
          />
        </div>
      </div>

      {/* Custom categories chips */}
      {customCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {customCategories.map((cat) => (
            <div
              key={cat}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs"
            >
              <span>{cat}</span>
              <button type="button" onClick={() => removeCustomCategory(cat)} className="ml-1 hover:text-red-600 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Tags</Label>
        <div className="flex gap-3">
          <CustomInput
            id="tags"
            placeholder="Type a tag and press Enter or click Add"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyPress}
            variant="input"
          />
          <Button className="whitespace-nowrap" onClick={handleAddTag}>Add Tag</Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag: string, index: number) => (
              <div
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm"
              >
                <span>{tag}</span>
                <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive text-primary/70 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        {tags.length < VALIDATION_RULES.MIN_TAGS && (
          <p className="text-xs text-muted-foreground">{tags.length}/{VALIDATION_RULES.MIN_TAGS} tags — add {VALIDATION_RULES.MIN_TAGS - tags.length} more</p>
        )}
      </div>

      {/* Female Only + Location in a clean section */}
      <div className="space-y-4 pt-4 border-t border-neutral-100">
        <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50/60 px-4 py-3">
          <div>
            <Label className="text-sm font-medium">Female Only Trip</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Restrict this trip to female participants only</p>
          </div>
          <Toggle
            checked={isFemaleOnly}
            onCheckedChange={(val) => updateField('isFemaleOnly', val)}
            checkedLabel="Yes"
            uncheckedLabel="No"
          />
        </div>

        {/* City and State */}
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-sm">City</Label>
              <CustomInput
                id="city"
                placeholder="e.g., Manali"
                value={location.city || ''}
                onChange={(e) => updateLocationField('city', e.target.value)}
                variant="input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state" className="text-sm">State</Label>
              <CustomSelect
                id="state"
                value={location.state || ''}
                placeholder="Select State"
                onChange={(val) => updateLocationField('state', val)}
                options={stateOptions}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Suggest New Category Modal */}
      <Modal
        open={isSuggestModalOpen}
        onClose={() => setIsSuggestModalOpen(false)}
        onSubmit={handleAddCustomCategory}
        submitText='Add'
        title="Suggest New Experience Type"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="customCategory" className="text-sm">
              Experience Type Name
            </Label>
            <CustomInput
              id="customCategory"
              placeholder="e.g., Wildlife Safari"
              value={customCategoryInput}
              onChange={(e) => setCustomCategoryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddCustomCategory()
                }
              }}
              variant="input"
              className="mt-1"
            />
          </div>
          <div className="flex justify-end">
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default BasicInfoStep
