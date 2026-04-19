'use client'

import React from 'react'
import { Label } from '@/common/ui/label'
import { Badge } from '@/common/ui/badge'
import { Plus, Trash2 } from 'lucide-react'
import CustomInput from '@/common/components/composites/CustomInput'
import { useItineraryManager } from '../../hooks'
import { VALIDATION_RULES } from '../../constants'

interface ItineraryStepProps {
  isEditMode?: boolean
}

const ItineraryStep: React.FC<ItineraryStepProps> = ({ isEditMode = false }) => {
  const {
    itinerary,
    addItineraryDay,
    updateItineraryDay,
    updateItineraryTitle,
    removeItineraryDay,
    itineraryStartDay,
    setItineraryStartDay,
  } = useItineraryManager()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-neutral-900">Trip Itinerary</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Describe what happens on each day of the trip.</p>
        </div>
        <Badge variant="secondary">
          {itinerary.length} day{itinerary.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-600">Start numbering from:</span>
        <div className="flex rounded-lg border border-neutral-200 overflow-hidden text-sm">
            <button
              type="button"
              onClick={() => setItineraryStartDay(0)}
              className={`px-3 py-1.5 transition-colors ${
                itineraryStartDay === 0
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              Day 0
            </button>
            <button
              type="button"
              onClick={() => setItineraryStartDay(1)}
              className={`px-3 py-1.5 transition-colors ${
                itineraryStartDay === 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              Day 1
            </button>
          </div>
      </div>

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
                <button
                  type="button"
                  onClick={() => removeItineraryDay(day.id)}
                  className="text-neutral-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor={`itinerary-day-${day.id}`} className="text-xs">
                Description
              </Label>
              <CustomInput
                id={`itinerary-day-${day.id}`}
                placeholder="Describe the highlights and plan for this day..."
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
          </div>
        ))}

      <button
        type="button"
        onClick={addItineraryDay}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Another Day
      </button>
    </div>
  )
}

export default ItineraryStep
