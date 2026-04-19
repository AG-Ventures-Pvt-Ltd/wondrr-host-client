'use client'

import React, { useState, useMemo } from 'react'
import Modal from '@/common/components/composites/Modal'
import { ScheduleType, WeeklySchedule, MonthlySchedule, CustomSchedule, PreviewDate } from './types'
import { SCHEDULE_TABS } from './constants'
import WeeklyTab from './WeeklyTab'
import MonthlyTab from './MonthlyTab'
import CustomDatesTab from './CustomDatesTab'

interface DuplicateBatchModalProps {
  open: boolean
  onClose: () => void
  sourceBatchId: string
  /** Duration in full days (endDate - startDate). */
  durationDays: number
  onDuplicate: (payload: {
    sourceBatchId: string
    scheduleType: ScheduleType
    schedule: WeeklySchedule | MonthlySchedule | CustomSchedule
  }) => void
  isPending: boolean
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const addDays = (ymd: string, days: number): string => {
  const d = new Date(ymd + 'T00:00')
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const computeWeeklyPreview = (schedule: WeeklySchedule, durationDays: number): PreviewDate[] => {
  const results: PreviewDate[] = []
  for (const monthStr of schedule.months) {
    const [year, month] = monthStr.split('-').map(Number)
    const daysInMonth = new Date(year, month, 0).getDate()
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month - 1, d)
      if (schedule.daysOfWeek.includes(date.getDay())) {
        const startDate = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        results.push({ startDate, endDate: addDays(startDate, durationDays) })
      }
    }
  }
  return results
}

const computeMonthlyPreview = (schedule: MonthlySchedule, durationDays: number): PreviewDate[] =>
  schedule.months.map((monthStr) => {
    const [year, month] = monthStr.split('-').map(Number)
    const daysInMonth = new Date(year, month, 0).getDate()
    const day = Math.min(schedule.dayOfMonth, daysInMonth)
    const startDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return { startDate, endDate: addDays(startDate, durationDays) }
  })

const computeCustomPreview = (schedule: CustomSchedule, durationDays: number): PreviewDate[] =>
  schedule.startDates.map((startDate) => ({
    startDate,
    endDate: addDays(startDate, durationDays),
  }))

// ─── Component ──────────────────────────────────────────────────────────────

const DuplicateBatchModal: React.FC<DuplicateBatchModalProps> = ({
  open,
  onClose,
  sourceBatchId,
  durationDays,
  onDuplicate,
  isPending,
}) => {
  const [activeTab, setActiveTab] = useState<ScheduleType>('weekly')

  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({ daysOfWeek: [], months: [] })
  const [monthlySchedule, setMonthlySchedule] = useState<MonthlySchedule>({ dayOfMonth: 1, months: [] })
  const [customSchedule, setCustomSchedule] = useState<CustomSchedule>({ startDates: [] })

  const preview = useMemo<PreviewDate[]>(() => {
    if (activeTab === 'weekly') return computeWeeklyPreview(weeklySchedule, durationDays)
    if (activeTab === 'monthly') return computeMonthlyPreview(monthlySchedule, durationDays)
    return computeCustomPreview(customSchedule, durationDays)
  }, [activeTab, weeklySchedule, monthlySchedule, customSchedule, durationDays])

  const handleSubmit = () => {
    const schedule =
      activeTab === 'weekly' ? weeklySchedule
      : activeTab === 'monthly' ? monthlySchedule
      : customSchedule
    onDuplicate({ sourceBatchId, scheduleType: activeTab, schedule })
  }

  const submitDisabled = isPending || preview.length === 0

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Duplicate Batch"
      description="Choose a schedule to generate new batches from this one. Only dates change — all other details are copied."
      submitText={isPending ? 'Creating…' : `Create ${preview.length > 0 ? preview.length + ' ' : ''}Batch${preview.length !== 1 ? 'es' : ''}`}
      onSubmit={handleSubmit}
      disabled={submitDisabled}
    >
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-5">
        {SCHEDULE_TABS.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            onClick={() => setActiveTab(value)}
            className={`flex-1 py-1.5 rounded-md text-sm transition-colors font-medium
              ${activeTab === value
                ? 'bg-white text-maintext shadow-sm'
                : 'text-subtext hover:text-maintext'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'weekly' && (
        <WeeklyTab schedule={weeklySchedule} onChange={setWeeklySchedule} preview={preview} />
      )}
      {activeTab === 'monthly' && (
        <MonthlyTab schedule={monthlySchedule} onChange={setMonthlySchedule} preview={preview} />
      )}
      {activeTab === 'custom' && (
        <CustomDatesTab
          schedule={customSchedule}
          onChange={setCustomSchedule}
          preview={preview}
          durationDays={durationDays}
        />
      )}
    </Modal>
  )
}

export default DuplicateBatchModal
