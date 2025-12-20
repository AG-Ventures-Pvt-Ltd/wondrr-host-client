'use client'

import React, { useState } from 'react'
import { Label } from '@/common/ui/label'
import { Badge } from '@/common/ui/badge'
import { DollarSign, Plus, Trash2, X } from 'lucide-react'
import CustomInput from '@/common/components/composites/CustomInput'
import { useTripFormStore } from '../../store'
import { useItineraryManager } from '../../hooks'
import { VALIDATION_RULES } from '../../constants'

interface PricingItineraryStepProps {
  isEditMode?: boolean
}

const PricingItineraryStep: React.FC<PricingItineraryStepProps> = ({ isEditMode = false }) => {
  const { basePrice, price, updateField } = useTripFormStore()
  const { 
    itinerary, 
    addItineraryDay, 
    updateItineraryDay, 
    updateItineraryTitle,
    addItineraryActivity,
    removeItineraryActivity,
    removeItineraryDay 
  } = useItineraryManager()

  const [activityInputs, setActivityInputs] = useState<{ [key: number]: string }>({})

  const handleAddActivity = (dayId: number) => {
    const activity = activityInputs[dayId]?.trim()
    if (activity) {
      addItineraryActivity(dayId, activity)
      setActivityInputs({ ...activityInputs, [dayId]: '' })
    }
  }

  return (
    <div className="space-y-8">
      {/* Pricing Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-neutral-900">Pricing</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Base Price */}
          <div className="space-y-2">
            <Label htmlFor="basePrice" className="text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-neutral-400" />
              Base Price per Person
            </Label>
            <CustomInput
              id="basePrice"
              type="number"
              placeholder="8500"
              value={basePrice === null ? '' : basePrice}
              onChange={(e) => updateField('basePrice', e.target.value ? Number(e.target.value) : null)}
              variant="input"
              required
              disabled={isEditMode}
            />
            <p className="text-xs text-muted-foreground">
              Starting price for this trip
            </p>
          </div>

          {/* Max Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-neutral-400" />
              Price per Person
            </Label>
            <CustomInput
              id="price"
              type="number"
              placeholder="10000"
              value={price === null ? '' : price}
              onChange={(e) => updateField('price', e.target.value ? Number(e.target.value) : null)}
              variant="input"
              required
              disabled={isEditMode}
            />
            <p className="text-xs text-muted-foreground">
              Price for this trip
            </p>
          </div>
        </div>
      </div>

      {/* Itinerary Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-neutral-900">Trip Itinerary</h3>
          <Badge variant="secondary">
            {itinerary.length} day{itinerary.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        <div className="space-y-4">
          {itinerary.map((day) => (
            <div
              key={day.id}
              className="bg-neutral-50/50 rounded-2xl border border-neutral-200/50 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Day {day.dayNumber}</Label>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-500">
                    {day.wordCount}/{VALIDATION_RULES.MAX_ITINERARY_WORDS} words
                  </span>
                  {!isEditMode && itinerary.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItineraryDay(day.id)}
                      className="text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor={`itinerary-title-${day.id}`} className="text-xs">
                  Day Title
                </Label>
                <CustomInput
                  id={`itinerary-title-${day.id}`}
                  placeholder={`e.g., Day ${day.dayNumber}: Arrival`}
                  value={day.title}
                  onChange={(e) => updateItineraryTitle(day.id, e.target.value)}
                  variant="input"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor={`itinerary-day-${day.id}`} className="text-xs">
                  Description
                </Label>
                <CustomInput
                  id={`itinerary-day-${day.id}`}
                  placeholder="Describe the activities for this day..."
                  value={day.description}
                  onChange={(e) => updateItineraryDay(day.id, e.target.value)}
                  variant="textarea"
                  rows={3}
                  required
                />
                {day.wordCount > VALIDATION_RULES.MAX_ITINERARY_WORDS && (
                  <p className="text-xs text-red-500">
                    Exceeds {VALIDATION_RULES.MAX_ITINERARY_WORDS} words limit by{' '}
                    {day.wordCount - VALIDATION_RULES.MAX_ITINERARY_WORDS} words
                  </p>
                )}
              </div>

              {/* Activities */}
              <div className="space-y-2">
                <Label className="text-xs">Activities</Label>
                <div className="flex gap-2">
                  <CustomInput
                    placeholder="e.g., Check-in"
                    value={activityInputs[day.id] || ''}
                    onChange={(e) => setActivityInputs({ ...activityInputs, [day.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddActivity(day.id)
                      }
                    }}
                    variant="input"
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddActivity(day.id)}
                    className="w-10 h-10 rounded-2xl border border-neutral-200/60 flex items-center justify-center hover:bg-neutral-50 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-neutral-400" />
                  </button>
                </div>
                {day.activities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {day.activities.map((activity, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm"
                      >
                        <span>{activity}</span>
                        <button
                          type="button"
                          onClick={() => removeItineraryActivity(day.id, index)}
                          className="ml-1 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {!isEditMode && (
          <button
            type="button"
            onClick={addItineraryDay}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Another Day
          </button>
        )}
      </div>
    </div>
  )
}

export default PricingItineraryStep
