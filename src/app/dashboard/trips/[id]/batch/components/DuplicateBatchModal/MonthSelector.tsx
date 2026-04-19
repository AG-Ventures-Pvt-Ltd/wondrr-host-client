'use client'

import React from 'react'
import { getUpcomingMonths } from './constants'

interface MonthSelectorProps {
  selectedMonths: string[]
  onChange: (months: string[]) => void
}

const UPCOMING_MONTHS = getUpcomingMonths(12)

const MonthSelector: React.FC<MonthSelectorProps> = ({ selectedMonths, onChange }) => {
  const toggle = (value: string) => {
    onChange(
      selectedMonths.includes(value)
        ? selectedMonths.filter((m) => m !== value)
        : [...selectedMonths, value]
    )
  }

  return (
    <div>
      <p className="text-sm font-medium text-maintext mb-2">Effective Months</p>
      <div className="grid grid-cols-3 gap-2">
        {UPCOMING_MONTHS.map(({ label, value }) => {
          const active = selectedMonths.includes(value)
          return (
            <button
              key={value}
              type="button"
              onClick={() => toggle(value)}
              className={`text-xs px-2 py-1.5 rounded-lg border transition-colors text-left truncate
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
  )
}

export default MonthSelector
