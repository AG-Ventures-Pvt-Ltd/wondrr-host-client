'use client'

import React from 'react'
import { MonthlySchedule, PreviewDate } from './types'
import { DAY_OF_MONTH_OPTIONS } from './constants'
import MonthSelector from './MonthSelector'

interface MonthlyTabProps {
  schedule: MonthlySchedule
  onChange: (s: MonthlySchedule) => void
  preview: PreviewDate[]
}

const MonthlyTab: React.FC<MonthlyTabProps> = ({ schedule, onChange, preview }) => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm font-medium text-maintext mb-2">Day of Month</p>
        <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1">
          {DAY_OF_MONTH_OPTIONS.map(({ label, value }) => {
            const active = schedule.dayOfMonth === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => onChange({ ...schedule, dayOfMonth: value })}
                className={`w-10 h-9 rounded-lg text-xs border transition-colors flex-shrink-0
                  ${active
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-maintext border-gray-200 hover:border-primary'
                  }`}
              >
                {label}
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
      )}
    </div>
  )
}

const formatPreviewDate = (d: string) => {
  const date = new Date(d + 'T00:00')
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default MonthlyTab
