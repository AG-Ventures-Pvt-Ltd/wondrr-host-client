'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { CustomSchedule, PreviewDate } from './types'
import { MONTH_SHORT } from './constants'

interface CustomDatesTabProps {
  schedule: CustomSchedule
  onChange: (s: CustomSchedule) => void
  preview: PreviewDate[]
  durationDays: number
}

const toYMD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const formatDisplay = (d: string) => {
  const date = new Date(d + 'T00:00')
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const CustomDatesTab: React.FC<CustomDatesTabProps> = ({ schedule, onChange, preview, durationDays }) => {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const goToPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const goToNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const toggleDate = (ymd: string) => {
    const next = schedule.startDates.includes(ymd)
      ? schedule.startDates.filter((d) => d !== ymd)
      : [...schedule.startDates, ymd].sort()
    onChange({ startDates: next })
  }

  const removeDate = (ymd: string) => {
    onChange({ startDates: schedule.startDates.filter((d) => d !== ymd) })
  }

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const todayYMD = toYMD(today)

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* Calendar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <button type="button" onClick={goToPrev} className="p-1 rounded hover:bg-gray-100">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium text-maintext">
            {MONTH_SHORT[viewMonth]} {viewYear}
          </span>
          <button type="button" onClick={goToNext} className="p-1 rounded hover:bg-gray-100">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <div key={d} className="text-center text-xs text-subtext py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Date cells */}
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, idx) => {
            if (!day) return <div key={idx} />
            const ymd = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const isSelected = schedule.startDates.includes(ymd)
            const isPast = ymd < todayYMD
            return (
              <button
                key={idx}
                type="button"
                onClick={() => !isPast && toggleDate(ymd)}
                disabled={isPast}
                className={`w-full aspect-square flex items-center justify-center rounded-lg text-xs transition-colors
                  ${isPast
                    ? 'text-gray-300 cursor-not-allowed'
                    : isSelected
                    ? 'bg-primary text-white'
                    : 'hover:bg-primary/10 text-maintext'
                  }`}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected dates list */}
      {schedule.startDates.length > 0 && (
        <div>
          <p className="text-sm font-medium text-maintext mb-2">
            Selected — {schedule.startDates.length} batch{schedule.startDates.length !== 1 ? 'es' : ''}
            {durationDays > 0 ? ` (${durationDays} day${durationDays !== 1 ? 's' : ''} each)` : ''}
          </p>
          <div className="max-h-40 overflow-y-auto flex flex-col gap-1.5 pr-1">
            {preview.map(({ startDate, endDate }, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-maintext">{formatDisplay(startDate)}</span>
                  <span className="text-subtext">→</span>
                  <span className="text-maintext">{formatDisplay(endDate)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeDate(startDate)}
                  className="ml-2 text-gray-400 hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomDatesTab
