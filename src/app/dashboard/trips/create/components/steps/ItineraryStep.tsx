'use client'

import React from 'react'
import { Label } from '@/common/ui/label'
import { Badge } from '@/common/ui/badge'
import { Plus, Trash2, X } from 'lucide-react'
import CustomInput from '@/common/components/composites/CustomInput'
import { useItineraryManager } from '../../hooks'
import { VALIDATION_RULES } from '../../constants'
import { countWords, toItineraryPoints } from '../../utils'
import { ItineraryDay } from '../../types'
import { useTripFormStore } from '../../store'
import CustomSelect from '@/common/components/composites/CustomSelect'

interface ItineraryStepProps {
  isEditMode?: boolean
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const MONTH_OPTIONS = MONTHS.map(month => ({ value: month, label: month }))

// Point-wise day plan, same add/paste/remove flow as inclusions
const ItineraryDayPoints: React.FC<{
  day: ItineraryDay
  onAdd: (id: number, points: string[]) => void
  onRemove: (id: number, index: number) => void
}> = ({ day, onAdd, onRemove }) => {
  const [input, setInput] = React.useState('')

  const addFromText = (text: string) => {
    const points = toItineraryPoints(text)
    if (points.length) onAdd(day.id, points)
  }

  const handleAdd = () => {
    addFromText(input)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text')
    if (toItineraryPoints(pasted).length > 1) {
      e.preventDefault()
      addFromText(pasted)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <CustomInput
          id={`itinerary-day-${day.id}`}
          placeholder="e.g., Drive from Delhi to Manali (press Enter or paste a paragraph)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          variant="input"
          className="flex-1"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="w-10 h-10 rounded-2xl border border-neutral-200/60 flex items-center justify-center hover:bg-neutral-50 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 text-neutral-400" />
        </button>
      </div>
      {day.description.length > 0 && (
        <div className="space-y-2">
          {day.description.map((point, index) => (
            <div
              key={`${index}-${point}`}
              className="flex items-center justify-between px-3 py-2.5 bg-white border border-neutral-200/60 rounded-lg"
            >
              <span className="text-sm text-neutral-900">{point}</span>
              <button
                type="button"
                onClick={() => onRemove(day.id, index)}
                className="text-neutral-400 hover:text-red-500 transition-colors ml-3 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const ItineraryStep: React.FC<ItineraryStepProps> = () => {
  const {
    itinerary,
    addItineraryDay,
    addItineraryPoints,
    removeItineraryPoint,
    updateItineraryTitle,
    removeItineraryDay,
    itineraryStartDay,
    setItineraryStartDay,
  } = useItineraryManager()

  const { bestTimeToVisit, updateField } = useTripFormStore()

  // Use local state for each dropdown so selections are shown immediately,
  // even before both months are chosen. The store value is the source of truth
  // on mount; after that local state drives the selects.
  const [localStartMonth, setLocalStartMonth] = React.useState(() =>
    bestTimeToVisit ? bestTimeToVisit.split(' - ')[0] ?? '' : ''
  )
  const [localEndMonth, setLocalEndMonth] = React.useState(() =>
    bestTimeToVisit ? bestTimeToVisit.split(' - ')[1] ?? '' : ''
  )

  const handleStartMonthChange = (value: string) => {
    setLocalStartMonth(value)
    if (value && localEndMonth) {
      updateField('bestTimeToVisit', `${value} - ${localEndMonth}`)
    } else {
      updateField('bestTimeToVisit', '')
    }
  }

  const handleEndMonthChange = (value: string) => {
    setLocalEndMonth(value)
    if (localStartMonth && value) {
      updateField('bestTimeToVisit', `${localStartMonth} - ${value}`)
    } else {
      updateField('bestTimeToVisit', '')
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Trip Itinerary</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Describe what happens on each day of the trip.</p>
        </div>
        {itinerary.length > 0 && (
          <Badge variant="secondary" className="shrink-0">
            {itinerary.length} day{itinerary.length !== 1 ? 's' : ''}
          </Badge>
        )}
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

        {itinerary.map((day) => {
          const wordCount = countWords(day.description)
          return (
          <div
            key={day.id}
            className="bg-neutral-50/50 rounded-2xl border border-neutral-200/50 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Day {day.dayNumber}</Label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-500">
                  {wordCount}/{VALIDATION_RULES.MAX_ITINERARY_WORDS} words
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
                Plan for the day
              </Label>
              <ItineraryDayPoints day={day} onAdd={addItineraryPoints} onRemove={removeItineraryPoint} />
              {wordCount > VALIDATION_RULES.MAX_ITINERARY_WORDS && (
                <p className="text-xs text-red-500">
                  Exceeds {VALIDATION_RULES.MAX_ITINERARY_WORDS} words limit by{' '}
                  {wordCount - VALIDATION_RULES.MAX_ITINERARY_WORDS} words
                </p>
              )}
            </div>
          </div>
          )
        })}

      <button
        type="button"
        onClick={addItineraryDay}
        className="flex items-center gap-1.5 text-xs text-primary border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary/5 transition-colors font-medium"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Day
      </button>

      {/* ── Best Time to Visit ──────────────────────────────────────────────── */}
      <div className="space-y-4 pt-8 border-t border-neutral-100">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Best Time to Visit</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Indicate the ideal months for this trip.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Start Month</Label>
            <CustomSelect
              value={localStartMonth}
              onChange={handleStartMonthChange}
              placeholder="Select month"
              options={MONTH_OPTIONS}
              className="w-full"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">End Month</Label>
            <CustomSelect
              value={localEndMonth}
              onChange={handleEndMonthChange}
              placeholder="Select month"
              options={MONTH_OPTIONS}
              className="w-full"
            />
          </div>
        </div>
        {(localStartMonth || localEndMonth) && (
          <p className="text-xs text-neutral-500">
            Best time: <span className="font-medium text-neutral-700">{localStartMonth || '?'} - {localEndMonth || '?'}</span>
          </p>
        )}
      </div>
    </div>
  )
}

export default ItineraryStep
