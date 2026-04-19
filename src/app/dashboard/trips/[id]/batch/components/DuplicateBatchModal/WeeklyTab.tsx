'use client'

import React from 'react'
import { WeeklySchedule, PreviewDate } from './types'
import { DAY_LABELS } from './constants'
import MonthSelector from './MonthSelector'

interface WeeklyTabProps {
  schedule: WeeklySchedule
  onChange: (s: WeeklySchedule) => void
  preview: PreviewDate[]
}

const WeeklyTab: React.FC<WeeklyTabProps> = ({ schedule, onChange, preview }) => {
  const toggleDay = (day: number) => {
    const next = schedule.daysOfWeek.includes(day)
      ? schedule.daysOfWeek.filter((d) => d !== day)
      : [...schedule.daysOfWeek, day]
    onChange({ ...schedule, daysOfWeek: next })
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm font-medium text-maintext mb-2">Repeat on Days</p>
        <div className="flex flex-wrap gap-2">
          {DAY_LABELS.map(({ short, value }) => {
            const active = schedule.daysOfWeek.includes(value)
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleDay(value)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-colors
                  ${active
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-maintext border-gray-200 hover:border-primary'
                  }`}
              >
                {short}
              </button>
            )
          })}
        </div>
      </div>

      <MonthSelector
        selectedMonths={schedule.months}
        onChange={(months) => onChange({ ...schedule, months })}
      />

      {preview.length > 0 && (
        <PreviewList preview={preview} />
      )}
    </div>
  )
}

const PreviewList: React.FC<{ preview: PreviewDate[] }> = ({ preview }) => (
  <div>
    <p className="text-sm font-medium text-maintext mb-2">
      Preview — {preview.length} batch{preview.length !== 1 ? 'es' : ''} will be created
    </p>
    <div className="max-h-40 overflow-y-auto flex flex-col gap-1.5 pr-1">
      {preview.map(({ startDate, endDate }, i) => (
        <div key={i} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
          <span className="text-maintext">{formatPreviewDate(startDate)}</span>
          <span className="text-subtext mx-2">→</span>
          <span className="text-maintext">{formatPreviewDate(endDate)}</span>
        </div>
      ))}
    </div>
  </div>
)

const formatPreviewDate = (d: string) => {
  const date = new Date(d + 'T00:00')
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default WeeklyTab
